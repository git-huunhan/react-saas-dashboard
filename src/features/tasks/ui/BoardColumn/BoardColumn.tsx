import { Droppable } from "@hello-pangea/dnd";

import type { Task, TaskStatus } from "../../model/types";
import { TaskCard } from "../TaskCard/TaskCard";

import "./BoardColumn.css";

interface BoardColumnProps {
  columnId: TaskStatus;
  title: string;
  tasks: Task[];
}

export function BoardColumn({ columnId, title, tasks }: BoardColumnProps) {
  return (
    <div className="board-column">
      <div className="board-column__header">
        <span className="board-column__title">{title}</span>
        <span className="board-column__count">{tasks.length}</span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            className={`board-column__body ${snapshot.isDraggingOver ? "board-column__body--over" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
