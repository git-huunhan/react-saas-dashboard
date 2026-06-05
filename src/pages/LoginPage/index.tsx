import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/model/useAuth";

import Button from "@/shared/ui/Button/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();

    navigate("/");
  };

  return (
    <div>
      <h1>Login</h1>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}
