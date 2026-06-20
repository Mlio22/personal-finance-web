"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/features/dashboard/api/get-dashboard-summary";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
    retry: false,
  });
}
