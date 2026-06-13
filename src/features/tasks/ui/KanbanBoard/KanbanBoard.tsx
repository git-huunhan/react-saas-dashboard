import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import {
  KANBAN_COLUMNS,
  useTasksByProject,
  useUpdateTaskStatus,
} from "@/features/tasks";
import type { TaskStatus } from "../../model/types";
import { BoardColumn } from "../BoardColumn/BoardColumn";

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: tasks = [], isLoading } = useTasksByProject(projectId);
  const updateStatus = useUpdateTaskStatus();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId as TaskStatus;

    updateStatus.mutate({ taskId: draggableId, status: newStatus });
  };

  if (isLoading)
    return (
      <div className="flex gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 w-[280px] rounded-xl bg-zinc-100" />
        ))}
      </div>
    );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <BoardColumn
              key={col.id}
              columnId={col.id}
              title={col.title}
              tasks={columnTasks}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}
