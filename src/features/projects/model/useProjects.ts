import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProjectById, getProjects } from "../api/projectsApi";

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
