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

interface WorkloadChartProps {
  data: WorkloadData[];
  isLoading?: boolean;
}

export function WorkloadChart({ data, isLoading }: WorkloadChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6 h-[400px] flex flex-col">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200 mb-4" />
        <div className="flex-1 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow bg-white p-6 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
        Team Workload
      </h3>

      <ResponsiveContainer width="100%" height={320}>
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
