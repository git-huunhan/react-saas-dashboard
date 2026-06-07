import { useState } from "react";

import { mockUsers } from "./mockUsers";
import type { CreateUserDto, User } from "./types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);

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
    addUser,
    updateUser,
    deleteUser,
  };
}
