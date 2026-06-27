import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ActivityEntry, Comment } from "../model/types";
import {
  createComment,
  deleteComment,
  getActivityByTaskId,
  getCommentsByTaskId,
  updateComment,
} from "../api/commentsApi";
import { mockUsers } from "../../users/model/mockUsers";

const CURRENT_USER = mockUsers[0]; // In real app: from auth context

// ─── Query keys ────────────────────────────────────────────────────────────────
export const commentKeys = {
  all: ["comments"] as const,
  byTask: (taskId: string) => ["comments", taskId] as const,
  activity: (taskId: string) => ["activity", taskId] as const,
};

// ─── Comments ──────────────────────────────────────────────────────────────────

export function useComments(taskId: string) {
  const { data, isLoading } = useQuery<Comment[]>({
    queryKey: commentKeys.byTask(taskId),
    queryFn: () => getCommentsByTaskId(taskId),
    enabled: !!taskId,
    staleTime: 30_000,
  });

  return { comments: data ?? [], isLoading };
}

export function useCreateComment(taskId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => createComment(taskId, body),

    // Optimistic insert at the top
    onMutate: async (body) => {
      await qc.cancelQueries({ queryKey: commentKeys.byTask(taskId) });
      const previous = qc.getQueryData<Comment[]>(commentKeys.byTask(taskId));

      const optimistic: Comment = {
        id: `optimistic-${Date.now()}`,
        taskId,
        authorId: CURRENT_USER.id,
        author: {
          id: CURRENT_USER.id,
          name: CURRENT_USER.name,
          avatarUrl: CURRENT_USER.avatarUrl ?? "",
        },
        body,
        createdAt: new Date().toISOString(),
      };

      qc.setQueryData<Comment[]>(commentKeys.byTask(taskId), (old = []) => [
        optimistic,
        ...old,
      ]);

      return { previous };
    },

    onError: (_err, _body, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(commentKeys.byTask(taskId), ctx.previous);
      }
      toast.error("Failed to post comment");
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
      qc.invalidateQueries({ queryKey: commentKeys.activity(taskId) });
    },
  });
}

export function useUpdateComment(taskId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, body }: { commentId: string; body: string }) =>
      updateComment(commentId, body),

    onMutate: async ({ commentId, body }) => {
      await qc.cancelQueries({ queryKey: commentKeys.byTask(taskId) });
      const previous = qc.getQueryData<Comment[]>(commentKeys.byTask(taskId));

      qc.setQueryData<Comment[]>(commentKeys.byTask(taskId), (old = []) =>
        old.map((c) =>
          c.id === commentId
            ? {
                ...c,
                body,
                isEdited: true,
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(commentKeys.byTask(taskId), ctx.previous);
      }
      toast.error("Failed to update comment");
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
    },
  });
}

export function useDeleteComment(taskId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),

    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: commentKeys.byTask(taskId) });
      const previous = qc.getQueryData<Comment[]>(commentKeys.byTask(taskId));

      qc.setQueryData<Comment[]>(commentKeys.byTask(taskId), (old = []) =>
        old.filter((c) => c.id !== commentId),
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(commentKeys.byTask(taskId), ctx.previous);
      }
      toast.error("Failed to delete comment");
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.byTask(taskId) });
    },
  });
}

// ─── Activity ──────────────────────────────────────────────────────────────────

export function useActivity(taskId: string) {
  const { data, isLoading } = useQuery<ActivityEntry[]>({
    queryKey: commentKeys.activity(taskId),
    queryFn: () => getActivityByTaskId(taskId),
    enabled: !!taskId,
    staleTime: 30_000,
  });

  return { entries: data ?? [], isLoading };
}
