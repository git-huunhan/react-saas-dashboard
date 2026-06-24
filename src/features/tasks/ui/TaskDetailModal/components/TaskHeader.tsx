import {
  Bug,
  ClipboardList,
  Crown,
  Eye,
  Lock,
  Maximize2,
  MoreHorizontal,
  Share2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Task } from "../../../model/types";

interface TaskHeaderProps {
  task: Task;
  onClose: () => void;
  onDelete?: (task: Task) => void;
}

export function TaskHeader({ task, onClose, onDelete }: TaskHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-border/40 bg-card z-20">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
        {task.type !== "epic" && (
          <>
            <span className="hover:underline cursor-pointer transition-colors hover:text-foreground flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-purple-500" />
              PRJ1-99
            </span>
            <span className="opacity-50">/</span>
          </>
        )}
        <span className="text-foreground hover:underline cursor-pointer flex items-center gap-1.5">
          {task.type === "epic" ? (
            <Crown className="w-4 h-4 text-purple-500" />
          ) : task.type === "bug" ? (
            <Bug className="w-4 h-4 text-red-500" />
          ) : (
            <ClipboardList className="w-4 h-4 text-primary" />
          )}
          {task.code || `TASK-${task.id.slice(-3)}`}
        </span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
        >
          <Lock className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold px-2.5 border-border/60 shadow-sm rounded-md"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" /> 1
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onDelete && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                onClick={() => onDelete(task)}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-px h-4 bg-border/60 mx-1"></div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-muted/50 rounded-md border-border/60 shadow-sm transition-colors hover:text-foreground"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
