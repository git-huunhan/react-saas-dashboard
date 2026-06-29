import { useMemo, useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Crown,
  ClipboardList,
  Bug,
  Plus,
  RotateCcw,
  ArrowDownWideNarrow,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTasksByProject } from "../../model/useTasks";
import { mockUsers } from "@/features/users/model/mockUsers";
import { PriorityIcon } from "../PriorityIcon";
import { TaskDetailModal } from "../TaskDetailModal/TaskDetailModal";
import { TaskDetailPanel } from "../TaskDetailModal/components/TaskDetailPanel";
import type { Task } from "../../model/types";

interface ListViewProps {
  projectId: string;
  searchQuery: string;
  parentIds: string[];
  assigneeIds: string[];
  priorities: string[];
  statuses: string[];
  workTypes: string[];
  labels: string[];
  layout?: "table" | "split";
}

export function ListView({
  projectId,
  searchQuery,
  parentIds,
  assigneeIds,
  priorities,
  statuses,
  workTypes,
  labels,
  layout = "table",
}: ListViewProps) {
  const { data: tasks = [] } = useTasksByProject(projectId);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTaskId(null);
  }, [layout]);

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // Apply filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.code?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // 2. Parent filter (Epic)
      if (parentIds.length > 0 && !parentIds.includes(task.parentId || "")) {
        return false;
      }
      // 3. Assignee filter
      if (assigneeIds.length > 0) {
        if (assigneeIds.includes("unassigned") && !task.assigneeId) {
          // match
        } else if (!assigneeIds.includes(task.assigneeId || "")) {
          return false;
        }
      }
      // 4. Status filter
      if (statuses.length > 0 && !statuses.includes(task.status)) {
        return false;
      }
      // 5. Priority filter
      if (priorities.length > 0 && !priorities.includes(task.priority)) {
        return false;
      }
      // 6. Work Type filter
      if (workTypes.length > 0 && !workTypes.includes(task.type)) {
        return false;
      }
      // 7. Labels filter
      if (labels.length > 0) {
        const hasAllLabels = labels.every((l) => task.labels?.includes(l));
        if (!hasAllLabels) return false;
      }

      return true;
    });
  }, [
    tasks,
    searchQuery,
    parentIds,
    assigneeIds,
    statuses,
    priorities,
    workTypes,
    labels,
  ]);

  const getUser = (id?: string) => {
    if (!id) return null;
    return mockUsers.find((u) => u.id === id) || null;
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "epic":
        return <Crown className="w-4 h-4 text-purple-500 fill-purple-500/20" />;
      case "bug":
        return <Bug className="w-4 h-4 text-red-500 fill-red-500/20" />;
      default:
        return (
          <ClipboardList className="w-4 h-4 text-blue-500 fill-blue-500/20" />
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-sm">
      {layout === "split" ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar List */}
          <div className="w-[300px] flex-shrink-0 border-r border-border bg-background flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors -ml-2"
                  >
                    Custom field{" "}
                    <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>Custom field</DropdownMenuItem>
                  <DropdownMenuItem>Issue Type</DropdownMenuItem>
                  <DropdownMenuItem>Status</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-0.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 hover:bg-muted text-muted-foreground transition-colors"
                      title="Order work items by"
                    >
                      <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Order work items by
                    </div>
                    <DropdownMenuItem>Created</DropdownMenuItem>
                    <DropdownMenuItem>Key</DropdownMenuItem>
                    <DropdownMenuItem>Last viewed</DropdownMenuItem>
                    <DropdownMenuItem>Priority</DropdownMenuItem>
                    <DropdownMenuItem>Resolved</DropdownMenuItem>
                    <DropdownMenuItem>Status</DropdownMenuItem>
                    <DropdownMenuItem>Updated</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 hover:bg-muted text-muted-foreground transition-colors"
                  title="Refresh"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {filteredTasks.map((task) => {
                const assignee = getUser(task.assigneeId);
                const isSelected = selectedTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`flex flex-col gap-1 p-3 cursor-pointer border-l-2 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`font-medium truncate ${isSelected ? "text-primary" : "text-foreground"}`}
                    >
                      {task.title}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(task.type)}
                        <span className="text-xs font-medium text-muted-foreground hover:underline">
                          {task.code}
                        </span>
                      </div>
                      {assignee ? (
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={assignee.avatarUrl} />
                          <AvatarFallback className="text-[9px]">
                            {assignee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20">
                          <AvatarFallback className="bg-transparent text-muted-foreground/50 text-[9px]">
                            ?
                          </AvatarFallback>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detail Panel */}
          <div className="flex-1 overflow-hidden bg-background relative">
            {selectedTask ? (
              <div className="absolute inset-0">
                <TaskDetailPanel
                  task={selectedTask}
                  onClose={() => setSelectedTaskId(null)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a task to view details
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-background/95 backdrop-blur z-10">
              <tr className="border-b border-border text-muted-foreground">
                <th className="w-10 py-3 px-4 font-medium">
                  <Checkbox className="rounded-[4px] border-muted-foreground/40" />
                </th>
                <th className="py-3 px-2 font-medium">Work</th>
                <th className="w-48 py-3 px-2 font-medium">Assignee</th>
                <th className="w-48 py-3 px-2 font-medium">Reporter</th>
                <th className="w-32 py-3 px-2 font-medium">Priority</th>
                <th className="w-12 py-3 px-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No tasks found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const assignee = getUser(task.assigneeId);
                  const reporter =
                    getUser(task.reporterId) || getUser("user-1"); // fallback

                  return (
                    <tr
                      key={task.id}
                      className="border-b border-border hover:bg-muted/30 group transition-colors cursor-pointer"
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <td
                        className="py-2.5 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox className="rounded-[4px] border-muted-foreground/40" />
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {getTypeIcon(task.type)}
                          <span className="text-primary hover:underline font-medium cursor-pointer">
                            {task.code}
                          </span>
                          <span className="text-foreground truncate max-w-[400px]">
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          {assignee ? (
                            <>
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={assignee.avatarUrl} />
                                <AvatarFallback>
                                  {assignee.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                {assignee.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-6 h-6 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20">
                                <AvatarFallback className="bg-transparent text-muted-foreground/50 text-[10px]">
                                  ?
                                </AvatarFallback>
                              </div>
                              <span className="text-muted-foreground/70">
                                Unassigned
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          {reporter ? (
                            <>
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={reporter.avatarUrl} />
                                <AvatarFallback>
                                  {reporter.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                {reporter.name}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <PriorityIcon priority={task.priority} />
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Menu action
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {layout === "table" && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={true}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
