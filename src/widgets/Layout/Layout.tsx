import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
