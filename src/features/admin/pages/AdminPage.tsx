import AdminDashboardInsights from "../components/AdminDashboardInsights";
import AdminStatsGrid from "../components/AdminStatsGrid";

export default function AdminPage() {
  return (
    <section className="space-y-5">
      <AdminStatsGrid />
      <AdminDashboardInsights />
    </section>
  );
}
