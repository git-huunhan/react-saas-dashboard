import { useState } from "react";

import { StatsCard, useDashboardStats } from "@/features/dashboard";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useDashboardStats();
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      {/* Test skeleton */}
      <StatsCard title="" value="" icon="" isLoading />
      {/* Test data thật */}
      <StatsCard
        title="Total Users"
        value="8,472"
        icon="👥"
        trend={{ value: 5.2, isPositive: true }}
      />
      <StatsCard
        title="Revenue"
        value="$54,320"
        icon="💰"
        trend={{ value: 1.3, isPositive: false }}
      />
      <StatsCard title="Active Users" value="3,291" icon="⚡" />
    </div>
  );
}
