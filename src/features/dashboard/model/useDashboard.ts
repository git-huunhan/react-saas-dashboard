import { useQuery } from "@tanstack/react-query";

import {
  getDashboardStats,
  getRevenueChart,
  getTrafficSources,
  getUserGrowth,
} from "@/shared/api/dashboardApi";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenueChart: () => [...dashboardKeys.all, "revenueChart"] as const,
  userGrowth: () => [...dashboardKeys.all, "userGrowth"] as const,
  traffic: () => [...dashboardKeys.all, "traffic"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  });
}

export function useRevenueChart() {
  return useQuery({
    queryKey: dashboardKeys.revenueChart(),
    queryFn: getRevenueChart,
  });
}

export function useUserGrowth() {
  return useQuery({
    queryKey: dashboardKeys.userGrowth(),
    queryFn: getUserGrowth,
  });
}

export function useTrafficSources() {
  return useQuery({
    queryKey: dashboardKeys.traffic(),
    queryFn: getTrafficSources,
  });
}
