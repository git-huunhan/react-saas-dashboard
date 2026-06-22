import { useState, useEffect } from "react";
import {
  ChevronDown,
  GitFork,
  Link as LinkIcon,
  Paperclip,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Task } from "../../../model/types";
import { TaskActivity } from "./TaskActivity";

interface TaskMainProps {
  task: Task;
  handleUpdate: (field: "title" | "description", value: string) => void;
}

export function TaskMain({ task, handleUpdate }: TaskMainProps) {
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isAttachOpen, setIsAttachOpen] = useState(true);

  // Sync state when task opens/changes
  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDesc(task.description || "");
    }
  }, [task]);

  return (
    <div className="w-2/3 shrink-0 flex flex-col overflow-hidden border-r border-border/40 bg-card">
      <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar min-h-0 pt-5">
        <div className="max-w-4xl pb-12">
          {/* Title Editable */}
          <div className="mb-6 -ml-2">
            <h1
              contentEditable={isEditingTitle}
              suppressContentEditableWarning
              className={`!text-2xl !font-semibold text-foreground tracking-tight leading-[1.2] p-2 rounded-md cursor-text transition-colors border m-0 whitespace-pre-wrap outline-none ${isEditingTitle ? "bg-background border-primary/50 ring-1 ring-primary/50 shadow-sm" : "border-transparent hover:bg-muted/40"}`}
              onClick={(e) => {
                if (!isEditingTitle) {
                  setIsEditingTitle(true);
                  const target = e.currentTarget;
                  setTimeout(() => {
                    target.focus();
                    // Move cursor to the end
                    if (typeof window !== "undefined") {
                      const selection = window.getSelection();
                      const range = document.createRange();
                      range.selectNodeContents(target);
                      range.collapse(false);
                      selection?.removeAllRanges();
                      selection?.addRange(range);
                    }
                  }, 0);
                }
              }}
              onBlur={(e) => {
                setIsEditingTitle(false);
                const newTitle = e.currentTarget.textContent?.trim();
                if (newTitle && newTitle !== task.title) {
                  handleUpdate("title", newTitle);
                } else {
                  e.currentTarget.textContent = task.title; // revert if empty
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.blur(); // Triggers onBlur to save
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setIsEditingTitle(false);
                  e.currentTarget.textContent = task.title; // Revert
                  e.currentTarget.blur();
                }
              }}
            >
              {task.title}
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold bg-muted/20 border-border/60 hover:bg-muted/50 transition-colors shadow-sm"
            >
              <Paperclip className="w-3.5 h-3.5 mr-2" /> Attach
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold bg-muted/20 border-border/60 hover:bg-muted/50 transition-colors shadow-sm"
            >
              <GitFork className="w-3.5 h-3.5 mr-2" /> Create subtask
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold bg-muted/20 border-border/60 hover:bg-muted/50 transition-colors shadow-sm"
            >
              <LinkIcon className="w-3.5 h-3.5 mr-2" /> Link issue
            </Button>
          </div>

          {/* Description */}
          <div className="mb-10">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 -ml-1 rounded-md w-fit transition-colors mb-3 group"
              onClick={() => setIsDescOpen(!isDescOpen)}
            >
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${!isDescOpen ? "-rotate-90" : ""} group-hover:text-foreground`}
              />
              <h3 className="text-[15px] font-semibold text-foreground">
                Description
              </h3>
            </div>

            {isDescOpen && (
              <>
                <div className="flex flex-col gap-2">
                  <div
                    contentEditable={isEditingDesc}
                    suppressContentEditableWarning
                    className={`text-[14px] px-2 py-3 -ml-2 rounded-md cursor-text border whitespace-pre-wrap leading-normal outline-none min-h-[60px] transition-colors ${isEditingDesc ? "bg-background border-primary/50 ring-1 ring-primary/50 text-foreground shadow-sm min-h-[120px]" : "text-foreground/80 hover:bg-muted/30 border-transparent hover:border-border/50"}`}
                    onClick={(e) => {
                      if (!isEditingDesc) {
                        setEditDesc(task.description || "");
                        setIsEditingDesc(true);
                        const target = e.currentTarget;
                        setTimeout(() => {
                          target.focus();
                          if (typeof window !== "undefined") {
                            const selection = window.getSelection();
                            const range = document.createRange();
                            range.selectNodeContents(target);
                            range.collapse(false);
                            selection?.removeAllRanges();
                            selection?.addRange(range);
                          }
                        }, 0);
                      }
                    }}
                    onInput={(e) => {
                      setEditDesc((e.target as HTMLDivElement).innerText || "");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.preventDefault();
                        setIsEditingDesc(false);
                        e.currentTarget.innerText = task.description || "";
                        setEditDesc(task.description || "");
                      }
                    }}
                  >
                    {task.description ||
                      (isEditingDesc ? (
                        ""
                      ) : (
                        <span
                          className="text-muted-foreground"
                          contentEditable={false}
                        >
                          Add a description...
                        </span>
                      ))}
                  </div>
                  {isEditingDesc && (
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsEditingDesc(false);
                          handleUpdate(
                            "description",
                            editDesc || task.description || "",
                          );
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          setIsEditingDesc(false);
                          setEditDesc(task.description || "");
                          // Revert DOM content
                          const div = e.currentTarget.parentElement
                            ?.previousElementSibling as HTMLDivElement;
                          if (div) div.innerText = task.description || "";
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Attachments */}
          <div className="mb-10">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 -ml-1 rounded-md w-fit transition-colors mb-3 group"
              onClick={() => setIsAttachOpen(!isAttachOpen)}
            >
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${!isAttachOpen ? "-rotate-90" : ""} group-hover:text-foreground`}
              />
              <h3 className="text-[15px] font-semibold text-foreground">
                Attachments
              </h3>
            </div>

            {isAttachOpen && (
              <div className="border border-dashed border-border/80 bg-muted/10 rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:border-border transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 group-hover:text-foreground transition-colors" />
                  <span className="text-sm font-medium">
                    Drop files to attach, or{" "}
                    <span className="text-primary hover:underline">browse</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Activity Section */}
          <TaskActivity />
        </div>
      </div>
    </div>
  );
}
