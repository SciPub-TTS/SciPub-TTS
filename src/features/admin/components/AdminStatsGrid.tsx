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
    const latestUsagePoint = getLatestUsagePoint(apiUsageOverTime);
    const apiCallsUsedValue = getSummaryValue(
        totalApiCalls,
        isApiUsageOverTimeLoading,
        isApiUsageOverTimeError,
    );
    const apiCallsTodayValue = getSummaryValue(
        latestUsagePoint?.callCount,
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
            label: "API Calls Today",
            value: apiCallsTodayValue,
            description: latestUsagePoint
                ? formatUsageDate(latestUsagePoint.date)
                : "Today",
            accent: isApiUsageOverTimeError ? undefined : "Latest reported day",
            tone: "purple",
            icon: CalendarDays,
        },
        {
            label: "Total API Credit",
            value: "100,000",
            description: "Daily usage",
            accent: "All",
            tone: "purple",
            icon: WalletCards,
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
        {
            label: "Last Synchronization",
            value: "Today, 09:30 AM",
            description: "Latest data update",
            tone: "teal",
            icon: RefreshCw,
        },
    ];
}

function getLatestUsagePoint(points: AdminApiUsagePoint[]) {
    return points.reduce<AdminApiUsagePoint | null>((latest, item) => {
        if (!latest) return item;

        return new Date(item.date).getTime() > new Date(latest.date).getTime()
            ? item
            : latest;
    }, null);
}

function formatUsageDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Today";

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
    }).format(date);
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