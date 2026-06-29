import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUpdateTask } from "@/features/tasks";

import type { Task } from "../../model/types";
import { TaskDetailPanel } from "./components/TaskDetailPanel";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onOpenTask?: (task: Task) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onEdit, // unused for now
  onDelete,
  onOpenTask,
}: TaskDetailModalProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1240px] w-[95vw] p-0 gap-0 h-[85vh] flex flex-col overflow-hidden bg-background border-border/60 shadow-2xl">
        <TaskDetailPanel
          task={task}
          onClose={onClose}
          onDelete={onDelete}
          onOpenTask={onOpenTask}
        />
      </DialogContent>
    </Dialog>
  );
}
