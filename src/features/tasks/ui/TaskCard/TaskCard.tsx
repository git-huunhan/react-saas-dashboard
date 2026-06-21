import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Task } from "../../model/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, Paperclip } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isOverlay?: boolean;
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
  // Low
  return (
    <div className="flex items-end gap-[2px] h-3">
      <div className="w-[3px] h-1.5 bg-blue-500 rounded-[1px]" />
      <div className="w-[3px] h-2.5 bg-muted-foreground/40 rounded-[1px]" />
      <div className="w-[3px] h-3.5 bg-muted-foreground/40 rounded-[1px]" />
    </div>
  );
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
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {task.code || `TASK-${task.id.slice(-3)}`}
        </span>
      </div>
      <p className="text-[13px] font-medium leading-snug mb-4 text-foreground/90 line-clamp-3">
        {task.title}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
        <div className="flex items-center gap-3">
          <PriorityIcon priority={task.priority} />

          {/* Mock indicators for attachments/comments - calculated deterministically from task.id to avoid flickering on re-render */}
          <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-medium">
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span>{task.id.length % 4}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
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
