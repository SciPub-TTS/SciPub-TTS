import AdminDashboardInsights from "../components/AdminDashboardInsights";
import AdminStatsGrid from "../components/AdminStatsGrid";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

export default function AdminPage() {
  const {
    apiUsageQuery,
    banSummaryQuery,
    statisticsQuery,
    topConsumersQuery,
  } = useAdminDashboard();

  return (
    <section className="space-y-5">
      <AdminStatsGrid statisticsQuery={statisticsQuery} />
      <AdminDashboardInsights
        apiUsageQuery={apiUsageQuery}
        banSummaryQuery={banSummaryQuery}
        statistics={statisticsQuery.data ?? null}
        topConsumersQuery={topConsumersQuery}
      />
    </section>
  );
}
