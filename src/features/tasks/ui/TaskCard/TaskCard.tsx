import { Draggable } from "@hello-pangea/dnd";

import type { Task } from "../../model/types";

import "./TaskCard.css";

interface TaskCardProps {
  task: Task;
  index: number;
}

const PRIORITY_CLASS: Record<string, string> = {
  low: "task-card__priority--low",
  medium: "task-card__priority--medium",
  high: "task-card__priority--high",
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
          className={`task-card ${snapshot.isDragging ? "task-card--dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="task-card__title">{task.title}</p>

          <div className="task-card__footer">
            <span
              className={`task-card__priority ${PRIORITY_CLASS[task.priority]}`}
            >
              {PRIORITY_LABEL[task.priority]}
            </span>

            {task.assigneeId && (
              <div className="task-card__avatar">
                {task.assigneeId.replace("user-", "U")}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
