import type { Task, TaskStatus } from "../model/types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PRIORITIES = ["low", "medium", "high"] as const;
const STATUSES: TaskStatus[] = ["todo", "in-progress", "review", "done"];

let tasksDb: Task[] = Array.from({ length: 60 }).map((_, i) => ({
  id: `task-${i + 1}`,
  projectId: `proj-${(i % 24) + 1}`,
  title: [
    "Design homepage mockup",
    "Set up CI/CD pipeline",
    "Write unit tests",
    "Fix authentication bug",
    "Implement dark mode",
    "Review pull requests",
    "Update API documentation",
    "Optimize database queries",
    "Deploy to staging",
    "User research interviews",
  ][i % 10],
  description: `Description for task ${i + 1}`,
  status: STATUSES[i % 4],
  priority: PRIORITIES[i % 3],
  assigneeId: `user-${(i % 3) + 1}`,
  createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
}));

export async function getTasksByProjectId(projectId: string): Promise<Task[]> {
  await delay(500);
  return tasksDb.filter((t) => t.projectId === projectId);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task> {
  await delay(300);
  const task = tasksDb.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found");
  task.status = status;
  return { ...task };
}

export async function createTask(
  data: Omit<Task, "id" | "createdAt">,
): Promise<Task> {
  await delay(500);
  const newTask: Task = {
    ...data,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  tasksDb = [newTask, ...tasksDb];
  return newTask;
}
