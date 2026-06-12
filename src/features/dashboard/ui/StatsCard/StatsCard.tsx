import "./StatsCard.css";

interface Trend {
  value: number;
  isPositive: boolean;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: Trend;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="stats-card">
        <div className="stats-card__header">
          <span className="skeleton skeleton--text" style={{ width: "60%" }} />
          <span className="skeleton skeleton--icon" />
        </div>
        <span className="skeleton skeleton--value" />
        <span className="skeleton skeleton--text" style={{ width: "80%" }} />
      </div>
    );
  }

  return (
    <div className="stats-card">
      <div className="stats-card__header">
        <span className="stats-card__title">{title}</span>
        <span className="stats-card__icon">{icon}</span>
      </div>

      <div className="stats-card__value">{value}</div>

      {trend && (
        <div
          className={`stats-card__trend ${
            trend.isPositive
              ? "stats-card__trend--up"
              : "stats-card__trend--down"
          }`}
        >
          <span>{trend.isPositive ? "↑" : "↓"}</span>
          <span>{Math.abs(trend.value)}% vs last month</span>
        </div>
      )}
    </div>
  );
}
