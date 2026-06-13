import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getTasksByProjectId, updateTaskStatus } from "../api/tasksApi";
import type { Task, TaskStatus } from "./types";

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

    onSettled: (updatedTask) => {
      if (updatedTask) {
        queryClient.invalidateQueries({
          queryKey: tasksKeys.byProject(updatedTask.projectId),
        });
      }
    },
  });
}
