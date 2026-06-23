import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth";
import {
  ChevronUp,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  User,
  Users2,
} from "lucide-react";
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
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            S
          </span>
          SaaS Dashboard
        </h2>
      </div>

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

      {/* User profile */}
      <div className="p-3 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent transition-colors group">
              <Avatar className="h-8 w-8 border-2 border-primary/30 shrink-0">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}&backgroundColor=10b981&textColor=ffffff&backgroundType=solid`}
                  alt={user?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 mb-1">
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {user?.name}
            </div>
            <DropdownMenuItem
              onClick={() => {
                navigate("/profile");
                onNavClick?.();
              }}
            >
              <User className="h-4 w-4" />
              Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive cursor-pointer font-medium gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-background flex-col h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sheet */}
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onNavClick={close} />
        </SheetContent>
      </Sheet>
    </>
  );
}
