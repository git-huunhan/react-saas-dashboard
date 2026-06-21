import { CommandPalette } from "@/widgets/CommandPalette";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";

export function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col relative">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
