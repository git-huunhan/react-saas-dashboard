import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  Bug,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Crown,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useIsMutating } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUsers } from "@/features/users/model/mockUsers";

import {
  KANBAN_COLUMNS,
  useCreateTask,
  useDeleteTask,
  useTasksByProject,
  useUpdateTask,
  useUpdateTaskStatus,
} from "@/features/tasks";
import type { Task, TaskStatus } from "../../model/types";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import { TaskCard } from "../TaskCard/TaskCard";
import { TaskDetailModal } from "../TaskDetailModal/TaskDetailModal";
import { TaskFormModal } from "../TaskFormModal/TaskFormModal";

interface KanbanBoardProps {
  projectId: string;
  searchQuery?: string;
  parentIds?: string[];
  assigneeIds?: string[];
  priorities?: string[];
  statuses?: string[];
  workTypes?: string[];
  labels?: string[];
  groupBy?: string;
  headerSlot?: React.ReactNode;
}

import { useViewSettingsStore } from "../../model/useViewSettingsStore";

function SwimlaneGroup({
  title,
  taskCount,
  avatar,
  isFallbackGroup,
  parentTask,
  children,
}: {
  title: string;
  taskCount: number;
  avatar?: string;
  isFallbackGroup?: boolean;
  parentTask?: Task;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { expandAllCounter, collapseAllCounter } = useViewSettingsStore();

  useEffect(() => {
    if (expandAllCounter > 0) setIsExpanded(true);
  }, [expandAllCounter]);

  useEffect(() => {
    if (collapseAllCounter > 0) setIsExpanded(false);
  }, [collapseAllCounter]);

  return (
    <div className="flex flex-col w-full min-w-max mb-6 last:mb-0">
      <div
        className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md mb-2 sticky left-0 w-fit transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-muted-foreground flex items-center justify-center w-5 h-6">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>

        {!isFallbackGroup &&
          parentTask &&
          (parentTask.type === "epic" ? (
            <div className="ml-1 flex">
              <Crown className="w-4 h-4 text-purple-500" />
            </div>
          ) : parentTask.type === "bug" ? (
            <div className="ml-1 flex">
              <Bug className="w-4 h-4 text-red-500" />
            </div>
          ) : (
            <div className="ml-1 flex">
              <ClipboardList className="w-4 h-4 text-primary" />
            </div>
          ))}

        {!isFallbackGroup && !parentTask && avatar && (
          <Avatar className="w-6 h-6 border ml-1">
            <AvatarImage src={avatar} />
            <AvatarFallback>{title[0]}</AvatarFallback>
          </Avatar>
        )}

        {isFallbackGroup && title === "Unassigned" && (
          <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20 shrink-0 ml-1">
            <UserIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
          </div>
        )}

        {!isFallbackGroup && !parentTask && !avatar && (
          <Avatar className="w-6 h-6 border bg-muted flex items-center justify-center text-[10px] text-muted-foreground ml-1">
            <AvatarFallback>{title[0]}</AvatarFallback>
          </Avatar>
        )}

        <div className="flex items-center gap-2 ml-2">
          {parentTask && (
            <span className="text-[13px] text-muted-foreground font-medium">
              {parentTask.code || `TASK-${parentTask.id.slice(-3)}`}
            </span>
          )}
          <span className="font-semibold text-[13px]">{title}</span>
          <span className="text-[11px] text-muted-foreground font-medium translate-y-[1px]">
            ({taskCount} work item{taskCount !== 1 ? "s" : ""})
          </span>
          {parentTask && (
            <div className="ml-2 px-2 py-0.5 rounded-[4px] bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider">
              {KANBAN_COLUMNS.find((c) => c.id === parentTask.status)?.title ||
                parentTask.status}
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="flex h-fit max-h-full min-h-0">{children}</div>
      )}
    </div>
  );
}

export function KanbanBoard({
  projectId,
  searchQuery = "",
  parentIds = [],
  assigneeIds = [],
  priorities = [],
  statuses = [],
  workTypes = [],
  labels = [],
  groupBy = "None",
  headerSlot,
}: KanbanBoardProps) {
  const { data: serverTasks, isLoading } = useTasksByProject(projectId);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isDraggingRef = useRef(false); // ref syncs synchronously, unlike state
  const isMutating = useIsMutating();

  useEffect(() => {
    if (!serverTasks) return;
    // If not yet initialized, set everything from server
    if (localTasks.length === 0) {
      setLocalTasks(serverTasks);
      return;
    }
    // While dragging (check ref) OR mutating (updating to server), skip sync
    // This prevents stale server responses from overwriting optimistic local state
    if (isDraggingRef.current || isMutating > 0) return;

    // Merge: preserve the current local order but update any field that changed on the server.
    // Also add newly-created tasks and remove deleted ones.
    setLocalTasks((prev) => {
      const serverMap = new Map(serverTasks.map((t) => [t.id, t]));
      const serverIds = new Set(serverTasks.map((t) => t.id));

      // Update / keep existing tasks in their current order
      const merged = prev
        .filter((t) => serverIds.has(t.id))
        .map((t) => {
          const fromServer = serverMap.get(t.id);
          return fromServer ? { ...fromServer } : t;
        });

      // Append any brand-new tasks that aren't in prev yet
      serverTasks.forEach((st) => {
        if (!prev.find((t) => t.id === st.id)) {
          merged.push(st);
        }
      });

      return merged;
    });
  }, [serverTasks, isMutating]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sync selectedTask with the latest data from localTasks
  useEffect(() => {
    if (selectedTask) {
      const updated = localTasks.find((t) => t.id === selectedTask.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedTask)) {
        setSelectedTask(updated);
      }
    }
  }, [localTasks, selectedTask]);

  const updateStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousLocalTasksRef = useRef<Task[]>([]);
  const draggingGroupsRef = useRef<{
    grouped: string[];
    hasUngrouped: boolean;
  }>({
    grouped: [],
    hasUngrouped: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    isDraggingRef.current = true; // set ref BEFORE setActiveId (synchronous)
    setActiveId(event.active.id as string);
    previousLocalTasksRef.current = localTasks;

    // Capture currently visible groups to keep them alive during drag
    const currentGroups = new Set<string>();
    let currentHasUngrouped = false;

    filteredTasks.forEach((t) => {
      if (groupBy === "Assignee") {
        if (t.assigneeId) currentGroups.add(t.assigneeId);
        else currentHasUngrouped = true;
      } else if (groupBy === "Epic") {
        const parent = serverTasks.find((pt) => pt.id === t.parentId);
        if (parent && parent.type === "epic") currentGroups.add(parent.id);
        else currentHasUngrouped = true;
      } else if (groupBy === "Subtask") {
        if (t.parentId) currentGroups.add(t.parentId);
        else currentHasUngrouped = true;
      }
    });

    draggingGroupsRef.current = {
      grouped: Array.from(currentGroups),
      hasUngrouped: currentHasUngrouped,
    };
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    setLocalTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);

      if (isOverTask) {
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const overTask = tasks[overIndex];
        const overStatus = overTask.status;
        const activeTask = tasks[activeIndex];

        let shouldUpdate = false;
        const newActiveTask = { ...activeTask };

        if (activeTask.status !== overStatus) {
          newActiveTask.status = overStatus;
          shouldUpdate = true;
        }

        // Handle moving between swimlanes
        if (
          groupBy === "Assignee" &&
          activeTask.assigneeId !== overTask.assigneeId
        ) {
          newActiveTask.assigneeId = overTask.assigneeId;
          if (overTask.assigneeId) {
            const newUser = mockUsers.find((u) => u.id === overTask.assigneeId);
            if (newUser) {
              newActiveTask.assignee = {
                id: newUser.id,
                name: newUser.name,
                avatarUrl: newUser.avatarUrl || "",
              };
            }
          } else {
            newActiveTask.assignee = undefined;
          }
          shouldUpdate = true;
        } else if (groupBy === "Epic" || groupBy === "Subtask") {
          let targetParentId = undefined;
          if (groupBy === "Epic") {
            if (overTask.type === "epic") {
              targetParentId = overTask.id;
            } else {
              const parent = serverTasks.find(
                (pt) => pt.id === overTask.parentId,
              );
              if (parent && parent.type === "epic") targetParentId = parent.id;
            }
          } else if (groupBy === "Subtask") {
            targetParentId = overTask.parentId;
          }

          if (activeTask.parentId !== targetParentId) {
            newActiveTask.parentId = targetParentId;
            shouldUpdate = true;
          }
        }

        const newTasks = [...tasks];
        const activeTaskObj = newTasks.splice(activeIndex, 1)[0];

        if (shouldUpdate) {
          Object.assign(activeTaskObj, newActiveTask);
        }

        const targetIndex = newTasks.findIndex((t) => t.id === overId);

        // Determine if we should insert below or above based on pointer position
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top >
            over.rect.top + over.rect.height / 2;

        const insertIndex = isBelowOverItem ? targetIndex + 1 : targetIndex;
        newTasks.splice(insertIndex, 0, activeTaskObj);

        return newTasks;
      }

      if (isOverColumn) {
        const overStatus = over.data.current?.column as TaskStatus;
        const overGroupId = over.data.current?.groupId as string | undefined;
        const activeTask = tasks[activeIndex];

        let shouldUpdate = false;
        const newActiveTask = { ...activeTask };

        if (activeTask.status !== overStatus) {
          newActiveTask.status = overStatus;
          shouldUpdate = true;
        }

        if (groupBy === "Assignee") {
          const targetAssigneeId =
            overGroupId === "ungrouped" ? undefined : overGroupId;
          if (activeTask.assigneeId !== targetAssigneeId) {
            newActiveTask.assigneeId = targetAssigneeId;
            if (targetAssigneeId) {
              const newUser = mockUsers.find((u) => u.id === targetAssigneeId);
              if (newUser) {
                newActiveTask.assignee = {
                  id: newUser.id,
                  name: newUser.name,
                  avatarUrl: newUser.avatarUrl || "",
                };
              }
            } else {
              newActiveTask.assignee = undefined;
            }
            shouldUpdate = true;
          }
        } else if (groupBy === "Epic" || groupBy === "Subtask") {
          const targetParentId =
            overGroupId === "ungrouped" ? undefined : overGroupId;
          if (activeTask.parentId !== targetParentId) {
            newActiveTask.parentId = targetParentId;
            shouldUpdate = true;
          }
        }

        const newTasks = [...tasks];
        const activeTaskObj = newTasks.splice(activeIndex, 1)[0];

        if (shouldUpdate) {
          Object.assign(activeTaskObj, newActiveTask);
        }

        // When dropping on empty column, just put at the end
        newTasks.push(activeTaskObj);
        return newTasks;
      }

      return tasks;
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    isDraggingRef.current = false; // reset ref immediately when drag ends
    setActiveId(null);
    const { active, over } = event;
    if (!over) {
      setLocalTasks(previousLocalTasksRef.current);
      return;
    }

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    const updatedTask = localTasks.find((t) => t.id === activeIdStr);
    if (updatedTask) {
      const originalTask = serverTasks.find((t) => t.id === activeIdStr);
      let statusChanged = false;
      let dataChanged = false;
      const dataToUpdate: any = {};

      if (originalTask) {
        if (originalTask.status !== updatedTask.status) {
          statusChanged = true;
        }
        if (
          groupBy === "Assignee" &&
          originalTask.assigneeId !== updatedTask.assigneeId
        ) {
          dataToUpdate.assigneeId =
            updatedTask.assigneeId === undefined
              ? null
              : updatedTask.assigneeId;
          dataChanged = true;
        } else if (
          (groupBy === "Epic" || groupBy === "Subtask") &&
          originalTask.parentId !== updatedTask.parentId
        ) {
          dataToUpdate.parentId =
            updatedTask.parentId === undefined ? null : updatedTask.parentId;
          dataChanged = true;
        }
      }

      if (dataChanged) {
        if (statusChanged) {
          dataToUpdate.status = updatedTask.status;
        }
        updateTask.mutate({
          taskId: updatedTask.id,
          data: dataToUpdate,
        });
      } else if (statusChanged) {
        updateStatus.mutate({
          taskId: updatedTask.id,
          status: updatedTask.status,
        });
      }
    }
  };

  const handleCreate = (data: {
    title: string;
    type: "task" | "epic" | "bug";
    assigneeId: string | null;
    dueDate: string | null;
    status: string;
  }) => {
    createTask.mutate(
      {
        title: data.title,
        type: data.type,
        status: data.status as any,
        priority: "medium",
        labels: [],
        assigneeId: data.assigneeId || undefined,
        dueDate: data.dueDate || undefined,
        projectId,
      },
      {
        onSuccess: () => toast.success("Task created"),
        onError: () => toast.error("Failed to create task"),
      },
    );
  };

  const handleEdit = (data: TaskFormData) => {
    if (!editingTask) return;
    updateTask.mutate(
      {
        taskId: editingTask.id,
        data: { ...data, assigneeId: data.assigneeId || undefined },
      },
      {
        onSuccess: () => {
          setEditingTask(null);
          toast.success("Task updated");
        },
        onError: () => toast.error("Failed to update task"),
      },
    );
  };

  const handleDelete = (task: Task) => {
    deleteTask.mutate(
      { taskId: task.id, projectId: task.projectId },
      {
        onSuccess: () => {
          setSelectedTask(null);
          toast.success("Task deleted");
        },
        onError: () => toast.error("Failed to delete task"),
      },
    );
  };

  const activeTask = useMemo(
    () => localTasks.find((t) => t.id === activeId),
    [activeId, localTasks],
  );

  const filteredTasks = useMemo(() => {
    return localTasks.filter((t) => {
      // In Jira, Epics are not shown as cards on the Kanban board
      if (t.type === "epic") return false;

      if (
        searchQuery &&
        !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.code.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (parentIds.length > 0) {
        if (parentIds.includes("no-parent") && !t.parentId) {
          // keep
        } else if (t.parentId && parentIds.includes(t.parentId)) {
          // keep
        } else {
          return false;
        }
      }
      if (assigneeIds.length > 0) {
        if (assigneeIds.includes("unassigned") && !t.assigneeId) {
          // keep
        } else if (t.assigneeId && assigneeIds.includes(t.assigneeId)) {
          // keep
        } else {
          return false;
        }
      }
      if (priorities.length > 0 && !priorities.includes(t.priority)) {
        return false;
      }
      if (statuses.length > 0 && !statuses.includes(t.status)) {
        return false;
      }
      if (workTypes.length > 0) {
        if (!t.type || !workTypes.includes(t.type)) return false;
      }
      if (labels.length > 0) {
        if (!t.labels || !labels.some((l) => t.labels!.includes(l)))
          return false;
      }
      return true;
    });
  }, [
    localTasks,
    searchQuery,
    parentIds,
    assigneeIds,
    priorities,
    statuses,
    workTypes,
    labels,
  ]);

  if (isLoading)
    return (
      <div className="flex flex-col h-full overflow-hidden pt-0">
        {headerSlot}
        <div className="flex flex-col flex-1 overflow-auto px-6 md:px-8 pb-4 items-start">
          <div className="flex gap-4 h-fit max-h-full min-h-0 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border bg-muted/50 min-w-70 w-70 h-[350px]"
              />
            ))}
            <div className="w-1 shrink-0" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-full overflow-hidden pt-0">
      {headerSlot}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div
          className="flex flex-col flex-1 min-h-0 overflow-x-auto overflow-y-auto px-6 pb-6 md:px-8 md:pb-8 items-start relative custom-scrollbar"
          ref={scrollContainerRef}
        >
          {groupBy !== "None" ? (
            <div className="flex flex-col w-full">
              {(() => {
                const grouped = new Map<string, Task[]>();
                const ungrouped: Task[] = [];
                let hasUngroupedInServer = false;

                // Pre-populate groups based on state before drag started to prevent them from disappearing
                if (activeId !== null) {
                  draggingGroupsRef.current.grouped.forEach((groupId) => {
                    grouped.set(groupId, []);
                  });
                  hasUngroupedInServer = draggingGroupsRef.current.hasUngrouped;
                }

                filteredTasks.forEach((t) => {
                  if (groupBy === "Assignee") {
                    if (t.assigneeId) {
                      if (!grouped.has(t.assigneeId))
                        grouped.set(t.assigneeId, []);
                      grouped.get(t.assigneeId)!.push(t);
                    } else {
                      ungrouped.push(t);
                    }
                  } else if (groupBy === "Epic") {
                    const parent = serverTasks.find(
                      (pt) => pt.id === t.parentId,
                    );
                    if (parent && parent.type === "epic") {
                      if (!grouped.has(parent.id)) grouped.set(parent.id, []);
                      grouped.get(parent.id)!.push(t);
                    } else {
                      ungrouped.push(t);
                    }
                  } else if (groupBy === "Subtask") {
                    if (t.parentId) {
                      if (!grouped.has(t.parentId)) grouped.set(t.parentId, []);
                      grouped.get(t.parentId)!.push(t);
                    } else {
                      ungrouped.push(t);
                    }
                  }
                });

                const ungroupedTitle =
                  groupBy === "Assignee"
                    ? "Unassigned"
                    : groupBy === "Epic"
                      ? "No Epic"
                      : "Everything else";

                return (
                  <>
                    {Array.from(grouped.entries()).map(([groupId, tasks]) => {
                      let title = groupId;
                      let avatar = undefined;
                      let parentTask: Task | undefined = undefined;

                      if (groupBy === "Assignee") {
                        const user = mockUsers.find((u) => u.id === groupId);
                        title = user?.name || groupId;
                        avatar = user?.avatarUrl;
                      } else {
                        parentTask = serverTasks.find(
                          (pt) => pt.id === groupId,
                        );
                        title = parentTask?.title || groupId;
                      }

                      return (
                        <SwimlaneGroup
                          key={groupId}
                          title={title}
                          avatar={avatar}
                          parentTask={parentTask}
                          taskCount={tasks.length}
                        >
                          {KANBAN_COLUMNS.map((col, index) => {
                            const columnTasks = tasks.filter(
                              (t) => t.status === col.id,
                            );
                            return (
                              <BoardColumn
                                key={`${col.id}___${groupId}`}
                                columnId={col.id}
                                droppableId={`${col.id}___${groupId}`}
                                groupId={groupId}
                                title={col.title}
                                tasks={columnTasks}
                                onTaskClick={setSelectedTask}
                                isFirstColumn={index === 0}
                                onCreateTask={handleCreate}
                              />
                            );
                          })}
                        </SwimlaneGroup>
                      );
                    })}
                    {(ungrouped.length > 0 ||
                      hasUngroupedInServer ||
                      grouped.size === 0) && (
                      <SwimlaneGroup
                        title={ungroupedTitle}
                        taskCount={ungrouped.length}
                        isFallbackGroup={true}
                      >
                        {KANBAN_COLUMNS.map((col, index) => {
                          const columnTasks = ungrouped.filter(
                            (t) => t.status === col.id,
                          );
                          return (
                            <BoardColumn
                              key={`${col.id}___ungrouped`}
                              columnId={col.id}
                              droppableId={`${col.id}___ungrouped`}
                              groupId="ungrouped"
                              title={col.title}
                              tasks={columnTasks}
                              onTaskClick={setSelectedTask}
                              isFirstColumn={index === 0}
                              onCreateTask={handleCreate}
                            />
                          );
                        })}
                      </SwimlaneGroup>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex h-fit max-h-full min-h-0">
              {KANBAN_COLUMNS.map((col, index) => {
                const columnTasks = filteredTasks.filter(
                  (t) => t.status === col.id,
                );
                return (
                  <BoardColumn
                    key={col.id}
                    columnId={col.id}
                    droppableId={col.id}
                    title={col.title}
                    tasks={columnTasks}
                    onTaskClick={setSelectedTask}
                    isFirstColumn={index === 0}
                    onCreateTask={handleCreate}
                  />
                );
              })}
            </div>
          )}
        </div>

        {createPortal(
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.5",
                  },
                },
              }),
            }}
          >
            {activeTask ? (
              <TaskCard task={activeTask} onClick={() => {}} isOverlay />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          setSelectedTask(null);
          setEditingTask(task);
        }}
        onDelete={handleDelete}
        onOpenTask={setSelectedTask}
      />

      {/* Edit modal */}
      <TaskFormModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEdit}
        isLoading={updateTask.isPending}
        initialData={editingTask ?? undefined}
        mode="edit"
      />
    </div>
  );
}
