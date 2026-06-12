import { StatsCard, useDashboardStats } from "@/features/dashboard";

import "./DashboardPage.css";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError)
    return <p className="dashboard__error">Failed to load dashboard data.</p>;

  const formatNumber = (n: number) => n.toLocaleString("en-US");
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="dashboard">
      {/* Stats Grid */}
      <div className="dashboard__stats">
        <StatsCard
          title="Total Users"
          value={isLoading ? "" : formatNumber(data!.totalUsers)}
          icon="👥"
          trend={{ value: 5.2, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Users"
          value={isLoading ? "" : formatNumber(data!.activeUsers)}
          icon="⚡"
          trend={{ value: 2.1, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="New This Month"
          value={isLoading ? "" : formatNumber(data!.newUsersThisMonth)}
          icon="🆕"
          trend={{ value: 8.4, isPositive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Revenue"
          value={isLoading ? "" : formatCurrency(data!.revenueThisMonth)}
          icon="💰"
          trend={{ value: 1.3, isPositive: false }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
