import "./Header.css";

import Input from "@/shared/ui/Input";

export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <h2>React SaaS Dashboard</h2>
      </div>

      <div className="header__center">
        <Input placeholder="Search..." />
      </div>

      <div className="header__right">
        <span>Stephen</span>
      </div>
    </header>
  );
}
