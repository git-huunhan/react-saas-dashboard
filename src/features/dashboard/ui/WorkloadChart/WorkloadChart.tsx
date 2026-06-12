import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WorkloadData } from "@/features/dashboard";

import "./WorkloadChart.css";

interface WorkloadChartProps {
  data: WorkloadData[];
  isLoading?: boolean;
}

export function WorkloadChart({ data, isLoading }: WorkloadChartProps) {
  if (isLoading) {
    return (
      <div className="chart-card">
        <div className="skeleton skeleton--title" style={{ width: "160px" }} />
        <div className="skeleton skeleton--chart" />
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">Workload by Assignee</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f3f4f6"
            vertical={false}
          />
          <XAxis
            dataKey="name"
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
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          <Bar
            dataKey="tasks"
            name="Active Tasks"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
