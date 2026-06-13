import { useState } from "react";

import {
  UserModal,
  UserSearch,
  UserTable,
  useUsers,
  type CreateUserDto,
  type User,
} from "@/features/users";

import { Button } from "@/components/ui/button";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Users
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <UserSearch value={search} onChange={setSearch} />

      <div className="rounded-md border bg-white overflow-hidden">
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
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
    </div>
  );
}
