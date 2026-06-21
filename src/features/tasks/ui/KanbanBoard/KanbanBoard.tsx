import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

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
import { TaskDetailModal } from "../TaskDetailModal/TaskDetailModal";
import { TaskCard } from "../TaskCard/TaskCard";
import {
  TaskFormModal,
  type TaskFormData,
} from "../TaskFormModal/TaskFormModal";

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: serverTasks = [], isLoading } = useTasksByProject(projectId);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    setLocalTasks(serverTasks);
  }, [serverTasks]);

  const updateStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    setActiveId(event.active.id as string);
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

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: tasks[overIndex].status,
          };
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      }

      if (isOverColumn) {
        if (tasks[activeIndex].status !== overId) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: overId as TaskStatus,
          };
          return arrayMove(newTasks, activeIndex, newTasks.length - 1);
        }
      }

      return tasks;
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) {
      setLocalTasks(serverTasks);
      return;
    }

    const activeIdStr = active.id as string;
    const overId = over.id;

    if (activeIdStr === overId) {
      // Even if dropped in same column, maybe status changed during drag and then reverted?
      // Actually if active.id === over.id it usually means dropping a column.
      return;
    }

    const updatedTask = localTasks.find((t) => t.id === activeIdStr);
    if (updatedTask) {
      updateStatus.mutate({
        taskId: updatedTask.id,
        status: updatedTask.status,
      });
    }
  };

  const handleCreate = (data: TaskFormData) => {
    createTask.mutate(
      { ...data, projectId, assigneeId: data.assigneeId || undefined },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          toast.success("Task created");
        },
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

  if (isLoading)
    return (
      <div className="flex flex-col h-full overflow-hidden pt-0">
        <div className="flex flex-col flex-1 overflow-auto px-6 md:px-8 pb-4 items-start">
          <div className="flex gap-4 h-fit max-h-full min-h-0 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border bg-muted/50 min-w-[280px] w-[280px] h-[350px]"
              />
            ))}
            <div className="w-1 shrink-0" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-full overflow-hidden pt-0">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div
          className="flex flex-col flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-6 pb-6 md:px-8 md:pb-8 items-start relative custom-scrollbar"
          ref={scrollContainerRef}
        >
          <div className="flex h-fit max-h-full min-h-0">
            {KANBAN_COLUMNS.map((col, index) => {
              const columnTasks = localTasks.filter((t) => t.status === col.id);
              return (
                <BoardColumn
                  key={col.id}
                  columnId={col.id}
                  title={col.title}
                  tasks={columnTasks}
                  onTaskClick={setSelectedTask}
                  isFirstColumn={index === 0}
                  onCreateTask={() => setIsCreateOpen(true)}
                />
              );
            })}
          </div>
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
      />

      {/* Create modal */}
      <TaskFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={createTask.isPending}
        mode="create"
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
