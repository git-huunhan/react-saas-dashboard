import { UserTable } from "@/features/users";
import { mockUsers } from "@/features/users/model/mockUsers";

export default function UsersPage() {
  return (
    <>
      <h1>Users</h1>

      <UserTable users={mockUsers} />
    </>
  );
}
