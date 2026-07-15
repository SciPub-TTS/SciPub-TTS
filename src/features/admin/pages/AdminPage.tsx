import AdminDashboardInsights from "../components/AdminDashboardInsights";
import AdminStatsGrid from "../components/AdminStatsGrid";
import { useAdminDashboardData } from "../hooks";

export default function AdminPage() {
  const dashboardData = useAdminDashboardData();

  return (
    <section className="space-y-5">
      <AdminStatsGrid
        dashboardStatistics={dashboardData.dashboardStatistics}
        isDashboardStatisticsError={dashboardData.isDashboardStatisticsError}
        isDashboardStatisticsLoading={dashboardData.isDashboardStatisticsLoading}
      />
      <AdminDashboardInsights
        apiUsageOverTime={dashboardData.apiUsageOverTime}
        isApiUsageOverTimeError={dashboardData.isApiUsageOverTimeError}
        isApiUsageOverTimeLoading={dashboardData.isApiUsageOverTimeLoading}
        isTopApiConsumersError={dashboardData.isTopApiConsumersError}
        isTopApiConsumersLoading={dashboardData.isTopApiConsumersLoading}
        topApiConsumers={dashboardData.topApiConsumers}
      />
    </section>
  );
}
