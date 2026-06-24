import type { Task, TaskStatus } from "../../model/types";
import { TaskCard } from "../TaskCard/TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface BoardColumnProps {
  columnId: TaskStatus;
  title: string;
  tasks: Task[];
  isFirstColumn?: boolean;
  onTaskClick: (task: Task) => void;
  onCreateTask?: () => void;
}

const COLUMN_HEADER_STYLES: Record<string, string> = {
  "To Do": "text-slate-500",
  "In Progress": "text-blue-500",
  Review: "text-orange-500",
  Done: "text-green-500",
};

export function BoardColumn({
  columnId,
  title,
  tasks,
  isFirstColumn,
  onTaskClick,
  onCreateTask,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: {
      type: "Column",
      column: columnId,
    },
  });

  return (
    <div className="flex flex-col rounded-xl border bg-muted/50 min-w-70 w-70 shrink-0 group mr-6 last:mr-0 pb-2">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span
          className={`flex items-center justify-center rounded-full bg-background px-2 py-0.5 text-xs font-medium border ${COLUMN_HEADER_STYLES[title]}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 min-h-[50px] overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div ref={setNodeRef} className="flex flex-col p-3 min-h-full">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </SortableContext>

          {onCreateTask && (
            <div
              className={`mt-1 transition-opacity ${
                isFirstColumn
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
              }`}
            >
              <button
                onClick={onCreateTask}
                className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
