import { useState } from "react";

import {
  UserModal,
  UserSearch,
  UserTable,
  type CreateUserDto,
} from "@/features/users";
import { mockUsers } from "@/features/users/model/mockUsers";

import Button from "@/shared/ui/Button";

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddUser = (data: CreateUserDto) => {
    const newUser = {
      id: crypto.randomUUID(),
      ...data,
    };

    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <>
      <h1>Users</h1>

      <UserSearch value={search} onChange={setSearch} />

      <UserTable users={filteredUsers} />
      <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
      <UserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </>
  );
}
