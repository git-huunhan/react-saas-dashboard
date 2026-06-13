import { Draggable } from "@hello-pangea/dnd";

import type { Task } from "../../model/types";

interface TaskCardProps {
  task: Task;
  index: number;
}

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
};

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`rounded-lg border bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing transition-shadow ${
            snapshot.isDragging ? "shadow-lg rotate-1" : "hover:shadow-md"
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="text-sm font-medium text-zinc-800 mb-3 leading-snug">
            {task.title}
          </p>

          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[task.priority]}`}
            >
              {PRIORITY_LABEL[task.priority]}
            </span>

            {task.assigneeId && (
              <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600">
                {task.assigneeId.replace("user-", "U")}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
