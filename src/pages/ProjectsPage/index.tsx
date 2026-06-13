import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ProjectForm,
  useCreateProject,
  useProjects,
} from "@/features/projects";
import { useUrlParams } from "@/shared/hooks/useUrlParams";

export default function ProjectsPage() {
  const { getParam, setParams } = useUrlParams();

  const initialPage = Number(getParam("page", "1"));
  const initialStatus = getParam("status", "all");

  const [page, setPage] = useState(initialPage);
  const [status, setStatus] = useState(initialStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const createMutation = useCreateProject();

  useEffect(() => {
    setPage(Number(getParam("page", "1")));
    setStatus(getParam("status", "all"));
  }, [getParam]);

  const { data, isLoading, isError, isPlaceholderData } = useProjects(
    page,
    5,
    status,
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setPage(1);
    setParams({ status: newStatus !== "all" ? newStatus : "", page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setParams({
      page: newPage.toString(),
      status: status !== "all" ? status : "",
    });
  };

  const getStatusVariant = (s: string) => {
    switch (s) {
      case "active":
        return "info";
      case "completed":
        return "success";
      case "planning":
        return "warning";
      default:
        return "default";
    }
  };

  const handleCreateProject = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        setPage(1);
        setParams({ page: "1" });
      },
    });
  };

  if (isError)
    return <div className="text-red-500 py-4">Failed to load projects.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Projects
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>
      </div>

      <div className="flex gap-4 items-center">
        <select
          value={status}
          onChange={handleFilterChange}
          className="flex h-10 w-[180px] items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
        >
          <option value="all">All Statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="h-12 px-4 align-middle font-medium text-zinc-500 w-[30%]">
                Name
              </th>
              <th className="h-12 px-4 align-middle font-medium text-zinc-500 w-[15%]">
                Key
              </th>
              <th className="h-12 px-4 align-middle font-medium text-zinc-500 w-[15%]">
                Status
              </th>
              <th className="h-12 px-4 align-middle font-medium text-zinc-500 w-[25%]">
                Timeline
              </th>
              <th className="h-12 px-4 align-middle font-medium text-zinc-500 w-[15%]">
                Team
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-4 align-middle">
                    <div className="h-5 w-48 bg-zinc-100 animate-pulse rounded" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-4 w-12 bg-zinc-100 animate-pulse rounded" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-6 w-20 bg-zinc-100 animate-pulse rounded-full" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-4 w-32 bg-zinc-100 animate-pulse rounded" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 animate-pulse border-2 border-white" />
                      <div className="h-8 w-8 rounded-full bg-zinc-200 animate-pulse border-2 border-white" />
                      <div className="h-8 w-8 rounded-full bg-zinc-200 animate-pulse border-2 border-white" />
                    </div>
                  </td>
                </tr>
              ))
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No projects found.
                </td>
              </tr>
            ) : (
              data?.data.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="p-4 align-middle">
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-zinc-500 font-mono text-xs">
                      {project.key}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        project.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : project.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status === "active"
                        ? "Active"
                        : project.status === "completed"
                          ? "Completed"
                          : "Planning"}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-zinc-500">
                      {project.startDate} &rarr; {project.endDate}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-zinc-500">
                    {project.memberIds.length} members
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) handlePageChange(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: data.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < data.totalPages) handlePageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleCreateProject}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
