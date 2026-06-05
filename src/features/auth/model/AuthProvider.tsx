import { useState, type ReactNode } from "react";

import { AuthContext, type User } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = () => {
    const user = {
      id: "1",
      name: "Nhan",
      role: "admin" as const,
    };

    setUser(user);

    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
