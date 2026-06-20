import { useState, type ReactNode } from "react";

import { AuthContext, type User } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const MOCK_ACCOUNTS = [
  {
    email: "admin@demo.com",
    password: "admin123",
    user: { id: "1", name: "Admin Pro", role: "admin" as const },
  },
  {
    email: "user@demo.com",
    password: "user123",
    user: { id: "2", name: "Jane Smith", role: "user" as const },
  },
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 800));
    const account = MOCK_ACCOUNTS.find(
      (a) => a.email === email && a.password === password,
    );
    if (!account) {
      return { success: false, error: "Invalid email or password" };
    }
    setUser(account.user);
    localStorage.setItem("user", JSON.stringify(account.user));
    return { success: true };
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
