import { Link, useParams } from "react-router-dom";

import { useProject } from "@/features/projects";
import { KanbanBoard } from "@/features/tasks";
import { Badge } from "@/shared/ui/Badge";
import { Tabs } from "@/shared/ui/Tabs";

import "./ProjectDetailPage.css";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProject(id || "");

  if (isLoading)
    return <div className="pdp-loading">Loading project details...</div>;
  if (isError || !project)
    return <div className="pdp-error">Project not found</div>;

  return (
    <div className="pdp">
      <Link to="/projects" className="pdp__back">
        &larr; Back to Projects
      </Link>

      <div className="pdp__header">
        <div className="pdp__title-wrapper">
          <span className="pdp__key">{project.key}</span>
          <h1 className="pdp__title">{project.name}</h1>
          <Badge
            variant={
              project.status === "active"
                ? "info"
                : project.status === "completed"
                  ? "success"
                  : "warning"
            }
          >
            {project.status}
          </Badge>
        </div>
        <button className="btn btn--primary">Edit Project</button>
      </div>

      <div className="pdp__content">
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tasks">Tasks</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Panel value="overview">
            <div className="pdp__card">
              <h3>Description</h3>
              <p>{project.description}</p>

              <div className="pdp__meta">
                <div className="meta-item">
                  <span className="meta-label">Timeline</span>
                  <span>
                    {project.startDate} to {project.endDate}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Team Size</span>
                  <span>{project.memberIds.length} members</span>
                </div>
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="tasks">
            <KanbanBoard projectId={project.id} />
          </Tabs.Panel>

          <Tabs.Panel value="settings">
            <div className="pdp__card">
              <h3>Project Settings</h3>
              <p className="text-gray">
                Danger zone and configuration options go here.
              </p>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
