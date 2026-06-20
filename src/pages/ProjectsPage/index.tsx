import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGuard } from "@/features/auth";
import {
  ProjectForm,
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
  type Project,
} from "@/features/projects";
import { useUrlParams } from "@/shared/hooks/useUrlParams";
import { FolderKanban, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProjectsPage() {
  const { getParam, setParams } = useUrlParams();

  const initialPage = Number(getParam("page", "1"));
  const initialStatus = getParam("status", "all");

  const [page, setPage] = useState(initialPage);
  const [status, setStatus] = useState(initialStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const createMutation = useCreateProject();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  useEffect(() => {
    setPage(Number(getParam("page", "1")));
    setStatus(getParam("status", "all"));
  }, [getParam]);

  const { data, isLoading, isError, isPlaceholderData } = useProjects(
    page,
    5,
    status,
  );

  const handleFilterChange = (newStatus: string) => {
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
        toast.success("Project created successfully");
      },
      onError: () => {
        toast.error("Failed to create project");
      },
    });
  };

  const handleEditProject = (data: any) => {
    if (!editingProject) return;
    updateMutation.mutate(
      { id: editingProject.id, data },
      {
        onSuccess: () => {
          setEditingProject(null);
          toast.success("Project updated");
        },
        onError: () => toast.error("Failed to update project"),
      },
    );
  };

  const handleDeleteProject = () => {
    if (!deletingProjectId) return;
    deleteMutation.mutate(deletingProjectId, {
      onSuccess: () => {
        setDeletingProjectId(null);
        toast.success("Project deleted");
      },
      onError: () => toast.error("Failed to delete project"),
    });
  };

  if (isError)
    return <div className="text-red-500 py-4">Failed to load projects.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Projects
        </h1>
        <RoleGuard allowedRoles={["admin"]}>
          <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>
        </RoleGuard>
      </div>

      <div className="flex gap-4 items-center">
        <Select value={status} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card text-card-foreground overflow-hidden">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-muted border-b">
            <tr>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[30%]">
                Name
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[15%]">
                Key
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[15%]">
                Status
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[22%]">
                Timeline
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[13%]">
                Team
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[10%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-4 align-middle">
                    <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse border-2 border-background" />
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse border-2 border-background" />
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse border-2 border-background" />
                    </div>
                  </td>
                </tr>
              ))
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-0">
                  <EmptyState
                    icon={FolderKanban}
                    title="No projects found"
                    description={
                      status !== "all"
                        ? `No projects with status "${status}". Try changing the filter.`
                        : "Get started by creating your first project."
                    }
                    action={
                      <RoleGuard allowedRoles={["admin"]}>
                        <Button size="sm" onClick={() => setIsModalOpen(true)}>
                          Create Project
                        </Button>
                      </RoleGuard>
                    }
                  />
                </td>
              </tr>
            ) : (
              data?.data.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4 align-middle">
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-muted-foreground font-mono text-xs">
                      {project.key}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        project.status === "active"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : project.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
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
                    <span className="text-muted-foreground">
                      {project.startDate} &rarr; {project.endDate}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {project.memberIds.length} members
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-1">
                      <RoleGuard allowedRoles={["admin"]}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditingProject(project)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeletingProjectId(project.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </RoleGuard>
                    </div>
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

      <Dialog
        open={!!editingProject}
        onOpenChange={() => setEditingProject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialData={editingProject ?? undefined}
            onSubmit={handleEditProject}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingProjectId}
        onOpenChange={() => setDeletingProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All tasks in this project will also
              be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteProject}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
