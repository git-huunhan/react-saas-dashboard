import { useEffect, useState } from "react";

import type { CreateUserDto, User } from "@/features/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserModalProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;

  user?: User | null;

  onSubmit: (user: CreateUserDto) => Promise<void>;
}

export function UserModal({
  open,
  isSubmitting,
  onClose,
  user,
  onSubmit,
}: UserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  const isValid = name.trim() !== "" && email.trim() !== "";

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setRole("user");
      return;
    }

    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [open, user]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("user");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    await onSubmit({
      name,
      email,
      role,
    });

    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name.trim() === "" && (
              <p className="text-sm text-red-500">Name is required</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email.trim() === "" && (
              <p className="text-sm text-red-500">Email is required</p>
            )}
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "user")}
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
          className="w-full mt-4"
        >
          {isSubmitting ? "Saving..." : user ? "Update" : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
