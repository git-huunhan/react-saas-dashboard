import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/users", label: "Users" },
    { to: "/projects", label: "Projects" },
  ];

  return (
    <aside className="w-64 border-r bg-zinc-50 p-4 flex flex-col min-h-screen">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          SaaS Dashboard
        </h2>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive =
            location.pathname === link.to ||
            (link.to !== "/" && location.pathname.startsWith(link.to));

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
