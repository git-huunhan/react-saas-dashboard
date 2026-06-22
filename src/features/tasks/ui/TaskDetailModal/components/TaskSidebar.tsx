import { useState } from "react";
import {
  BookOpenText,
  ChevronDown,
  ClipboardList,
  Crown,
  User as UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { KANBAN_COLUMNS } from "@/features/tasks";
import type { Task, TaskStatus } from "../../../model/types";
import { PriorityIcon } from "../../PriorityIcon";
interface TaskSidebarProps {
  task: Task;
  handleUpdate: (field: "status" | "priority", value: string) => void;
}

export function TaskSidebar({ task, handleUpdate }: TaskSidebarProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isParentOpen, setIsParentOpen] = useState(true);
  const [isChildOpen, setIsChildOpen] = useState(true);

  return (
    <div className="w-1/3 shrink-0 bg-muted/10 flex flex-col overflow-hidden relative border-l border-transparent z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.03)] dark:shadow-none">
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar min-h-0 space-y-4 pb-12">
        {/* Status Dropdown */}
        <div>
          {(() => {
            const statusConfig: Record<
              TaskStatus,
              { label: string; trigger: string; dot: string }
            > = {
              todo: {
                label: "To Do",
                trigger:
                  "bg-slate-500/15 border-slate-500/40 text-slate-300 hover:bg-slate-500/25",
                dot: "bg-slate-400",
              },
              "in-progress": {
                label: "In Progress",
                trigger:
                  "bg-blue-500/15 border-blue-500/40 text-blue-300 hover:bg-blue-500/25",
                dot: "bg-blue-400",
              },
              review: {
                label: "Review",
                trigger:
                  "bg-yellow-500/15 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/25",
                dot: "bg-yellow-400",
              },
              done: {
                label: "Done",
                trigger:
                  "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25",
                dot: "bg-emerald-400",
              },
            };
            const cfg = statusConfig[task.status] ?? statusConfig["todo"];
            return (
              <Select
                value={task.status}
                onValueChange={(val: TaskStatus) => handleUpdate("status", val)}
              >
                <SelectTrigger
                  className={`w-fit h-9 px-3 font-semibold border shadow-sm focus:ring-0 focus:outline-none text-sm transition-colors ${cfg.trigger}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}
                    />
                    <SelectValue>{cfg.label}</SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent align="start">
                  {(
                    Object.entries(statusConfig) as [
                      TaskStatus,
                      (typeof statusConfig)[TaskStatus],
                    ][]
                  ).map(([id, s]) => (
                    <SelectItem key={id} value={id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                        {s.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })()}
        </div>

        {/* Details Section */}
        <div className="border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden">
          <div
            className="px-4 py-3 font-semibold text-sm flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors text-foreground"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          >
            <span>Details</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${!isDetailsOpen ? "-rotate-90" : ""}`}
            />
          </div>
          {isDetailsOpen && (
            <div className="p-4 flex flex-col gap-6 text-[13px] border-t border-border/50">
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-muted-foreground">
                  Assignee
                </span>
                <div className="flex items-center gap-2 hover:bg-muted/50 p-1.5 -ml-1.5 rounded cursor-pointer transition-colors w-fit pr-3">
                  {task.assignee ? (
                    <>
                      <Avatar className="h-6 w-6 border border-border/50">
                        <AvatarImage src={task.assignee.avatarUrl} />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {task.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground font-medium">
                        {task.assignee.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20">
                        <UserIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                      </div>
                      <span className="text-primary hover:underline font-medium">
                        Assign to me
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-muted-foreground">
                  Priority
                </span>
                <div className="-ml-2 w-[calc(100%+8px)]">
                  <Select
                    value={task.priority}
                    onValueChange={(val: "low" | "medium" | "high") =>
                      handleUpdate("priority", val)
                    }
                  >
                    <SelectTrigger className="w-full h-8 px-2 bg-transparent border-transparent hover:bg-muted/50 focus:ring-1 focus:ring-primary/50 text-[13px] font-medium shadow-none rounded transition-colors">
                      <SelectValue>
                        <div className="flex items-center gap-2 capitalize">
                          <PriorityIcon priority={task.priority} />{" "}
                          {task.priority}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <PriorityIcon priority="high" /> High
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <PriorityIcon priority="medium" /> Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <PriorityIcon priority="low" /> Low
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-muted-foreground">
                  Labels
                </span>
                <span className="text-foreground hover:bg-muted/50 p-1.5 -ml-1.5 rounded cursor-pointer transition-colors w-fit pr-3 font-medium">
                  None
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-muted-foreground">
                  Due date
                </span>
                <span className="text-foreground hover:bg-muted/50 p-1.5 -ml-1.5 rounded cursor-pointer transition-colors w-fit pr-3 font-medium">
                  None
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold text-muted-foreground">
                  Reporter
                </span>
                <div className="flex items-center gap-2 hover:bg-muted/50 p-1.5 -ml-1.5 rounded cursor-pointer transition-colors w-fit pr-3">
                  <Avatar className="h-6 w-6 border border-border/50">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Admin Pro&backgroundColor=10b981&textColor=ffffff" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">Admin Pro</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parent tasks */}
        <div className="border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden">
          <div
            className="px-4 py-3 font-semibold text-sm flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors text-foreground"
            onClick={() => setIsParentOpen(!isParentOpen)}
          >
            <span>Parent tasks</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${!isParentOpen ? "-rotate-90" : ""}`}
            />
          </div>
          {isParentOpen && (
            <div className="p-2 flex flex-col gap-1 border-t border-border/50 bg-muted/10">
              <div className="flex items-center gap-2.5 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors border border-transparent hover:border-border/50 group">
                <Crown className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-[13px] font-semibold text-foreground hover:underline shrink-0">
                  PRJ1-99
                </span>
                <span className="text-[13px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
                  Core Infrastructure Setup
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors border border-transparent hover:border-border/50 group">
                <BookOpenText className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-[13px] font-semibold text-foreground hover:underline shrink-0">
                  PRJ1-100
                </span>
                <span className="text-[13px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
                  Database Schema Design
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Child tasks */}
        <div className="border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden">
          <div
            className="px-4 py-3 font-semibold text-sm flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors text-foreground"
            onClick={() => setIsChildOpen(!isChildOpen)}
          >
            <span>Child tasks</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${!isChildOpen ? "-rotate-90" : ""}`}
            />
          </div>
          {isChildOpen && (
            <div className="p-2 flex flex-col gap-1 border-t border-border/50 bg-muted/10">
              <div className="flex items-center gap-2.5 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors border border-transparent hover:border-border/50 group">
                <ClipboardList className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-[13px] font-semibold text-foreground hover:underline shrink-0">
                  PRJ1-102
                </span>
                <span className="text-[13px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
                  User Authentication API
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors border border-transparent hover:border-border/50 group">
                <ClipboardList className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-[13px] font-semibold text-foreground hover:underline shrink-0">
                  PRJ1-103
                </span>
                <span className="text-[13px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
                  Login UI implementation
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
