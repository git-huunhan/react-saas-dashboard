import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal } from "lucide-react";
import { useViewSettingsStore } from "../../model/useViewSettingsStore";

interface ViewSettingsPopoverProps {
  groupBy?: string;
}

export function ViewSettingsPopover({
  groupBy = "None",
}: ViewSettingsPopoverProps) {
  const [open, setOpen] = useState(false);

  const {
    showWorkType,
    setShowWorkType,
    showWorkItemKey,
    setShowWorkItemKey,
    showEpic,
    setShowEpic,
    showLabels,
    setShowLabels,
    showDueDate,
    setShowDueDate,
    showPriority,
    setShowPriority,
    showAssignee,
    setShowAssignee,
    showComment,
    setShowComment,
    showAttachment,
    setShowAttachment,
    triggerExpandAll,
    triggerCollapseAll,
  } = useViewSettingsStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-md transition-colors text-muted-foreground border-muted hover:text-foreground hover:border-muted-foreground aria-expanded:bg-primary/10 aria-expanded:text-primary aria-expanded:!border-primary aria-expanded:hover:bg-primary/20 aria-expanded:hover:text-primary"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 shadow-xl" align="end">
        <div className="flex items-center justify-between pb-2 mb-2 border-b">
          <span className="text-base font-semibold tracking-tight">
            View settings
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-3 -mr-3">
          {/* General View Settings */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Open work items in sidebar
              </span>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Work suggestions
              </span>
              <Switch defaultChecked={true} />
            </div>
          </div>

          <div className="h-px bg-border my-2" />

          {/* Fields */}
          <div className="space-y-3.5">
            <span className="text-sm font-semibold text-foreground block mt-1 mb-3">
              Fields
            </span>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Card cover
              </span>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Work type
              </span>
              <Switch
                checked={showWorkType}
                onCheckedChange={setShowWorkType}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Work item key
              </span>
              <Switch
                checked={showWorkItemKey}
                onCheckedChange={setShowWorkItemKey}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Epic
              </span>
              <Switch checked={showEpic} onCheckedChange={setShowEpic} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Due date
              </span>
              <Switch checked={showDueDate} onCheckedChange={setShowDueDate} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Labels
              </span>
              <Switch checked={showLabels} onCheckedChange={setShowLabels} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Linked work items
              </span>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Priority
              </span>
              <Switch
                checked={showPriority}
                onCheckedChange={setShowPriority}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Assignee
              </span>
              <Switch
                checked={showAssignee}
                onCheckedChange={setShowAssignee}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Comments
              </span>
              <Switch checked={showComment} onCheckedChange={setShowComment} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium leading-snug">
                Attachments
              </span>
              <Switch
                checked={showAttachment}
                onCheckedChange={setShowAttachment}
              />
            </div>
          </div>

          {groupBy !== "None" && (
            <>
              <div className="h-px bg-border my-2" />

              {/* Swimlanes */}
              <div className="space-y-3.5 pb-1">
                <span className="text-sm font-semibold text-foreground block mt-1 mb-3">
                  Swimlanes
                </span>
                <div
                  className="flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/50 p-1 -mx-1 rounded-sm"
                  onClick={() => {
                    triggerExpandAll();
                  }}
                >
                  <span className="text-sm text-muted-foreground font-medium leading-snug">
                    Expand all
                  </span>
                </div>
                <div
                  className="flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/50 p-1 -mx-1 rounded-sm"
                  onClick={() => {
                    triggerCollapseAll();
                  }}
                >
                  <span className="text-sm text-muted-foreground font-medium leading-snug">
                    Collapse all
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
