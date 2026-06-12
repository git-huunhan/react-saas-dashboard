import {
  StatsCard,
  TaskStatusChart,
  TaskTrendChart,
  useDashboardStats,
  useTaskTrend,
  useTasksByStatus,
} from "@/features/dashboard";

import "./DashboardPage.css";

export default function DashboardPage() {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useDashboardStats();

  const { data: trendData, isLoading: isTrendLoading } = useTaskTrend();
  const { data: statusData, isLoading: isStatusLoading } = useTasksByStatus();

  if (isStatsError)
    return <p className="dashboard__error">Failed to load dashboard data.</p>;

  const formatNumber = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        <StatsCard
          title="Total Projects"
          value={isStatsLoading ? "" : formatNumber(statsData!.totalProjects)}
          icon="📁"
        />
        <StatsCard
          title="Active Tasks"
          value={isStatsLoading ? "" : formatNumber(statsData!.activeTasks)}
          icon="⚡"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Completed Tasks"
          value={isStatsLoading ? "" : formatNumber(statsData!.completedTasks)}
          icon="✅"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Overdue Tasks"
          value={isStatsLoading ? "" : formatNumber(statsData!.overdueTasks)}
          icon="⚠️"
          trend={{ value: 2.4, isPositive: false }}
        />
      </div>

      <div className="dashboard__charts">
        <TaskTrendChart data={trendData ?? []} isLoading={isTrendLoading} />
        <TaskStatusChart data={statusData ?? []} isLoading={isStatusLoading} />
      </div>
    </div>
  );
}
