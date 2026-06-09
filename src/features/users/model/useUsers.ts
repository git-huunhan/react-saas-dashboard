import { useEffect, useState } from "react";

import type { CreateUserDto, User } from "./types";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/shared/api/usersApi";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const addUser = async (data: CreateUserDto) => {
    const newUser = await createUser(data);

    setUsers((prev) => [...prev, newUser]);
  };

  const updateUserById = async (id: string, data: CreateUserDto) => {
    const updatedUser = await updateUser(id, data);

    setUsers((prev) =>
      prev.map((user) => (user.id === id ? updatedUser : user)),
    );
  };

  const deleteUserById = async (id: string) => {
    await deleteUser(id);

    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return {
    users,
    loading,
    addUser,
    updateUserById,
    deleteUserById,
  };
}
