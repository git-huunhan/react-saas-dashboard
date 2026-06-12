import type { PaginatedProjects, Project } from "../model/types";

let projectsDb: Project[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `proj-${i + 1}`,
  name: `Project ${i + 1}`,
  key: `PRJ${i + 1}`,
  description: `This is the detailed description for Project ${i + 1}`,
  status: i % 3 === 0 ? "completed" : i % 2 === 0 ? "planning" : "active",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  memberIds: ["1", "2"],
}));

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProjects(
  page: number = 1,
  limit: number = 5,
  status?: string,
): Promise<PaginatedProjects> {
  await delay(600);

  let filtered = [...projectsDb];
  if (status && status !== "all") {
    filtered = filtered.filter((p) => p.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    totalCount: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

export async function getProjectById(id: string): Promise<Project> {
  await delay(400);
  const project = projectsDb.find((p) => p.id === id);
  if (!project) throw new Error("Project not found");
  return { ...project };
}
