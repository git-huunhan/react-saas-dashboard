import "./Header.css";

import { useAuth } from "@/features/auth";
import Input from "@/shared/ui/Input";

export default function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__left">
        <h2>React SaaS Dashboard</h2>
      </div>

      <div className="header__center">
        <Input placeholder="Search..." />
      </div>

      <div className="header__right">
        <div className="header__right">
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={login}>Login</button>
          )}
        </div>
      </div>
    </header>
  );
}
