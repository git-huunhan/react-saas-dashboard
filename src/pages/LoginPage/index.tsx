import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ id: "1", name: "Admin User", role: "admin" });

    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Button onClick={handleLogin} className="w-full max-w-xs">
        Login
      </Button>
    </div>
  );
}
