import {
  Bookmark,
  ChevronDown,
  Crown,
  Eye,
  GitFork,
  Link as LinkIcon,
  ListTodo,
  Lock,
  Maximize2,
  MoreHorizontal,
  Paperclip,
  Share2,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { KANBAN_COLUMNS, useUpdateTask } from "@/features/tasks";
import { useUsers } from "@/features/users";
import type { Task, TaskStatus } from "../../model/types";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

function PriorityIcon({ priority }: { priority: string }) {
  if (priority === "high") {
    return (
      <div className="flex items-end gap-[2px] h-3">
        <div className="w-[3px] h-1.5 bg-red-500 rounded-[1px]" />
        <div className="w-[3px] h-2.5 bg-red-500 rounded-[1px]" />
        <div className="w-[3px] h-3.5 bg-red-500 rounded-[1px]" />
      </div>
    );
  }
  if (priority === "medium") {
    return (
      <div className="flex items-end gap-[2px] h-3">
        <div className="w-[3px] h-1.5 bg-yellow-500 rounded-[1px]" />
        <div className="w-[3px] h-2.5 bg-yellow-500 rounded-[1px]" />
        <div className="w-[3px] h-3.5 bg-muted-foreground/40 rounded-[1px]" />
      </div>
    );
  }
  return (
    <div className="flex items-end gap-[2px] h-3">
      <div className="w-[3px] h-1.5 bg-blue-500 rounded-[1px]" />
      <div className="w-[3px] h-2.5 bg-muted-foreground/40 rounded-[1px]" />
      <div className="w-[3px] h-3.5 bg-muted-foreground/40 rounded-[1px]" />
    </div>
  );
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  const { users } = useUsers();
  const updateTask = useUpdateTask();
  const [comment, setComment] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // Collapse states
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isAttachOpen, setIsAttachOpen] = useState(true);
  const [isActivityOpen, setIsActivityOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isParentOpen, setIsParentOpen] = useState(true);
  const [isChildOpen, setIsChildOpen] = useState(true);

  // Sync state when task opens/changes
  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDesc(task.description || "");
    }
  }, [task]);

  if (!task) return null;

  const handleUpdate = (field: "title" | "description", value: string) => {
    if (!task) return;
    if (task[field] === value) return;
    updateTask.mutate({
      taskId: task.id,
      data: { [field]: value },
    });
  };

  const assignee = users.find((u) => u.id === task.assigneeId);

  const comments = [
    {
      id: 1,
      author: "Admin Pro",
      text: "Please update the color palette to match the new emerald theme.",
      time: "2 hours ago",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1240px] w-[95vw] p-0 gap-0 h-[85vh] flex flex-col overflow-hidden bg-background border-border/60 shadow-2xl">
        {/* Unified Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-border/40 bg-card z-20">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
            <span className="hover:underline cursor-pointer transition-colors hover:text-foreground flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-purple-500" />
              PRJ1-99
            </span>
            <span className="opacity-50">/</span>
            <span className="text-foreground hover:underline cursor-pointer flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-yellow-500" />
              {task.code || `TASK-${task.id.slice(-3)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
            >
              <Lock className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold px-2.5 border-border/60 shadow-sm rounded-md"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> 1
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    onClick={() => onDelete(task)}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-[1px] h-4 bg-border/60 mx-1"></div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm transition-colors hover:text-foreground"
              onClick={onClose}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex flex-1 h-full overflow-hidden">
          {/* Left Column - Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-border/40 bg-card">
            <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar min-h-0 pt-6">
              <div className="max-w-4xl pt-2 pb-12">
                {/* Title Editable */}
                <div className="mb-6 -ml-2">
                  <h1
                    contentEditable={isEditingTitle}
                    suppressContentEditableWarning
                    className={`!text-2xl !font-semibold text-foreground tracking-tight leading-[1.2] p-2 rounded-md cursor-text transition-colors border m-0 whitespace-pre-wrap outline-none ${isEditingTitle ? "bg-background border-primary/50 ring-1 ring-primary/50 shadow-sm" : "border-transparent hover:bg-muted/40"}`}
                    onClick={(e) => {
                      if (!isEditingTitle) {
                        setIsEditingTitle(true);
                        const target = e.currentTarget;
                        setTimeout(() => {
                          target.focus();
                          // Move cursor to the end
                          if (typeof window !== "undefined") {
                            const selection = window.getSelection();
                            const range = document.createRange();
                            range.selectNodeContents(target);
                            range.collapse(false);
                            selection?.removeAllRanges();
                            selection?.addRange(range);
                          }
                        }, 0);
                      }
                    }}
                    onBlur={(e) => {
                      setIsEditingTitle(false);
                      const newTitle = e.currentTarget.textContent?.trim();
                      if (newTitle && newTitle !== task.title) {
                        handleUpdate("title", newTitle);
                      } else {
                        e.currentTarget.textContent = task.title; // revert if empty
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.blur(); // Triggers onBlur to save
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setIsEditingTitle(false);
                        e.currentTarget.textContent = task.title; // Revert
                        e.currentTarget.blur();
                      }
                    }}
                  >
                    {task.title}
                  </h1>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold bg-muted/20 border-border/60 hover:bg-muted/50 transition-colors shadow-sm"
                  >
                    <Paperclip className="w-3.5 h-3.5 mr-2" /> Attach
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold bg-muted/20 border-border/60 hover:bg-muted/50 transition-colors shadow-sm"
                  >
                    <GitFork className="w-3.5 h-3.5 mr-2" /> Create subtask
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold bg-muted/20 border-border/60 hover:bg-muted/50 transition-colors shadow-sm"
                  >
                    <LinkIcon className="w-3.5 h-3.5 mr-2" /> Link issue
                  </Button>
                </div>

                {/* Description */}
                <div className="mb-10">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 -ml-1 rounded-md w-fit transition-colors mb-3 group"
                    onClick={() => setIsDescOpen(!isDescOpen)}
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${!isDescOpen ? "-rotate-90" : ""} group-hover:text-foreground`}
                    />
                    <h3 className="text-[15px] font-semibold text-foreground">
                      Description
                    </h3>
                  </div>

                  {isDescOpen && (
                    <>
                      <div className="flex flex-col gap-2">
                        <div
                          contentEditable={isEditingDesc}
                          suppressContentEditableWarning
                          className={`text-[14px] px-2 py-3 -ml-2 rounded-md cursor-text border whitespace-pre-wrap leading-normal outline-none min-h-[60px] transition-colors ${isEditingDesc ? "bg-background border-primary/50 ring-1 ring-primary/50 text-foreground shadow-sm min-h-[120px]" : "text-foreground/80 hover:bg-muted/30 border-transparent hover:border-border/50"}`}
                          onClick={(e) => {
                            if (!isEditingDesc) {
                              setEditDesc(task.description || "");
                              setIsEditingDesc(true);
                              const target = e.currentTarget;
                              setTimeout(() => {
                                target.focus();
                                if (typeof window !== "undefined") {
                                  const selection = window.getSelection();
                                  const range = document.createRange();
                                  range.selectNodeContents(target);
                                  range.collapse(false);
                                  selection?.removeAllRanges();
                                  selection?.addRange(range);
                                }
                              }, 0);
                            }
                          }}
                          onInput={(e) => {
                            setEditDesc(
                              (e.target as HTMLDivElement).innerText || "",
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              e.preventDefault();
                              setIsEditingDesc(false);
                              e.currentTarget.innerText =
                                task.description || "";
                              setEditDesc(task.description || "");
                            }
                          }}
                        >
                          {task.description ||
                            (isEditingDesc ? (
                              ""
                            ) : (
                              <span
                                className="text-muted-foreground"
                                contentEditable={false}
                              >
                                Add a description...
                              </span>
                            ))}
                        </div>
                        {isEditingDesc && (
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <Button
                              size="sm"
                              onClick={() => {
                                setIsEditingDesc(false);
                                handleUpdate(
                                  "description",
                                  editDesc || task.description || "",
                                );
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                setIsEditingDesc(false);
                                setEditDesc(task.description || "");
                                // Revert DOM content
                                const div = e.currentTarget.parentElement
                                  ?.previousElementSibling as HTMLDivElement;
                                if (div) div.innerText = task.description || "";
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Attachments */}
                <div className="mb-10">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 -ml-1 rounded-md w-fit transition-colors mb-3 group"
                    onClick={() => setIsAttachOpen(!isAttachOpen)}
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${!isAttachOpen ? "-rotate-90" : ""} group-hover:text-foreground`}
                    />
                    <h3 className="text-[15px] font-semibold text-foreground">
                      Attachments
                    </h3>
                  </div>

                  {isAttachOpen && (
                    <div className="border border-dashed border-border/80 bg-muted/10 rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:border-border transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium">
                          Drop files to attach, or{" "}
                          <span className="text-primary hover:underline">
                            browse
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 -ml-1 rounded-md w-fit transition-colors group"
                      onClick={() => setIsActivityOpen(!isActivityOpen)}
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${!isActivityOpen ? "-rotate-90" : ""} group-hover:text-foreground`}
                      />
                      <h3 className="text-[15px] font-semibold text-foreground">
                        Activity
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Sort by:</span>
                      <span className="font-semibold text-foreground cursor-pointer hover:underline">
                        Newest first
                      </span>
                    </div>
                  </div>

                  {isActivityOpen && (
                    <>
                      {/* Tabs */}
                      <div className="flex items-center gap-5 border-b border-border/50 pb-0 mb-6 text-sm font-semibold">
                        <span className="text-muted-foreground hover:text-foreground cursor-pointer pb-2 transition-colors">
                          All
                        </span>
                        <span className="text-foreground border-b-2 border-primary pb-2 -mb-[1px]">
                          Comments
                        </span>
                        <span className="text-muted-foreground hover:text-foreground cursor-pointer pb-2 transition-colors">
                          History
                        </span>
                        <span className="text-muted-foreground hover:text-foreground cursor-pointer pb-2 transition-colors">
                          Work log
                        </span>
                      </div>

                      {/* Comment Box */}
                      <div className="flex gap-4 mt-6">
                        <Avatar className="w-8 h-8 shrink-0 border border-border/50">
                          <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Admin Pro&backgroundColor=10b981&textColor=ffffff" />
                          <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 border border-border/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
                          <Textarea
                            placeholder="Add a comment..."
                            className="border-0 focus-visible:ring-0 min-h-[70px] resize-none bg-card text-[14px] p-3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <div className="bg-muted/40 px-3 py-2.5 flex items-center gap-2 border-t border-border/50">
                            <span className="text-[11px] font-medium text-muted-foreground">
                              Pro tip: press{" "}
                              <kbd className="border border-border/60 bg-background/50 px-1.5 py-0.5 rounded shadow-sm mx-0.5">
                                M
                              </kbd>{" "}
                              to comment
                            </span>
                            <div className="flex-1" />
                            <Button
                              size="sm"
                              className="h-7 text-xs font-semibold px-4"
                              disabled={!comment.trim()}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Comments List Mock */}
                      <div className="mt-8 space-y-6">
                        {comments.map((c) => (
                          <div key={c.id} className="flex gap-4">
                            <Avatar className="w-8 h-8 shrink-0 border border-border/50">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.author}&backgroundColor=10b981&textColor=ffffff`}
                              />
                              <AvatarFallback>
                                {c.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm font-semibold text-foreground hover:underline cursor-pointer">
                                  {c.author}
                                </span>
                                <span className="text-[12px] text-muted-foreground font-medium">
                                  {c.time}
                                </span>
                              </div>
                              <p className="text-[14px] text-foreground/90 leading-relaxed">
                                {c.text}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-[12px] font-semibold text-muted-foreground">
                                <span className="hover:text-foreground cursor-pointer transition-colors">
                                  Reply
                                </span>
                                <span className="hover:text-foreground cursor-pointer transition-colors">
                                  Edit
                                </span>
                                <span className="hover:text-foreground cursor-pointer transition-colors">
                                  Delete
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-[320px] shrink-0 bg-muted/10 flex flex-col overflow-hidden relative border-l border-transparent z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.03)] dark:shadow-none">
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar min-h-0 space-y-4 pb-12">
              {/* Status Dropdown */}
              <div>
                <Select
                  value={task.status}
                  onValueChange={(val: TaskStatus) =>
                    handleUpdate("status", val)
                  }
                >
                  <SelectTrigger className="w-fit h-9 px-3 font-semibold bg-muted/40 hover:bg-muted/60 capitalize border-border/60 shadow-sm focus:ring-1 focus:ring-primary/50 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KANBAN_COLUMNS.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                        <span className="text-foreground font-medium">
                          Admin Pro
                        </span>
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
                      <Bookmark className="w-4 h-4 text-blue-500 shrink-0" />
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
                      <ListTodo className="w-4 h-4 text-yellow-500 shrink-0" />
                      <span className="text-[13px] font-semibold text-foreground hover:underline shrink-0">
                        PRJ1-102
                      </span>
                      <span className="text-[13px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
                        User Authentication API
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors border border-transparent hover:border-border/50 group">
                      <ListTodo className="w-4 h-4 text-yellow-500 shrink-0" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
