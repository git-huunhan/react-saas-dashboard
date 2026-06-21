import {
  Calendar,
  ChevronDown,
  ClipboardList,
  FileText,
  Filter,
  FolderKanban,
  GanttChart,
  Globe,
  KanbanSquare,
  Layers,
  LayoutGrid,
  LayoutList,
  List,
  Maximize2,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Users,
} from "lucide-react";
import { useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <Tabs
      defaultValue="list"
      className="flex flex-col h-full w-full bg-background overflow-hidden"
    >
      <div className="flex flex-col border-b border-border bg-background pt-4 pb-2 px-6 shrink-0 gap-4">
        {/* Top: Breadcrumb */}
        <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          Spaces
        </div>

        {/* Row 2: Title and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md shadow-sm">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-foreground m-0 flex items-center gap-2">
              {project.name}
              <Badge
                variant="secondary"
                className="font-normal text-xs px-2 py-0.5 h-6 flex items-center gap-1 bg-muted/50 hover:bg-muted/80 ml-2"
              >
                <Users className="w-3 h-3" />
                22
              </Badge>
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground border-muted rounded-md hover:text-foreground hover:border-muted-foreground transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground border-muted rounded-md hover:text-foreground hover:border-muted-foreground transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Row 3: Tabs */}
        <div className="flex items-center mt-2">
          <TabsList className="h-9 bg-transparent gap-2 justify-start overflow-x-auto overflow-y-hidden w-full border-b border-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1 -ml-1 py-1 -my-1">
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-9 flex-none px-2.5 gap-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-none"
            >
              <Globe className="w-4 h-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-9 flex-none px-2.5 gap-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-none"
            >
              <KanbanSquare className="w-4 h-4" />
              Board
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-9 flex-none px-2.5 gap-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-none"
            >
              <List className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-9 flex-none px-2.5 gap-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-none"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-9 flex-none px-2.5 gap-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-none"
            >
              <GanttChart className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-9 flex-none px-2.5 gap-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-none"
            >
              <FileText className="w-4 h-4" />
              Docs
            </TabsTrigger>
            <TabsTrigger
              value="forms"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary h-9 flex-none px-2.5 gap-2 text-muted-foreground data-[state=active]:text-foreground font-medium transition-none"
            >
              <ClipboardList className="w-4 h-4" />
              Forms
            </TabsTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-none text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </TabsList>
        </div>

        {/* Row 4: Filters Toolbar */}
        <div className="flex items-center justify-between pb-1 mt-1">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground" />
              <Input
                type="search"
                placeholder="Search w..."
                className="w-[180px] pl-8 h-8 bg-transparent text-sm border-muted hover:border-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30 transition-colors"
              />
            </div>
            <div className="flex -space-x-2">
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
              <Badge className="h-5 px-1.5 ml-1 bg-primary text-primary-foreground font-normal rounded-sm">
                1
              </Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-transparent border-muted text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              Group
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-muted-foreground hover:text-foreground font-normal"
            >
              Saved filters
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Button>

            <div className="flex items-center h-8 border border-muted rounded-md p-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square rounded-sm bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-full aspect-square rounded-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground border-muted rounded-md hover:text-foreground hover:border-muted-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <TabsContent
          value="summary"
          className="h-full overflow-y-auto px-6 md:px-8 pb-6 md:pb-8 pt-6 m-0"
        >
          <div className="bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground mb-6">{project.description}</p>

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
          value="list"
          className="h-full m-0 p-0 flex flex-col data-[state=active]:flex pt-4 px-6"
        >
          <div className="text-muted-foreground p-8 text-center border-2 border-dashed border-border rounded-lg m-4">
            List View Features will be added later
          </div>
        </TabsContent>

        <TabsContent
          value="board"
          className="h-full m-0 p-0 flex flex-col data-[state=active]:flex pt-4"
        >
          <KanbanBoard projectId={project.id} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
