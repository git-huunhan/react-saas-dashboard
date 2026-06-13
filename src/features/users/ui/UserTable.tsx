import { Button } from "@/components/ui/button";
import type { User } from "@/features/users";

interface UserTableProps {
  users: User[];

  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-center py-8 text-zinc-500">No users found.</p>;
  }

  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-zinc-50 border-b border-zinc-200">
        <tr>
          <th className="h-12 px-4 align-middle font-medium text-zinc-500">
            Name
          </th>
          <th className="h-12 px-4 align-middle font-medium text-zinc-500">
            Email
          </th>
          <th className="h-12 px-4 align-middle font-medium text-zinc-500">
            Role
          </th>
          <th className="h-12 px-4 align-middle font-medium text-zinc-500 text-right">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-zinc-200">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
            <td className="p-4 align-middle font-medium text-zinc-900">
              {user.name}
            </td>
            <td className="p-4 align-middle text-zinc-500">{user.email}</td>
            <td className="p-4 align-middle">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
              >
                {user.role}
              </span>
            </td>
            <td className="p-4 align-middle text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
