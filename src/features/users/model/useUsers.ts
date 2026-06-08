import { useEffect, useState } from "react";

import type { CreateUserDto, User } from "./types";

import { getUsers } from "@/shared/api/usersApi";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const addUser = (data: CreateUserDto) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...data,
    };

    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, data: CreateUserDto) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...data,
            }
          : user,
      ),
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
  };
}
