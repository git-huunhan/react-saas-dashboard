import { Link, useParams } from "react-router-dom";

import { useProject } from "@/features/projects";
import { KanbanBoard } from "@/features/tasks";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <Badge variant="default">{project.status}</Badge>
        </div>
        <button className="btn btn--primary">Edit Project</button>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-zinc-600 mb-6">{project.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-500">
                    Timeline
                  </span>
                  <span className="text-sm">
                    {project.startDate} to {project.endDate}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-500">
                    Team Size
                  </span>
                  <span className="text-sm">
                    {project.memberIds.length} members
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <KanbanBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Danger Zone
              </h3>
              <p className="text-sm text-zinc-500">
                Configuration options go here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
