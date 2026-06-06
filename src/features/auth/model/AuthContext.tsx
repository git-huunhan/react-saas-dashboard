import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
}

export interface AuthContextValue {
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
