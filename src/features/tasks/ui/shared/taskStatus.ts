import type { TaskStatus } from "../../model/types";

interface TaskStatusPresentation {
  label: string;
  triggerClassName: string;
  dotClassName: string;
}

export const TASK_STATUS_PRESENTATION: Record<
  TaskStatus,
  TaskStatusPresentation
> = {
  todo: {
    label: "To Do",
    triggerClassName:
      "bg-violet-500/15 border-violet-500/40 text-violet-700 dark:text-violet-300 hover:bg-violet-500/25",
    dotClassName: "bg-violet-500 dark:bg-violet-400",
  },
  "in-progress": {
    label: "In Progress",
    triggerClassName:
      "bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25",
    dotClassName: "bg-blue-500 dark:bg-blue-400",
  },
  review: {
    label: "Review",
    triggerClassName:
      "bg-yellow-500/15 border-yellow-500/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/25",
    dotClassName: "bg-yellow-600 dark:bg-yellow-400",
  },
  done: {
    label: "Done",
    triggerClassName:
      "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25",
    dotClassName: "bg-emerald-600 dark:bg-emerald-400",
  },
};

export const TASK_STATUS_ENTRIES = Object.entries(TASK_STATUS_PRESENTATION) as [
  TaskStatus,
  TaskStatusPresentation,
][];

export function getTaskStatusClassName(status: TaskStatus) {
  return TASK_STATUS_PRESENTATION[status].triggerClassName;
}
