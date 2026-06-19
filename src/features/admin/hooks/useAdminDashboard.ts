import { useQueries } from "@tanstack/react-query";

import { adminDashboardApi } from "@/features/admin/services";

const adminDashboardQueryKeys = {
  apiUsageOverTime: ["adminDashboard", "apiUsageOverTime"] as const,
  banSummary: ["adminDashboard", "banSummary"] as const,
  statistics: ["adminDashboard", "statistics"] as const,
  topApiConsumers: ["adminDashboard", "topApiConsumers"] as const,
};

export function useAdminDashboard() {
  const [statisticsQuery, banSummaryQuery, apiUsageQuery, topConsumersQuery] =
    useQueries({
      queries: [
        {
          queryFn: () =>
            adminDashboardApi
              .getStatistics()
              .then((response) => response.data),
          queryKey: adminDashboardQueryKeys.statistics,
        },
        {
          queryFn: () =>
            adminDashboardApi
              .getBanSummary()
              .then((response) => response.data),
          queryKey: adminDashboardQueryKeys.banSummary,
        },
        {
          queryFn: () =>
            adminDashboardApi
              .getApiUsageOverTime()
              .then((response) => response.data),
          queryKey: adminDashboardQueryKeys.apiUsageOverTime,
        },
        {
          queryFn: () =>
            adminDashboardApi
              .getTopApiConsumers()
              .then((response) => response.data),
          queryKey: adminDashboardQueryKeys.topApiConsumers,
        },
      ],
    });

  return {
    apiUsageQuery,
    banSummaryQuery,
    statisticsQuery,
    topConsumersQuery,
  };
}
