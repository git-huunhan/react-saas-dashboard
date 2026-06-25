import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertTriangle,
  Bug,
  ClipboardList,
  Crown,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import type { Task } from "../../model/types";
import { PriorityIcon } from "../PriorityIcon";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isOverlay?: boolean;
}
export function TaskCard({ task, onClick, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const CardContent = () => (
    <>
      <div className="flex flex-col gap-1.5 mb-2.5 pb-2.5 border-b border-border/40">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          {task.type === "epic" ? (
            <Crown className="w-3.5 h-3.5 text-purple-500" />
          ) : task.type === "bug" ? (
            <Bug className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <ClipboardList className="w-3.5 h-3.5 text-primary" />
          )}
          {task.code || `TASK-${task.id.slice(-3)}`}
        </span>
        <p className="text-[13px] font-medium leading-snug text-foreground/90 line-clamp-3">
          {task.title}
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {task.type !== "epic" &&
          parseInt(task.id.replace(/\D/g, "") || "0") % 2 === 0 && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-foreground/70 hover:text-foreground cursor-pointer transition-colors bg-muted/40 px-1.5 py-0.5 rounded border border-border/50 w-fit">
              <Crown className="w-3 h-3 text-purple-500 shrink-0" />
              <span className="truncate max-w-[150px]">
                Core Infrastructure Setup
              </span>
            </div>
          )}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.labels.map((label) => {
              let hash = 0;
              for (let i = 0; i < label.length; i++) {
                hash = label.charCodeAt(i) + ((hash << 5) - hash);
              }
              const colors = [
                "border-pink-500/30 text-pink-500",
                "border-blue-400/30 text-blue-400",
                "border-amber-500/30 text-amber-500",
                "border-purple-400/30 text-purple-400",
                "border-emerald-500/30 text-emerald-500",
              ];
              const color = colors[Math.abs(hash) % colors.length];
              return (
                <span
                  key={label}
                  className={`text-[11px] font-medium px-1.5 py-0.5 rounded border bg-background/50 ${color}`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
        {task.dueDate && (
          <div className="w-fit flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border border-red-500/40 text-red-400 bg-red-500/10">
            <AlertTriangle className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
        <div className="flex items-center gap-3">
          <PriorityIcon priority={task.priority} />

          <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium">
            <div className="flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{task.id.length % 4}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{(task.id.charCodeAt(task.id.length - 1) || 0) % 6}</span>
            </div>
          </div>
        </div>

        {task.assignee ? (
          <Avatar className="h-[22px] w-[22px] ring-2 ring-background">
            <AvatarImage src={task.assignee.avatarUrl} />
            <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
              {task.assignee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-[22px] w-[22px] rounded-full border border-dashed border-muted-foreground/60 flex items-center justify-center bg-muted/20">
            <svg
              className="w-3 h-3 text-muted-foreground/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );

  if (isOverlay) {
    return (
      <div className="flex flex-col rounded-xl border border-border/60 bg-card text-card-foreground p-3 mb-3 cursor-grabbing shadow-2xl scale-105 z-50">
        <CardContent />
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-3 mb-3"
      >
        <div className="opacity-0">
          <CardContent />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="group flex flex-col rounded-xl border border-border/50 bg-card text-card-foreground p-3 mb-2.5 cursor-grab hover:border-border/80 hover:shadow-sm transition-all duration-200"
    >
      <CardContent />
    </div>
  );
}
