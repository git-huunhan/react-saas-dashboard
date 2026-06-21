import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Task } from "../../model/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isOverlay?: boolean;
}

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

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

  if (isOverlay) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground p-3 mb-3 cursor-grabbing shadow-2xl scale-105">
        <p className="text-sm font-medium leading-tight mb-4">{task.title}</p>
        <div className="flex items-center justify-between mt-auto">
          <Badge
            variant="secondary"
            className={`${PRIORITY_STYLES[task.priority]} border-0`}
          >
            {PRIORITY_LABEL[task.priority]}
          </Badge>
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatarUrl} />
              <AvatarFallback className="text-[10px]">
                {task.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border border-dashed border-primary bg-primary/5 p-3 mb-3"
      >
        <p className="text-sm font-medium leading-tight mb-4 opacity-0">
          {task.title}
        </p>
        <div className="flex items-center justify-between mt-auto opacity-0">
          <Badge
            variant="secondary"
            className={`${PRIORITY_STYLES[task.priority]} border-0`}
          >
            {PRIORITY_LABEL[task.priority]}
          </Badge>
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatarUrl} />
              <AvatarFallback className="text-[10px]">
                {task.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
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
      className="rounded-lg border bg-card text-card-foreground p-3 mb-3 cursor-grab hover:shadow-md shadow-sm transition-shadow transition-colors duration-200"
    >
      <p className="text-sm font-medium leading-tight mb-4">{task.title}</p>
      <div className="flex items-center justify-between mt-auto">
        <Badge
          variant="secondary"
          className={`${PRIORITY_STYLES[task.priority]} border-0`}
        >
          {PRIORITY_LABEL[task.priority]}
        </Badge>
        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatarUrl} />
            <AvatarFallback className="text-[10px]">
              {task.assignee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
