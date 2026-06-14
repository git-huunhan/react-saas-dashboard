import { Droppable } from "@hello-pangea/dnd";

import type { Task, TaskStatus } from "../../model/types";
import { TaskCard } from "../TaskCard/TaskCard";

interface BoardColumnProps {
  columnId: TaskStatus;
  title: string;
  tasks: Task[];
}

const COLUMN_HEADER_STYLES: Record<string, string> = {
  todo: "bg-muted text-muted-foreground",
  "in-progress":
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  done: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export function BoardColumn({ columnId, title, tasks }: BoardColumnProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-muted/50 min-w-[280px] w-[280px]">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
            COLUMN_HEADER_STYLES[columnId] ?? "bg-zinc-100 text-zinc-600"
          }`}
        >
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            className={`flex flex-col gap-2 p-3 flex-1 min-h-[200px] transition-all rounded-b-xl ${
              snapshot.isDraggingOver
                ? "bg-primary/10 border-2 border-primary border-dashed"
                : "border-2 border-transparent"
            }`}
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
