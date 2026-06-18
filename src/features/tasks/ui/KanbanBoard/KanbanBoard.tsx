import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  KANBAN_COLUMNS,
  useCreateTask,
  useDeleteTask,
  useTasksByProject,
  useUpdateTask,
  useUpdateTaskStatus,
} from "@/features/tasks";
import type { Task, TaskStatus } from "../../model/types";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import { TaskDetailModal } from "../TaskDetailModal/TaskDetailModal";
import {
  TaskFormModal,
  type TaskFormData,
} from "../TaskFormModal/TaskFormModal";

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { data: tasks = [], isLoading } = useTasksByProject(projectId);
  const updateStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    updateStatus.mutate({
      taskId: draggableId,
      status: destination.droppableId as TaskStatus,
    });
  };

  const handleCreate = (data: TaskFormData) => {
    createTask.mutate(
      { ...data, projectId, assigneeId: data.assigneeId || undefined },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          toast.success("Task created");
        },
        onError: () => toast.error("Failed to create task"),
      },
    );
  };

  const handleEdit = (data: TaskFormData) => {
    if (!editingTask) return;
    updateTask.mutate(
      {
        taskId: editingTask.id,
        data: { ...data, assigneeId: data.assigneeId || undefined },
      },
      {
        onSuccess: () => {
          setEditingTask(null);
          toast.success("Task updated");
        },
        onError: () => toast.error("Failed to update task"),
      },
    );
  };

  const handleDelete = (task: Task) => {
    deleteTask.mutate(
      { taskId: task.id, projectId: task.projectId },
      {
        onSuccess: () => {
          setSelectedTask(null);
          toast.success("Task deleted");
        },
        onError: () => toast.error("Failed to delete task"),
      },
    );
  };

  if (isLoading)
    return (
      <div className="flex gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 w-[280px] rounded-xl bg-muted" />
        ))}
      </div>
    );

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

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
                onTaskClick={setSelectedTask}
              />
            );
          })}
        </div>
      </DragDropContext>

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          setSelectedTask(null);
          setEditingTask(task);
        }}
        onDelete={handleDelete}
      />

      {/* Create modal */}
      <TaskFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={createTask.isPending}
        mode="create"
      />

      {/* Edit modal */}
      <TaskFormModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEdit}
        isLoading={updateTask.isPending}
        initialData={editingTask ?? undefined}
        mode="edit"
      />
    </>
  );
}
