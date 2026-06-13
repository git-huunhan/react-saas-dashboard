import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getTasksByProjectId, updateTaskStatus } from "../api/tasksApi";
import type { TaskStatus } from "./types";

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
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({
        queryKey: tasksKeys.byProject(updatedTask.projectId),
      });
    },
  });
}
