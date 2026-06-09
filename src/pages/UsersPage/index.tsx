import { useState } from "react";

import {
  UserModal,
  UserSearch,
  UserTable,
  useUsers,
  type CreateUserDto,
  type User,
} from "@/features/users";

import { Button } from "@/shared/ui/Button";

export default function UsersPage() {
  const { users, loading, addUser, updateUserById, deleteUserById } =
    useUsers();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (user: User) => {
    setSelectedUser(user);

    setIsModalOpen(true);
  };

  const handleSubmitUser = (data: CreateUserDto) => {
    if (selectedUser) {
      updateUserById(selectedUser.id, data);
    } else {
      addUser(data);
    }

    setSelectedUser(null);
  };

  const handleDelete = (id: string) => {
    deleteUserById(id);
  };

  if (loading) {
    return (
      <>
        <h1>Users</h1>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <h1>Users</h1>

      <UserSearch value={search} onChange={setSearch} />

      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
      <UserModal
        open={isModalOpen}
        user={selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setIsModalOpen(false);
        }}
        onSubmit={handleSubmitUser}
      />
    </>
  );
}
