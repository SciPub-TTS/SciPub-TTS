import {
  Activity,
  CalendarDays,
  Layers,
  RefreshCw,
  Tags,
  TrendingUp,
  UserRoundX,
  Users,
  WalletCards,
} from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

import type { AdminDashboardStatisticsResponse } from "@/features/admin/types";

import AdminStatCard, {
  type AdminStatCardProps,
  type AdminStatCardTone,
} from "./AdminStatCard";

type AdminStatsGridProps = {
  statisticsQuery: UseQueryResult<AdminDashboardStatisticsResponse, Error>;
};

const numberFormatter = new Intl.NumberFormat("en");

function formatNumber(value: number | null | undefined) {
  return numberFormatter.format(value ?? 0);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "No sync yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildStatCards(
  statistics: AdminDashboardStatisticsResponse,
): AdminStatCardProps[] {
  return [
    {
      label: "Total Users",
      value: formatNumber(statistics.totalUsers.value),
      description: statistics.totalUsers.description,
      accent: statistics.totalUsers.delta ?? undefined,
      tone: "blue",
      icon: Users,
    },
    {
      label: "Active Trends",
      value: formatNumber(statistics.activeTrends.value),
      description: statistics.activeTrends.description,
      accent: statistics.activeTrends.delta ?? undefined,
      tone: "amber",
      icon: TrendingUp,
    },
    {
      label: "Banned Users",
      value: formatNumber(statistics.bannedUsers.value),
      description: statistics.bannedUsers.description,
      accent: statistics.bannedUsers.delta ?? undefined,
      tone: "red",
      icon: UserRoundX,
    },
    {
      label: "API Calls Used",
      value: formatNumber(statistics.apiCallsUsed.value),
      description: statistics.apiCallsUsed.description,
      accent: statistics.apiCallsUsed.delta ?? undefined,
      tone: "indigo",
      icon: Activity,
    },
    {
      label: "API Calls Today",
      value: formatNumber(statistics.apiCallsToday.value),
      description: statistics.apiCallsToday.description,
      accent: statistics.apiCallsToday.delta ?? undefined,
      tone: "purple",
      icon: CalendarDays,
    },
    {
      label: "Total API Credit",
      value: formatNumber(statistics.totalApiCredit.value),
      description: statistics.totalApiCredit.description,
      accent: statistics.totalApiCredit.delta ?? undefined,
      tone: "purple",
      icon: WalletCards,
    },
    {
      label: "Total Subfields",
      value: formatNumber(statistics.totalSubfields.value),
      description: statistics.totalSubfields.description,
      accent: statistics.totalSubfields.delta ?? undefined,
      tone: "green",
      icon: Layers,
    },
    {
      label: "Total Topics",
      value: formatNumber(statistics.totalTopics.value),
      description: statistics.totalTopics.description,
      accent: statistics.totalTopics.delta ?? undefined,
      tone: "emerald",
      icon: Tags,
    },
    {
      label: "Last Synchronization",
      value: formatDateTime(statistics.lastSynchronization.value),
      description: statistics.lastSynchronization.description,
      accent: statistics.lastSynchronization.delta ?? undefined,
      tone: "teal",
      icon: RefreshCw,
    },
  ];
}

function StatCardPlaceholder({ tone }: { tone: AdminStatCardTone }) {
  const toneClassMap: Record<AdminStatCardTone, string> = {
    amber: "border-amber-200 bg-amber-50",
    blue: "border-blue-200 bg-blue-50",
    emerald: "border-emerald-200 bg-emerald-50",
    green: "border-green-200 bg-green-50",
    indigo: "border-indigo-200 bg-indigo-50",
    purple: "border-purple-200 bg-purple-50",
    red: "border-red-200 bg-red-50",
    teal: "border-teal-200 bg-teal-50",
  };

  return (
    <article
      className={[
        "min-h-36 rounded-xl border p-4 shadow-sm",
        toneClassMap[tone],
      ].join(" ")}
    >
      <div className="h-3 w-28 rounded bg-white/70" />
      <div className="mt-8 h-7 w-24 rounded bg-white/70" />
      <div className="mt-3 h-3 w-36 rounded bg-white/70" />
      <div className="mt-3 h-3 w-24 rounded bg-white/70" />
    </article>
  );
}

export default function AdminStatsGrid({
  statisticsQuery,
}: AdminStatsGridProps) {
  if (statisticsQuery.isPending) {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(
          [
            "blue",
            "amber",
            "red",
            "indigo",
            "purple",
            "purple",
            "green",
            "emerald",
            "teal",
          ] as AdminStatCardTone[]
        ).map((tone, index) => (
          <StatCardPlaceholder key={`${tone}-${index}`} tone={tone} />
        ))}
      </div>
    );
  }

  if (statisticsQuery.isError || !statisticsQuery.data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
        Cannot load dashboard statistics.
      </div>
    );
  }

  const adminStats = buildStatCards(statisticsQuery.data);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {adminStats.map((stat) => (
        <AdminStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
