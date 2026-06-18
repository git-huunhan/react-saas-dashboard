import { format } from "date-fns";
import {
  AlignLeft,
  CheckSquare,
  Clock,
  MessageSquare,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useUsers } from "@/features/users";
import type { Task } from "../../model/types";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  const { users } = useUsers();
  const [comment, setComment] = useState("");

  if (!task) return null;

  const assignee = users.find((u) => u.id === task.assigneeId);

  const subtasks = [
    { id: 1, title: "Design mockup in Figma", completed: true },
    { id: 2, title: "Review with product team", completed: false },
    { id: 3, title: "Implement UI components", completed: false },
  ];

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
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background">
        <ScrollArea className="max-h-[85vh]">
          <div className="p-6">
            {/* Header & Badges */}
            <div className="mb-4">
              <div className="pr-8">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold leading-tight">
                    {task.title}
                  </DialogTitle>
                </DialogHeader>
              </div>

              <div className="flex items-center justify-between mt-3">
                {/* Left: badges + date */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-xs uppercase bg-muted/50"
                  >
                    {task.status.replace("-", " ")}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {task.priority}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {format(new Date(task.createdAt), "MMM d, yyyy")}
                  </div>
                </div>

                {/* Right: action buttons */}
                {(onEdit || onDelete) && (
                  <div className="flex gap-1.5 shrink-0">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => {
                          onClose();
                          onEdit(task);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs text-destructive hover:text-destructive hover:border-destructive/50"
                        onClick={() => onDelete(task)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-3 mb-6 bg-muted/30 p-3 rounded-lg border border-border/50">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${assignee?.name}&backgroundColor=10b981&textColor=ffffff`}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {assignee ? (
                    assignee.name.substring(0, 2).toUpperCase()
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {assignee ? assignee.name : "Unassigned"}
                </p>
                <p className="text-xs text-muted-foreground">Assignee</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center gap-2 font-semibold mb-2 text-foreground">
                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                Description
              </div>
              <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                {task.description || "No description provided."}
              </div>
            </div>

            {/* Sub-tasks */}
            <div className="mb-6">
              <div className="flex items-center gap-2 font-semibold mb-3 text-foreground">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                Sub-tasks
              </div>
              <div className="space-y-3">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`st-${st.id}`}
                      defaultChecked={st.completed}
                    />
                    <label
                      htmlFor={`st-${st.id}`}
                      className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        st.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {st.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <div className="flex items-center gap-2 font-semibold mb-4 text-foreground">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Comments
              </div>

              <div className="space-y-4 mb-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1 border border-border">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.author}&backgroundColor=10b981&textColor=ffffff`}
                      />
                      <AvatarFallback>{c.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {c.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {c.time}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1 bg-muted/30 p-2 rounded-md rounded-tl-none border border-border/50">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 items-start mt-4">
                <Avatar className="h-8 w-8 border border-primary/20 shrink-0">
                  <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Admin Pro&backgroundColor=10b981&textColor=ffffff" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    className="min-h-[80px] resize-none focus-visible:ring-primary"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" disabled={!comment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
