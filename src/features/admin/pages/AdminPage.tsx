import AdminDashboardInsights from "../components/AdminDashboardInsights";
import AdminStatsGrid from "../components/AdminStatsGrid";
import { useAdminDashboardData } from "../hooks";

export default function AdminPage() {
  const dashboardData = useAdminDashboardData();

  return (
    <section className="space-y-5">
      <AdminStatsGrid
        apiUsageOverTime={dashboardData.apiUsageOverTime}
        banSummary={dashboardData.banSummary}
        isApiUsageOverTimeError={dashboardData.isApiUsageOverTimeError}
        isApiUsageOverTimeLoading={dashboardData.isApiUsageOverTimeLoading}
        isBanSummaryError={dashboardData.isBanSummaryError}
        isBanSummaryLoading={dashboardData.isBanSummaryLoading}
      />
      <AdminDashboardInsights
        apiUsageOverTime={dashboardData.apiUsageOverTime}
        banSummary={dashboardData.banSummary}
        isApiUsageOverTimeError={dashboardData.isApiUsageOverTimeError}
        isApiUsageOverTimeLoading={dashboardData.isApiUsageOverTimeLoading}
        isBanSummaryError={dashboardData.isBanSummaryError}
        isBanSummaryLoading={dashboardData.isBanSummaryLoading}
        isTopApiConsumersError={dashboardData.isTopApiConsumersError}
        isTopApiConsumersLoading={dashboardData.isTopApiConsumersLoading}
        topApiConsumers={dashboardData.topApiConsumers}
      />
    </section>
  );
}
