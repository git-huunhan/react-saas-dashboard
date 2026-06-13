import { Link, useParams } from "react-router-dom";

import { useProject } from "@/features/projects";
import { KanbanBoard } from "@/features/tasks";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProject(id || "");

  if (isLoading)
    return (
      <div className="p-10 text-center text-zinc-500">
        Loading project details...
      </div>
    );
  if (isError || !project)
    return (
      <div className="p-10 text-center text-red-500">Project not found</div>
    );

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/projects"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors w-fit"
      >
        &larr; Back to Projects
      </Link>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-mono bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md text-sm">
            {project.key}
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 m-0">
            {project.name}
          </h1>
          <Badge
            variant={project.status === "active" ? "default" : "secondary"}
          >
            {project.status}
          </Badge>
        </div>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 h-9 px-4 py-2">
          Edit Project
        </button>
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
