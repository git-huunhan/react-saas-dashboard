import { useState } from "react";

import { UserSearch, UserTable } from "@/features/users";
import { mockUsers } from "@/features/users/model/mockUsers";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <h1>Users</h1>

      <UserSearch value={search} onChange={setSearch} />

      <UserTable users={filteredUsers} />
    </>
  );
}
