import { Draggable } from "@hello-pangea/dnd";

import type { Task } from "../../model/types";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick?: () => void;
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

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          onClick={onClick}
          className={`rounded-lg border bg-card text-card-foreground p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow ${
            snapshot.isDragging ? "shadow-lg rotate-1" : "hover:shadow-md"
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style as React.CSSProperties}
        >
          <p className="text-sm font-medium text-foreground mb-3 leading-snug">
            {task.title}
          </p>

          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[task.priority]}`}
            >
              {PRIORITY_LABEL[task.priority]}
            </span>

            {task.assigneeId && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                {task.assigneeId.replace("user-", "U")}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
