import { useAuth } from "@/features/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="text-xl font-semibold text-zinc-800">
        Dashboard Overview
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border border-zinc-200">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-zinc-500">{user?.role}</p>
              </div>
            </div>
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 cursor-pointer font-medium mt-1"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
