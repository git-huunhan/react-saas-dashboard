import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ProjectForm,
  useCreateProject,
  useProjects,
} from "@/features/projects";
import { useUrlParams } from "@/shared/hooks/useUrlParams";
import { Badge } from "@/shared/ui/Badge";
import { Pagination } from "@/shared/ui/Pagination";
import { Modal } from "@/shared/ui/Modal";

import "./ProjectsPage.css";

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
    return <div className="projects-page__error">Failed to load projects.</div>;

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <h1 className="projects-page__title">Projects</h1>
        <button
          className="btn btn--primary"
          onClick={() => setIsModalOpen(true)}
        >
          New Project
        </button>
      </div>

      <div className="projects-page__filters">
        <select
          className="filter-select"
          value={status}
          onChange={handleFilterChange}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="table-container">
        <table
          className={`data-table ${isPlaceholderData ? "is-fetching" : ""}`}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Status</th>
              <th>Timeline</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No projects found.
                </td>
              </tr>
            ) : (
              data?.data.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link
                      to={`/projects/${project.id}`}
                      className="project-link"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td>
                    <span className="project-key">{project.key}</span>
                  </td>
                  <td>
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </td>
                  <td>
                    <span className="project-date">
                      {project.startDate} - {project.endDate}
                    </span>
                  </td>
                  <td>{project.memberIds.length} members</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Create New Project</h2>

        <ProjectForm
          onSubmit={handleCreateProject}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
