import { ModeToggle } from "@/components/mode-toggle";
import { NotificationDropdown } from "./NotificationDropdown";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6 shrink-0">
      <div className="text-base font-semibold text-foreground">
        Dashboard Overview
      </div>
      <div>
        <NotificationDropdown />
        <ModeToggle />
      </div>
    </header>
  );
}
