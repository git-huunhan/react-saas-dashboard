import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../api/projectsApi";

export const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number; status?: string }) =>
    [...projectsKeys.lists(), filters] as const,
  details: () => [...projectsKeys.all, "detail"] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
};

export function useProjects(
  page: number = 1,
  limit: number = 5,
  status?: string,
) {
  return useQuery({
    queryKey: projectsKeys.list({ page, limit, status }),
    queryFn: () => getProjects(page, limit, status),
    placeholderData: keepPreviousData,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectsKeys.detail(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Project, "id" | "createdAt">>;
    }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
    },
  });
}
