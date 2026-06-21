import type { Task, TaskStatus } from "../model/types";
import { getProjectKeySync } from "../../projects/api/projectsApi";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PRIORITIES = ["low", "medium", "high"] as const;
const STATUSES: TaskStatus[] = ["todo", "in-progress", "review", "done"];

let tasksDb: Task[] = Array.from({ length: 60 }).map((_, i) => {
  const projectId = `proj-${(i % 24) + 1}`;
  return {
    id: `task-${i + 1}`,
    code: `${getProjectKeySync(projectId)}-${i + 101}`,
    projectId,
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
  };
});

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
  data: Omit<Task, "id" | "createdAt" | "code" | "assignee">,
): Promise<Task> {
  await delay(500);
  const newTask: Task = {
    ...data,
    id: `task-${Date.now()}`,
    code: `${getProjectKeySync(data.projectId)}-${Math.floor(Math.random() * 900) + 100}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  tasksDb = [newTask, ...tasksDb];
  return newTask;
}

export async function updateTask(
  taskId: string,
  data: Partial<
    Omit<Task, "id" | "createdAt" | "projectId" | "code" | "assignee">
  >,
): Promise<Task> {
  await delay(300);
  const task = tasksDb.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found");
  Object.assign(task, data);
  return { ...task };
}

export async function deleteTask(taskId: string): Promise<void> {
  await delay(300);
  tasksDb = tasksDb.filter((t) => t.id !== taskId);
}
