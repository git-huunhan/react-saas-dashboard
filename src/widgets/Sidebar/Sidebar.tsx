import { Sheet, SheetContent } from "@/components/ui/sheet";

import { FolderKanban, LayoutDashboard, Users2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "./useSidebar";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users2 },
  { to: "/projects", label: "Projects", icon: FolderKanban },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map((link) => {
          const isActive =
            location.pathname === link.to ||
            (link.to !== "/" && location.pathname.startsWith(link.to));
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavClick}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const { isMobileOpen, closeMobile, isDesktopClosed } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-full shrink-0 border-r bg-background ${
          isDesktopClosed
            ? "w-0 overflow-hidden border-none opacity-0"
            : "w-64 opacity-100"
        }`}
      >
        <div className="w-64 h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sheet */}
      <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onNavClick={closeMobile} />
        </SheetContent>
      </Sheet>
    </>
  );
}
