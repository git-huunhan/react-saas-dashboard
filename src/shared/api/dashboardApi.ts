import type {
  DashboardStats,
  RevenueChartPoint,
  TrafficSource,
  UserGrowthPoint,
} from "@/features/dashboard";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(600);

  return {
    totalUsers: 8472,
    activeUsers: 3291,
    newUsersThisMonth: 342,
    revenueThisMonth: 54320,
  };
}

export async function getRevenueChart(): Promise<RevenueChartPoint[]> {
  await delay(800);

  return [
    { month: "Jan", revenue: 42000, expenses: 28000 },
    { month: "Feb", revenue: 48000, expenses: 31000 },
    { month: "Mar", revenue: 45000, expenses: 27000 },
    { month: "Apr", revenue: 53000, expenses: 34000 },
    { month: "May", revenue: 58000, expenses: 36000 },
    { month: "Jun", revenue: 54320, expenses: 33000 },
  ];
}

export async function getUserGrowth(): Promise<UserGrowthPoint[]> {
  await delay(700);

  return [
    { month: "Jan", users: 6800 },
    { month: "Feb", users: 7100 },
    { month: "Mar", users: 7400 },
    { month: "Apr", users: 7800 },
    { month: "May", users: 8100 },
    { month: "Jun", users: 8472 },
  ];
}

export async function getTrafficSources(): Promise<TrafficSource[]> {
  await delay(500);

  return [
    { name: "Organic", value: 45 },
    { name: "Direct", value: 25 },
    { name: "Social", value: 20 },
    { name: "Referral", value: 10 },
  ];
}
