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

import AdminStatCard, { type AdminStatCardProps } from "./AdminStatCard";

const adminStats: AdminStatCardProps[] = [
  {
    label: "Total Users",
    value: "128",
    description: "Registered accounts",
    accent: "+6 this week",
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
    value: "16",
    description: "Restricted accounts",
    accent: "+2 this month",
    tone: "red",
    icon: UserRoundX,
  },
  {
    label: "API Calls Used",
    value: "24,580",
    description: "This month",
    accent: "+12% vs last month",
    tone: "indigo",
    icon: Activity,
  },
  {
    label: "API Calls Today",
    value: "1,240",
    description: "Today",
    accent: "Within daily quota",
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

export default function AdminStatsGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {adminStats.map((stat) => (
        <AdminStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
