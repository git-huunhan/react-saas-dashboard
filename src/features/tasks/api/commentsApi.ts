import { mockUsers } from "../../users/model/mockUsers";
import type { ActivityEntry, Comment } from "../model/types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const ME = mockUsers[0];

// ─── Seed data ────────────────────────────────────────────────────────────────

let commentsDb: Comment[] = [
  {
    id: "comment-1",
    taskId: "task-1",
    authorId: "user-2",
    author: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatarUrl: mockUsers[1].avatarUrl || "",
    },
    body: "Please update the color palette to match the new emerald theme.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "comment-2",
    taskId: "task-1",
    authorId: "user-1",
    author: {
      id: ME.id,
      name: ME.name,
      avatarUrl: ME.avatarUrl || "",
    },
    body: "On it — will push the update by EOD.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const activityDb: ActivityEntry[] = [
  {
    id: "activity-1",
    taskId: "task-1",
    actorId: "user-2",
    actor: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatarUrl: mockUsers[1].avatarUrl || "",
    },
    field: "status",
    from: "To Do",
    to: "In Progress",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "activity-2",
    taskId: "task-1",
    actorId: "user-1",
    actor: {
      id: ME.id,
      name: ME.name,
      avatarUrl: ME.avatarUrl || "",
    },
    field: "priority",
    from: "Low",
    to: "High",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "activity-3",
    taskId: "task-1",
    actorId: "user-2",
    actor: {
      id: mockUsers[1].id,
      name: mockUsers[1].name,
      avatarUrl: mockUsers[1].avatarUrl || "",
    },
    field: "assignee",
    from: "Unassigned",
    to: ME.name,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

// ─── Comment APIs ──────────────────────────────────────────────────────────────

export async function getCommentsByTaskId(taskId: string): Promise<Comment[]> {
  await delay(400);
  return commentsDb
    .filter((c) => c.taskId === taskId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function createComment(
  taskId: string,
  body: string,
): Promise<Comment> {
  await delay(300);
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    taskId,
    authorId: ME.id,
    author: { id: ME.id, name: ME.name, avatarUrl: ME.avatarUrl || "" },
    body,
    createdAt: new Date().toISOString(),
  };
  commentsDb = [newComment, ...commentsDb];

  // Add activity entry for the comment
  activityDb.unshift({
    id: `activity-${Date.now()}`,
    taskId,
    actorId: ME.id,
    actor: { id: ME.id, name: ME.name, avatarUrl: ME.avatarUrl || "" },
    field: "comment",
    from: "",
    to: body,
    createdAt: new Date().toISOString(),
  });

  return newComment;
}

export async function updateComment(
  commentId: string,
  body: string,
): Promise<Comment> {
  await delay(300);
  const comment = commentsDb.find((c) => c.id === commentId);
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== ME.id) throw new Error("Unauthorized");
  comment.body = body;
  comment.updatedAt = new Date().toISOString();
  comment.isEdited = true;
  return { ...comment };
}

export async function deleteComment(commentId: string): Promise<void> {
  await delay(300);
  const comment = commentsDb.find((c) => c.id === commentId);
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== ME.id) throw new Error("Unauthorized");
  commentsDb = commentsDb.filter((c) => c.id !== commentId);
}

// ─── Activity API ──────────────────────────────────────────────────────────────

export async function getActivityByTaskId(
  taskId: string,
): Promise<ActivityEntry[]> {
  await delay(400);
  return activityDb
    .filter((a) => a.taskId === taskId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

/** Call this from task update flows to log field changes automatically */
export function logActivity(
  taskId: string,
  field: string,
  from: string,
  to: string,
  fromAvatar?: string,
  toAvatar?: string,
) {
  activityDb.unshift({
    id: `activity-${Date.now()}`,
    taskId,
    actorId: ME.id,
    actor: { id: ME.id, name: ME.name, avatarUrl: ME.avatarUrl || "" },
    field,
    from,
    to,
    fromAvatar,
    toAvatar,
    createdAt: new Date().toISOString(),
  });
}
