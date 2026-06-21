import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/features/projects";
import { KanbanBoard } from "@/features/tasks";

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
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-6 p-6 md:p-8 pb-0 shrink-0">
        <Link
          to="/projects"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          &larr; Back to Projects
        </Link>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-mono bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
              {project.key}
            </span>
            <h1 className="text-2xl font-bold text-foreground m-0">
              {project.name}
            </h1>
            <Badge
              variant={project.status === "active" ? "default" : "secondary"}
            >
              {project.status}
            </Badge>
          </div>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
            Edit Project
          </button>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        className="w-full flex-1 flex flex-col mt-6 min-h-0"
      >
        <div className="px-6 md:px-8 shrink-0">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <TabsContent
            value="overview"
            className="h-full overflow-y-auto px-6 md:px-8 pb-6 md:pb-8 pt-6"
          >
            <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground mb-6">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Timeline
                  </span>
                  <span className="text-sm">
                    {project.startDate} to {project.endDate}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Team Size
                  </span>
                  <span className="text-sm">
                    {project.memberIds.length} members
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="tasks"
            className="h-full m-0 p-0 flex flex-col data-[state=active]:flex pt-6"
          >
            <KanbanBoard projectId={project.id} />
          </TabsContent>

          <TabsContent
            value="settings"
            className="h-full overflow-y-auto px-6 md:px-8 pb-6 md:pb-8 pt-6"
          >
            <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-destructive">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground">
                Configuration options go here.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
