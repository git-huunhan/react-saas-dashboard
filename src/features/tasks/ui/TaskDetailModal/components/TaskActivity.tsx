import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const mockComments = [
  {
    id: 1,
    author: "Admin Pro",
    text: "Please update the color palette to match the new emerald theme.",
    time: "2 hours ago",
  },
];

export function TaskActivity() {
  const [isActivityOpen, setIsActivityOpen] = useState(true);
  const [comment, setComment] = useState("");

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-1 -ml-1 rounded-md w-fit transition-colors group"
          onClick={() => setIsActivityOpen(!isActivityOpen)}
        >
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${!isActivityOpen ? "-rotate-90" : ""} group-hover:text-foreground`}
          />
          <h3 className="text-[15px] font-semibold text-foreground">
            Activity
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">Sort by:</span>
          <span className="font-semibold text-foreground cursor-pointer hover:underline">
            Newest first
          </span>
        </div>
      </div>

      {isActivityOpen && (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-5 border-b border-border/50 pb-0 mb-6 text-sm font-semibold">
            <span className="text-muted-foreground hover:text-foreground cursor-pointer pb-2 transition-colors">
              All
            </span>
            <span className="text-foreground border-b-2 border-primary pb-2 -mb-[1px]">
              Comments
            </span>
            <span className="text-muted-foreground hover:text-foreground cursor-pointer pb-2 transition-colors">
              History
            </span>
            <span className="text-muted-foreground hover:text-foreground cursor-pointer pb-2 transition-colors">
              Work log
            </span>
          </div>

          {/* Comment Box */}
          <div className="flex gap-4 mt-6">
            <Avatar className="w-8 h-8 shrink-0 border border-border/50">
              <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Admin Pro&backgroundColor=10b981&textColor=ffffff" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 border border-border/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
              <Textarea
                placeholder="Add a comment..."
                className="border-0 focus-visible:ring-0 min-h-[70px] resize-none bg-card text-[14px] p-3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="bg-muted/40 px-3 py-2.5 flex items-center gap-2 border-t border-border/50">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Pro tip: press{" "}
                  <kbd className="border border-border/60 bg-background/50 px-1.5 py-0.5 rounded shadow-sm mx-0.5">
                    M
                  </kbd>{" "}
                  to comment
                </span>
                <div className="flex-1" />
                <Button
                  size="sm"
                  className="h-7 text-xs font-semibold px-4"
                  disabled={!comment.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List Mock */}
          <div className="mt-8 space-y-6">
            {mockComments.map((c) => (
              <div key={c.id} className="flex gap-4">
                <Avatar className="w-8 h-8 shrink-0 border border-border/50">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.author}&backgroundColor=10b981&textColor=ffffff`}
                  />
                  <AvatarFallback>{c.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-semibold text-foreground hover:underline cursor-pointer">
                      {c.author}
                    </span>
                    <span className="text-[12px] text-muted-foreground font-medium">
                      {c.time}
                    </span>
                  </div>
                  <p className="text-[14px] text-foreground/90 leading-relaxed">
                    {c.text}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[12px] font-semibold text-muted-foreground">
                    <span className="hover:text-foreground cursor-pointer transition-colors">
                      Reply
                    </span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">
                      Edit
                    </span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
