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
    staleTime: 2000, // Prevent immediate background refetch after mutations (avoids DnD interruption)
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
    onMutate: async (newTaskData) => {
      await queryClient.cancelQueries({
        queryKey: tasksKeys.byProject(newTaskData.projectId),
      });
      const previousTasks = queryClient.getQueryData<Task[]>(
        tasksKeys.byProject(newTaskData.projectId),
      );

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        code: `PRJ-${Math.floor(Math.random() * 1000)}`,
        projectId: newTaskData.projectId,
        title: newTaskData.title,
        status: newTaskData.status as any,
        type: newTaskData.type || "task",
        priority: newTaskData.priority || "medium",
        assigneeId: newTaskData.assigneeId || null,
        reporterId: "u1", // mock user
        dueDate: newTaskData.dueDate || undefined,
        description: undefined,
        createdAt: new Date().toISOString(),
        isPending: true,
      };

      queryClient.setQueryData<Task[]>(
        tasksKeys.byProject(newTaskData.projectId),
        (old) => {
          return old ? [...old, optimisticTask] : [optimisticTask];
        },
      );

      return { previousTasks, projectId: newTaskData.projectId };
    },
    onError: (err, newTaskData, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          tasksKeys.byProject(context.projectId),
          context.previousTasks,
        );
      }
    },
    onSettled: (newTask, err, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: tasksKeys.byProject(context?.projectId || ""),
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

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: tasksKeys.all });

      const previousData = queryClient.getQueriesData<Task[]>({
        queryKey: tasksKeys.all,
      });

      queryClient.setQueriesData<Task[]>({ queryKey: tasksKeys.all }, (old) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === taskId ? { ...task, ...data } : task,
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
