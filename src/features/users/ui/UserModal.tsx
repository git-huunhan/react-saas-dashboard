import { useEffect, useState } from "react";

import type { CreateUserDto, User } from "@/features/users";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";

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
    <Modal open={open} onClose={onClose}>
      <h2>{user ? "Edit User" : "Add User"}</h2>

      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "admin" | "user")}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <Button disabled={isSubmitting} onClick={handleSubmit}>
        {isSubmitting ? "Saving..." : user ? "Update" : "Save"}
      </Button>
    </Modal>
  );
}
