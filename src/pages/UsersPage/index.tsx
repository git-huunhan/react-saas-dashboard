import { useState } from "react";

import { UserModal, UserSearch, UserTable, useUsers } from "@/features/users";

import { Button } from "@/shared/ui/Button";

export default function UsersPage() {
  const { users, addUser } = useUsers();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <h1>Users</h1>

      <UserSearch value={search} onChange={setSearch} />

      <UserTable users={filteredUsers} />
      <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
      <UserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addUser}
      />
    </>
  );
}
