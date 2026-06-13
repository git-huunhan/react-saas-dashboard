import { createBrowserRouter } from "react-router-dom";

import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ProjectsPage from "@/pages/ProjectsPage";
import UsersPage from "@/pages/UsersPage";

import { Layout } from "@/widgets/Layout";

import { ProtectedRoute } from "@/features/auth";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
          {
            path: "/projects",
            element: <ProjectsPage />,
          },
          {
            path: "/projects/:id",
            element: <ProjectDetailPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
