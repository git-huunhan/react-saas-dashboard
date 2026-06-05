import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        borderRight: "1px solid #ddd",
        padding: "16px",
      }}
    >
      <h2>SaaS Dashboard</h2>

      <nav>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>

          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
