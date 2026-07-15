import type {
  AdminDashboardMetric,
  AdminDashboardStatistics,
} from "../types";
import AdminStatCard, { type AdminStatCardProps } from "./AdminStatCard";

type AdminStatsGridProps = {
  dashboardStatistics?: AdminDashboardStatistics;
  isDashboardStatisticsError: boolean;
  isDashboardStatisticsLoading: boolean;
};

function getSummaryValue(
  metric: AdminDashboardMetric,
  isLoading: boolean,
  isError: boolean,
) {
  const value = getMetricValue(metric);

  if (isLoading) return "...";
  if (isError || value === undefined) return "Unavailable";

  return new Intl.NumberFormat("en").format(value);
}

function getMetricValue(metric: AdminDashboardMetric) {
  if (typeof metric === "number") return metric;

  return metric?.value;
}

function buildAdminStats({
  dashboardStatistics,
  isDashboardStatisticsError,
  isDashboardStatisticsLoading,
}: AdminStatsGridProps): AdminStatCardProps[] {
  const totalUsersValue = getSummaryValue(
    dashboardStatistics?.totalUsers,
    isDashboardStatisticsLoading,
    isDashboardStatisticsError,
  );
  const bannedUsersValue = getSummaryValue(
    dashboardStatistics?.bannedUser,
    isDashboardStatisticsLoading,
    isDashboardStatisticsError,
  );
  const totalTrendingTopicValue = getSummaryValue(
    dashboardStatistics?.totalTopicTrend,
    isDashboardStatisticsLoading,
    isDashboardStatisticsError,
  );
  const totalTrendingKeywordValue = getSummaryValue(
    dashboardStatistics?.totalKeywordTrend,
    isDashboardStatisticsLoading,
    isDashboardStatisticsError,
  );
  const totalTopicsValue = getSummaryValue(
    dashboardStatistics?.totalTopics,
    isDashboardStatisticsLoading,
    isDashboardStatisticsError,
  );
  const totalSubfieldsValue = getSummaryValue(
    dashboardStatistics?.totalSubfields,
    isDashboardStatisticsLoading,
    isDashboardStatisticsError,
  );

  return [
    {
      label: "Total Users",
      value: totalUsersValue,
      tone: "blue",
    },
    {
      label: "Banned Users",
      value: bannedUsersValue,
      tone: "red",
    },
    {
      label: "Total Trending Topic",
      value: totalTrendingTopicValue,
      tone: "indigo",
    },
    {
      label: "Total Trending Keyword",
      value: totalTrendingKeywordValue,
      tone: "purple",
    },
    {
      label: "Total Topics",
      value: totalTopicsValue,
      tone: "amber",
    },
    {
      label: "Total Subfields",
      value: totalSubfieldsValue,
      tone: "green",
    },
  ];
}

export default function AdminStatsGrid(props: AdminStatsGridProps) {
  const adminStats = buildAdminStats(props);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {adminStats.map((stat) => (
        <AdminStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
