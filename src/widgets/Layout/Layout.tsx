import { Outlet } from "react-router-dom";

import { Header } from "@/widgets/Header";
import { Sidebar } from "@/widgets/Sidebar";

import "./Layout.css";

export function Layout() {
  return (
    <div className="layout">
      <Header />

      <div className="layout__body">
        <Sidebar />

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
