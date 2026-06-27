import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTasksByProjectId,
  updateTask,
  updateTaskStatus,
} from "../api/tasksApi";
import type { Task, TaskStatus } from "./types";
import { commentKeys } from "./useComments";

export const tasksKeys = {
  all: ["tasks"] as const,
  byProject: (projectId: string) => ["tasks", "project", projectId] as const,
};

export function useTasksByProject(projectId: string) {
  return useQuery({
    queryKey: tasksKeys.byProject(projectId),
    queryFn: () => getTasksByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: tasksKeys.all });

      const previousData = queryClient.getQueriesData<Task[]>({
        queryKey: tasksKeys.all,
      });

      queryClient.setQueriesData<Task[]>({ queryKey: tasksKeys.all }, (old) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        );
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: (updatedTask, _err, { taskId }) => {
      if (updatedTask) {
        queryClient.invalidateQueries({
          queryKey: tasksKeys.byProject(updatedTask.projectId),
        });
      }
      // Refresh history tab
      queryClient.invalidateQueries({ queryKey: commentKeys.activity(taskId) });
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({
        queryKey: tasksKeys.byProject(newTask.projectId),
      });
    },
  });
}
export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<Omit<Task, "id" | "createdAt" | "projectId">>;
    }) => updateTask(taskId, data),
    onSuccess: (updatedTask, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: tasksKeys.byProject(updatedTask.projectId),
      });
      // Refresh history tab
      queryClient.invalidateQueries({ queryKey: commentKeys.activity(taskId) });
    },
  });
}
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      projectId,
    }: {
      taskId: string;
      projectId: string;
    }) => deleteTask(taskId),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: tasksKeys.byProject(projectId),
      });
    },
  });
}
