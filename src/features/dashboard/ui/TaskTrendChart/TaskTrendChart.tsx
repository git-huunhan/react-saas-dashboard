import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TaskTrendPoint } from "@/features/dashboard";

import "./TaskTrendChart.css";

interface TaskTrendChartProps {
  data: TaskTrendPoint[];
  isLoading?: boolean;
}

export function TaskTrendChart({ data, isLoading }: TaskTrendChartProps) {
  if (isLoading) {
    return (
      <div className="chart-card">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--chart" />
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Tasks Created vs Completed</h3>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />

          <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} />

          <Area
            type="monotone"
            dataKey="created"
            name="Tasks Created"
            stroke="#6b7280" /* Xám */
            strokeWidth={2}
            fill="url(#gradCreated)"
            dot={false}
            activeDot={{ r: 4 }}
          />

          <Area
            type="monotone"
            dataKey="completed"
            name="Tasks Completed"
            stroke="#10b981" /* Xanh lá */
            strokeWidth={2}
            fill="url(#gradCompleted)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
