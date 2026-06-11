import { useState } from "react";

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";

import { useDashboardStats } from "@/features/dashboard";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useDashboardStats();
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return (
    <>
      <Card>
        <h1>Dashboard</h1>

        <Input id="email" label="Email" placeholder="Enter your email" />

        <br />

        <Input
          id="password"
          label="Password"
          type="password"
          error="Password is required"
        />

        <br />
        <br />

        <Button>Save</Button>

        <Button variant="secondary" size="sm">
          Cancel
        </Button>
      </Card>

      <Card>
        <Card.Header>Dashboard</Card.Header>

        <Card.Body>
          <Input label="Email" placeholder="Enter email" />

          <Button>Save</Button>
        </Card.Body>
      </Card>

      <Button onClick={() => setOpen(true)}>Open Modal</Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2>Create User</h2>

        <Input label="Name" placeholder="Enter name" />

        <Button>Save</Button>
      </Modal>
    </>
  );
}
