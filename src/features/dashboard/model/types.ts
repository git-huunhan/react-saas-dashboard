export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
}

export interface RevenueChartPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface UserGrowthPoint {
  month: string;
  users: number;
}

export interface TrafficSource {
  name: string;
  value: number;
}
