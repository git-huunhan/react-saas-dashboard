import { ModeToggle } from "@/components/mode-toggle";
import { NotificationDropdown } from "./NotificationDropdown";

export function Header() {
  const openSearch = () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }),
    );

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6 shrink-0">
      <div className="text-base font-semibold text-foreground">
        Dashboard Overview
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={openSearch}
          className="hidden sm:flex items-center gap-2 h-8 px-3 text-xs text-muted-foreground bg-muted/50 hover:bg-muted rounded-md border border-border transition-colors mr-2"
        >
          <span>Search...</span>
          <kbd className="inline-flex items-center rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
            Ctrl K
          </kbd>
        </button>

        <NotificationDropdown />
        <ModeToggle />
      </div>
    </header>
  );
}
