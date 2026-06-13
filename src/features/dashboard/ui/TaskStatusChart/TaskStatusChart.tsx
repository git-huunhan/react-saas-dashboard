import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { TaskStatusData } from "@/features/dashboard";

const COLORS = {
  "To Do": "#9ca3af",
  "In Progress": "#3b82f6",
  "In Review": "#f59e0b",
  Done: "#10b981",
};

interface TaskStatusChartProps {
  data: TaskStatusData[];
  isLoading?: boolean;
}

export function TaskStatusChart({ data, isLoading }: TaskStatusChartProps) {
  if (isLoading) {
    return (
      <div className="chart-card">
        <div className="skeleton skeleton--title" style={{ width: "120px" }} />
        <div
          className="skeleton skeleton--chart"
          style={{ borderRadius: "50%" }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6 h-[360px] flex flex-col">
      <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
        Tasks by Status
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name as keyof typeof COLORS] || "#cbd5e1"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "13px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
