import type { ReactNode } from "react";
import "./Badge.css";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
