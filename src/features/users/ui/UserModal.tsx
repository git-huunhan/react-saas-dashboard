import { useState } from "react";

import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import type { CreateUserDto } from "@/features/users";

interface UserModalProps {
  open: boolean;
  onClose: () => void;

  onSubmit: (user: CreateUserDto) => void;
}

export default function UserModal({ open, onClose, onSubmit }: UserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  const handleSubmit = () => {
    onSubmit({
      name,
      email,
      role,
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Add User</h2>

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

      <Button onClick={handleSubmit}>Save</Button>
    </Modal>
  );
}
