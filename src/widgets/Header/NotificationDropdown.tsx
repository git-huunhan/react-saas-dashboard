import { useState } from "react";
import { Bell, Check } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Task Assigned",
      description: "You have been assigned to 'Design homepage mockup'",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Project Status Changed",
      description: "Project 'SaaS Dashboard' is now Active",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "New Comment",
      description: "Jane left a comment on 'Setup database'",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="px-1.5 py-0 text-[10px] bg-primary/10 text-primary hover:bg-primary/20"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={markAllAsRead}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex flex-col gap-1 p-4 border-b border-border last:border-0 transition-colors hover:bg-muted/50 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {n.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                    {n.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
