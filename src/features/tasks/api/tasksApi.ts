import { getProjectKeySync } from "../../projects/api/projectsApi";
import type { Task, TaskStatus } from "../model/types";
import { mockUsers } from "../../users/model/mockUsers";
import { logActivity } from "./commentsApi";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PRIORITIES = ["low", "medium", "high"] as const;
const STATUSES: TaskStatus[] = ["todo", "in-progress", "review", "done"];

let tasksDb: Task[] = Array.from({ length: 60 }).map((_, i) => {
  const projectId = `proj-${(i % 24) + 1}`;
  const assigneeId = `user-${(i % 3) + 1}`;
  const user = mockUsers.find((u) => u.id === assigneeId);

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
    type: i === 1 || i === 5 ? "epic" : i % 4 === 0 ? "bug" : "task",
    status: STATUSES[i % 4],
    priority: PRIORITIES[i % 3],
    assigneeId,
    assignee: user
      ? { id: user.id, name: user.name, avatarUrl: user.avatarUrl || "" }
      : undefined,
    labels: i % 2 === 0 ? ["Frontend"] : [],
    dueDate: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
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

  const STATUS_LABELS: Record<TaskStatus, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  };
  logActivity(
    taskId,
    "status",
    STATUS_LABELS[task.status],
    STATUS_LABELS[status],
  );

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
    reporterId: "user-1",
    reporter: mockUsers[0]
      ? {
          id: mockUsers[0].id,
          name: mockUsers[0].name,
          avatarUrl: mockUsers[0].avatarUrl || "",
        }
      : undefined,
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

  const STATUS_LABELS: Record<TaskStatus, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  };

  // Log changes before applying
  if (data.status && data.status !== task.status) {
    logActivity(
      taskId,
      "status",
      STATUS_LABELS[task.status],
      STATUS_LABELS[data.status],
    );
  }
  if (data.priority && data.priority !== task.priority) {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    logActivity(taskId, "priority", cap(task.priority), cap(data.priority));
  }
  if (data.assigneeId !== undefined && data.assigneeId !== task.assigneeId) {
    const oldUser = task.assignee?.name ?? "Unassigned";
    const oldAvatar = task.assignee?.avatarUrl;
    const newUserObj =
      data.assigneeId === null
        ? null
        : mockUsers.find((u) => u.id === data.assigneeId);
    const newUser = newUserObj?.name ?? "Unassigned";
    const newAvatar = newUserObj?.avatarUrl;
    logActivity(taskId, "assignee", oldUser, newUser, oldAvatar, newAvatar);
  }
  if (data.dueDate !== undefined && data.dueDate !== task.dueDate) {
    logActivity(taskId, "due date", task.dueDate ?? "—", data.dueDate || "—");
  }
  if (data.reporterId !== undefined && data.reporterId !== task.reporterId) {
    const oldReporter = task.reporter?.name ?? "Unassigned";
    const oldAvatar = task.reporter?.avatarUrl;
    const newReporterObj =
      data.reporterId === null
        ? null
        : mockUsers.find((u) => u.id === data.reporterId);
    const newReporter = newReporterObj?.name ?? "Unassigned";
    const newAvatar = newReporterObj?.avatarUrl;
    logActivity(
      taskId,
      "reporter",
      oldReporter,
      newReporter,
      oldAvatar,
      newAvatar,
    );
  }
  if (data.labels !== undefined) {
    const oldLabels = (task.labels ?? []).join(", ") || "None";
    const newLabels = (data.labels as string[]).join(", ") || "None";
    if (oldLabels !== newLabels) {
      logActivity(taskId, "labels", oldLabels, newLabels);
    }
  }

  Object.assign(task, data);

  if (data.assigneeId !== undefined) {
    if (data.assigneeId === null) {
      task.assignee = undefined;
    } else {
      const user = mockUsers.find((u) => u.id === data.assigneeId);
      if (user) {
        task.assignee = {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl || "",
        };
      }
    }
  }

  if (data.reporterId !== undefined) {
    if (data.reporterId === null) {
      task.reporter = undefined;
    } else {
      const user = mockUsers.find((u) => u.id === data.reporterId);
      if (user) {
        task.reporter = {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl || "",
        };
      }
    }
  }

  return { ...task };
}

export async function deleteTask(taskId: string): Promise<void> {
  await delay(300);
  tasksDb = tasksDb.filter((t) => t.id !== taskId);
}
