import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import {
  KANBAN_COLUMNS,
  useTasksByProject,
  useUpdateTaskStatus,
} from "@/features/tasks";
import type { Task, TaskStatus } from "../../model/types";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import { TaskDetailModal } from "../TaskDetailModal/TaskDetailModal";

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: tasks = [], isLoading } = useTasksByProject(projectId);
  const updateStatus = useUpdateTaskStatus();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  if (isLoading)
    return (
      <div className="flex gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 w-[280px] rounded-xl bg-muted" />
        ))}
      </div>
    );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-8 md:px-8">
          {KANBAN_COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            return (
              <BoardColumn
                key={col.id}
                columnId={col.id}
                title={col.title}
                tasks={columnTasks}
                onTaskClick={handleTaskClick}
              />
            );
          })}
        </div>
      </DragDropContext>
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
}
