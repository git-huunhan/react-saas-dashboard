import {
  CalendarIcon,
  ChevronDown,
  Crown,
  Tag,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUsers } from "@/features/users";
import type { Task, TaskStatus } from "../../../model/types";
import { PriorityIcon } from "../../PriorityIcon";

interface TaskSidebarProps {
  task: Task;
  handleUpdate: (
    field:
      | "status"
      | "priority"
      | "assigneeId"
      | "labels"
      | "dueDate"
      | "reporterId",
    value: any,
  ) => void;
}

export function TaskSidebar({ task, handleUpdate }: TaskSidebarProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isParentSelectOpen, setIsParentSelectOpen] = useState(false);
  const [isReporterOpen, setIsReporterOpen] = useState(false);

  const { users } = useUsers();

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
              {/* PARENT TASK */}
              {task.type !== "epic" && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Parent task
                  </span>
                  <div className="-ml-2 w-[calc(100%+8px)]">
                    <Popover
                      open={isParentSelectOpen}
                      onOpenChange={setIsParentSelectOpen}
                    >
                      <PopoverTrigger asChild>
                        <button className="w-full h-8 px-2 flex items-center justify-between bg-transparent hover:bg-muted/50 focus:ring-1 focus:ring-primary/50 text-[13px] font-medium rounded transition-colors text-left group">
                          <div className="flex items-center gap-2 truncate">
                            <Crown className="w-4 h-4 text-purple-500 shrink-0" />
                            <span className="truncate">
                              PRJ1-99: Core Infrastructure Setup
                            </span>
                          </div>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60 p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search tasks..." />
                          <CommandList>
                            <CommandEmpty>No tasks found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => setIsParentSelectOpen(false)}
                                className="cursor-pointer flex items-center gap-2"
                              >
                                <Crown className="w-4 h-4 text-purple-500 shrink-0" />
                                <div className="flex flex-col">
                                  <span className="font-medium">PRJ1-99</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-45">
                                    Core Infrastructure Setup
                                  </span>
                                </div>
                              </CommandItem>
                              <CommandItem
                                onSelect={() => setIsParentSelectOpen(false)}
                                className="cursor-pointer text-muted-foreground flex items-center gap-2 mt-1"
                              >
                                None
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              {/* ASSIGNEE */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Assignee
                </span>
                <div className="flex flex-col items-start gap-1 -ml-2 w-[calc(100%+8px)]">
                  <Popover
                    open={isAssigneeOpen}
                    onOpenChange={setIsAssigneeOpen}
                  >
                    <PopoverTrigger asChild>
                      <button className="w-full h-8 px-2 flex items-center gap-2 bg-transparent hover:bg-muted/50 focus:ring-1 focus:ring-primary/50 rounded cursor-pointer transition-colors outline-none text-left">
                        {task.assignee ? (
                          <>
                            <Avatar className="h-6 w-6 border border-border/50 shrink-0">
                              <AvatarImage src={task.assignee.avatarUrl} />
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {task.assignee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-foreground font-medium text-[13px] truncate">
                              {task.assignee.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20 shrink-0">
                              <UserIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                            </div>
                            <span className="text-foreground font-medium text-[13px]">
                              Unassigned
                            </span>
                          </>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-70 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search user..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users
                              .filter((user) => user.id !== task.assignee?.id)
                              .map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={
                                    user.id === "user-1"
                                      ? `${user.name} (Assign to me)`
                                      : user.name
                                  }
                                  onSelect={() => {
                                    handleUpdate("assigneeId", user.id);
                                    setIsAssigneeOpen(false);
                                  }}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback>
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.id === "user-1"
                                    ? `${user.name} (Assign to me)`
                                    : user.name}
                                </CommandItem>
                              ))}
                            <CommandItem
                              onSelect={() => {
                                handleUpdate("assigneeId", null);
                                setIsAssigneeOpen(false);
                              }}
                              className="text-muted-foreground cursor-pointer"
                            >
                              <UserIcon className="w-4 h-4 mr-2" />
                              Unassigned
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {task.assignee?.id !== "user-1" && (
                    <button
                      className="text-[13px] text-primary hover:underline font-medium px-2 mt-0.5 transition-colors"
                      onClick={() => {
                        if (users.length > 0) {
                          handleUpdate("assigneeId", users[0].id);
                        }
                      }}
                    >
                      Assign to me
                    </button>
                  )}
                </div>
              </div>

              {/* PRIORITY */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
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

              {/* LABELS */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Labels
                </span>
                <div className="-ml-2 w-[calc(100%+8px)]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full h-8 px-2 flex items-center justify-between bg-transparent hover:bg-muted/50 focus:ring-1 focus:ring-primary/50 text-[13px] font-medium rounded transition-colors text-left">
                        {task.labels && task.labels.length > 0 ? (
                          <span className="truncate">
                            {task.labels.join(", ")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Select labels...
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search labels..." />
                        <CommandList>
                          <CommandEmpty>No labels found.</CommandEmpty>
                          <CommandGroup>
                            {[
                              "Frontend",
                              "Backend",
                              "Bug",
                              "Feature",
                              "Design",
                            ].map((label) => (
                              <CommandItem
                                key={label}
                                onSelect={() => {
                                  const current = task.labels || [];
                                  const newLabels = current.includes(label)
                                    ? current.filter((l) => l !== label)
                                    : [...current, label];
                                  handleUpdate("labels", newLabels);
                                }}
                                className="cursor-pointer flex items-center gap-2"
                              >
                                <Tag className="w-3.5 h-3.5" />
                                {label}
                                {task.labels?.includes(label) && (
                                  <span className="ml-auto text-primary">
                                    ✓
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* DUE DATE */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Due date
                </span>
                <div className="-ml-2 w-[calc(100%+8px)] relative group">
                  <input
                    type="date"
                    className="w-full h-8 px-2 bg-transparent hover:bg-muted/50 focus:bg-muted/50 focus:ring-1 focus:ring-primary/50 rounded outline-none text-foreground cursor-pointer text-[13px] font-medium transition-colors [color-scheme:light_dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    value={task.dueDate || ""}
                    onChange={(e) => handleUpdate("dueDate", e.target.value)}
                  />
                  <CalendarIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                </div>
              </div>

              {/* REPORTER */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Reporter
                </span>
                <div className="flex flex-col items-start gap-1 -ml-2 w-[calc(100%+8px)]">
                  <Popover
                    open={isReporterOpen}
                    onOpenChange={setIsReporterOpen}
                  >
                    <PopoverTrigger asChild>
                      <button className="w-full h-8 px-2 flex items-center gap-2 bg-transparent hover:bg-muted/50 focus:ring-1 focus:ring-primary/50 rounded cursor-pointer transition-colors outline-none text-left">
                        {task.reporter ? (
                          <>
                            <Avatar className="h-6 w-6 border border-border/50 shrink-0">
                              <AvatarImage src={task.reporter.avatarUrl} />
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {task.reporter.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-foreground font-medium text-[13px] truncate">
                              {task.reporter.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center bg-muted/20 shrink-0">
                              <UserIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                            </div>
                            <span className="text-foreground font-medium text-[13px]">
                              System
                            </span>
                          </>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search reporter..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users
                              .filter((user) => user.id !== task.reporter?.id)
                              .map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={user.name}
                                  onSelect={() => {
                                    handleUpdate("reporterId", user.id);
                                    setIsReporterOpen(false);
                                  }}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback>
                                      {user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
