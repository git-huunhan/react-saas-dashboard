import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUpdateTask } from "@/features/tasks";

import type { Task } from "../../model/types";
import { TaskHeader } from "./components/TaskHeader";
import { TaskMain } from "./components/TaskMain";
import { TaskSidebar } from "./components/TaskSidebar";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onEdit, // unused for now
  onDelete,
}: TaskDetailModalProps) {
  const updateTask = useUpdateTask();

  if (!task) return null;

  const handleUpdate = (
    field: "title" | "description" | "status" | "priority",
    value: string,
  ) => {
    if (!task) return;

    if ((task as any)[field] === value) return;
    updateTask.mutate({
      taskId: task.id,
      data: { [field]: value },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1240px] w-[95vw] p-0 gap-0 h-[85vh] flex flex-col overflow-hidden bg-background border-border/60 shadow-2xl">
        {/* Unified Header */}
        <TaskHeader task={task} onClose={onClose} onDelete={onDelete} />

        <div className="flex flex-1 h-full overflow-hidden">
          {/* Left Column - Main Content */}
          <TaskMain task={task} handleUpdate={handleUpdate as any} />

          {/* Right Column - Sidebar */}
          <TaskSidebar task={task} handleUpdate={handleUpdate as any} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
