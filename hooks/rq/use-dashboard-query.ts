import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { httpV1 } from "@/lib/xior"
import type { DashboardResponse } from "@/types/dashboard"

export function getDashboardDataOptions() {
  return queryOptions({
    queryKey: ["dashboard"],
    queryFn: () =>
      httpV1
        .request<DashboardResponse>({
          method: "GET",
          url: "/dashboard",
        })
        .then((res) => res.data),
  })
}

export function useGetDashboardData() {
  return useQuery(getDashboardDataOptions())
}

export function useSuspenseGetDashboardData() {
  return useSuspenseQuery(getDashboardDataOptions())
}
