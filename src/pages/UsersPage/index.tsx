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
  const {
    users,
    loading,
    error,
    isSubmitting,
    addUser,
    updateUserById,
    deleteUserById,
  } = useUsers();
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

  const handleSubmitUser = async (data: CreateUserDto) => {
    if (selectedUser) {
      await updateUserById(selectedUser.id, data);
    } else {
      await addUser(data);
    }

    setSelectedUser(null);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this user?");

    if (!confirmed) return;

    await deleteUserById(id);
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

      {error && <p>{error}</p>}

      <UserSearch value={search} onChange={setSearch} />

      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
      <UserModal
        open={isModalOpen}
        isSubmitting={isSubmitting}
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
