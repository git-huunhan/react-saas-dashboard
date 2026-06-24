export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  code: string;
  projectId: string;
  title: string;
  description?: string;
  type?: "task" | "epic" | "bug";
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  assigneeId?: string;
  reporterId?: string;
  reporter?: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  labels?: string[];
  dueDate?: string;
  createdAt: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];
