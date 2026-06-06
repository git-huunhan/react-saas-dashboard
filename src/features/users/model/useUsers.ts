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

  return {
    users,
    addUser,
  };
}
