import {
  Activity,
  Layers,
  Tags,
  TrendingUp,
  UserRoundX,
  Users,
} from "lucide-react";

import type { AdminApiUsagePoint, AdminUserBanSummary } from "../types";
import AdminStatCard, { type AdminStatCardProps } from "./AdminStatCard";

type AdminStatsGridProps = {
  apiUsageOverTime: AdminApiUsagePoint[];
  banSummary?: AdminUserBanSummary;
  isApiUsageOverTimeError: boolean;
  isApiUsageOverTimeLoading: boolean;
  isBanSummaryError: boolean;
  isBanSummaryLoading: boolean;
};

function getSummaryValue(
  value: number | undefined,
  isLoading: boolean,
  isError: boolean,
) {
  if (isLoading) return "...";
  if (isError || value === undefined) return "Unavailable";

  return new Intl.NumberFormat("en").format(value);
}

function buildAdminStats({
  apiUsageOverTime,
  banSummary,
  isApiUsageOverTimeError,
  isApiUsageOverTimeLoading,
  isBanSummaryError,
  isBanSummaryLoading,
}: AdminStatsGridProps): AdminStatCardProps[] {
  const totalUsersValue = getSummaryValue(
    banSummary?.total,
    isBanSummaryLoading,
    isBanSummaryError,
  );
  const bannedUsersValue = getSummaryValue(
    banSummary?.banned,
    isBanSummaryLoading,
    isBanSummaryError,
  );
  const totalApiCalls = apiUsageOverTime.reduce(
    (total, item) => total + Math.max(0, item.callCount),
    0,
  );
  const apiCallsUsedValue = getSummaryValue(
    totalApiCalls,
    isApiUsageOverTimeLoading,
    isApiUsageOverTimeError,
  );

  return [
  {
    label: "Total Users",
    value: totalUsersValue,
    description: "Registered accounts",
    accent: banSummary ? `${banSummary.active} active accounts` : undefined,
    tone: "blue",
    icon: Users,
  },
  {
    label: "Active Trends",
    value: "42",
    description: "Detected trend signals",
    accent: "+5 this week",
    tone: "amber",
    icon: TrendingUp,
  },
  {
    label: "Banned Users",
    value: bannedUsersValue,
    description: "Restricted accounts",
    accent: banSummary
      ? `${banSummary.bannedPercentage}% of accounts`
      : undefined,
    tone: "red",
    icon: UserRoundX,
  },
  {
    label: "API Calls Used",
    value: apiCallsUsedValue,
    description: "Last 7 days",
    accent: isApiUsageOverTimeError
      ? undefined
      : `${apiUsageOverTime.length} tracked days`,
    tone: "indigo",
    icon: Activity,
  },
  {
    label: "Total Subfields",
    value: "12",
    description: "Research subfields",
    tone: "green",
    icon: Layers,
  },
  {
    label: "Total Topics",
    value: "186",
    description: "Generated from 12 fields",
    accent: "+18 after last sync",
    tone: "emerald",
    icon: Tags,
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
