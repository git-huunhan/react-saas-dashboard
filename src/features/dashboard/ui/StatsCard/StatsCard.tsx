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
      <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="h-4 w-24 bg-zinc-100 animate-pulse rounded" />
          <span className="h-6 w-6 bg-zinc-100 animate-pulse rounded" />
        </div>
        <div className="text-2xl font-bold text-zinc-900 mt-2">
          <span className="animate-pulse bg-zinc-200 h-8 w-16 rounded block" />
        </div>
        <div className="h-4 w-32 bg-zinc-100 animate-pulse rounded mt-1" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 tracking-tight">
          {title}
        </span>
        <span className="text-xl">{icon}</span>
      </div>

      <div className="text-2xl font-bold text-zinc-900 mt-2">
        {isLoading ? (
          <span className="animate-pulse bg-zinc-200 h-8 w-16 rounded block" />
        ) : (
          value
        )}
      </div>

      {trend && (
        <div
          className={`flex items-center text-xs font-medium mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
        >
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          <span className="text-zinc-500 font-normal ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}
