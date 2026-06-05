import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";

export default function DashboardPage() {
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
    </>
  );
}
