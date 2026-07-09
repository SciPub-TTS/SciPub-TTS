import type { ReactNode } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AdminApiUsagePoint,
  AdminTopApiConsumer,
  AdminUserBanSummary,
} from "../types";

type AdminDashboardInsightsProps = {
  apiUsageOverTime: AdminApiUsagePoint[];
  banSummary?: AdminUserBanSummary;
  isApiUsageOverTimeError: boolean;
  isApiUsageOverTimeLoading: boolean;
  isBanSummaryError: boolean;
  isBanSummaryLoading: boolean;
  isTopApiConsumersError: boolean;
  isTopApiConsumersLoading: boolean;
  topApiConsumers: AdminTopApiConsumer[];
};

type TooltipPayloadItem = {
  color?: string;
  name?: string;
  payload?: Record<string, string | number>;
  value?: number | string;
};

type CustomTooltipProps = {
  active?: boolean;
  label?: number | string;
  payload?: TooltipPayloadItem[];
};

function ChartCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={[
        "rounded-xl border border-black bg-white p-5 shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </article>
  );
}

function SectionTitle({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) {
  return (
    <div>
      <h3 className="font-title text-sm font-bold text-slate-950">{title}</h3>
      <p className="font-subtext mt-1 text-xs font-medium text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

export default function AdminDashboardInsights({
  apiUsageOverTime,
  banSummary,
  isApiUsageOverTimeError,
  isApiUsageOverTimeLoading,
  isBanSummaryError,
  isBanSummaryLoading,
  isTopApiConsumersError,
  isTopApiConsumersLoading,
  topApiConsumers,
}: AdminDashboardInsightsProps) {
  const activeCount = formatSummaryNumber(banSummary?.active);
  const bannedCount = formatSummaryNumber(banSummary?.banned);
  const sortedUsage = sortUsagePoints(apiUsageOverTime);
  const peakUsage = getPeakUsagePoint(sortedUsage);
  const totalUsage = sortedUsage.reduce(
    (total, item) => total + Math.max(0, item.callCount),
    0,
  );

  const consumerChartData = topApiConsumers.map((consumer) => ({
    ...consumer,
    shortEmail: shortenEmail(consumer.email),
  }));

  const accountStatusChartData = [
    {
      label: "Active",
      value: Math.max(0, banSummary?.active ?? 0),
      color: "#16a34a",
    },
    {
      label: "Banned",
      value: Math.max(0, banSummary?.banned ?? 0),
      color: "#ef4444",
    },
  ];

  const taxonomyChartData = [
    { label: "Fields", value: 12, fill: "#16a34a" },
    { label: "Topics", value: 186, fill: "#2563eb" },
    { label: "Trends", value: 42, fill: "#f59e0b" },
  ];

  const usageChartData = sortedUsage.map((item) => ({
    ...item,
    day: formatWeekday(item.date),
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <ChartCard>
        <SectionTitle
          title="API Calls by User"
          subtitle="Top 5 consumers this month"
        />

        <div className="mt-5">
          {isTopApiConsumersLoading && (
            <p className="font-subtext text-sm font-medium text-slate-500">
              Loading API consumers...
            </p>
          )}
          {!isTopApiConsumersLoading && isTopApiConsumersError && (
            <p className="font-subtext text-sm font-semibold text-red-600">
              Cannot load API consumers right now.
            </p>
          )}
          {!isTopApiConsumersLoading &&
            !isTopApiConsumersError &&
            topApiConsumers.length === 0 && (
              <p className="font-subtext text-sm font-medium text-slate-500">
                No API usage found.
              </p>
            )}
          {!isTopApiConsumersLoading &&
            !isTopApiConsumersError &&
            topApiConsumers.length > 0 && (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={consumerChartData}
                    layout="vertical"
                    margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
                    barCategoryGap={18}
                  >
                    <defs>
                      <linearGradient
                        id="adminConsumerGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#1d4ed8" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="#d4d4d8"
                      strokeDasharray="4 6"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tickFormatter={formatSummaryNumber}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="shortEmail"
                      type="category"
                      width={150}
                      tick={{ fill: "#0f172a", fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<ConsumerTooltip />} cursor={false} />
                    <Bar
                      dataKey="callCount"
                      fill="url(#adminConsumerGradient)"
                      radius={[0, 10, 10, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
        </div>
      </ChartCard>

      <ChartCard>
        <SectionTitle title="User Account Status" subtitle="Active vs Banned" />

        <div className="mt-5">
          {isBanSummaryLoading && (
            <p className="font-subtext text-xs font-medium text-slate-500">
              Loading account status...
            </p>
          )}
          {!isBanSummaryLoading && isBanSummaryError && (
            <p className="font-subtext text-xs font-semibold text-red-600">
              Cannot load account status right now.
            </p>
          )}
          {!isBanSummaryLoading && !isBanSummaryError && (
            <div className="flex flex-col items-center gap-5 sm:flex-row xl:flex-col 2xl:flex-row">
              <div className="h-40 w-full max-w-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accountStatusChartData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={46}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {accountStatusChartData.map((item) => (
                        <Cell
                          key={item.label}
                          fill={item.color}
                          stroke="#111111"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<AccountStatusTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-3 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-subtext flex items-center gap-2 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    Active
                  </span>
                  <strong className="text-slate-950">{activeCount}</strong>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-black pb-3">
                  <span className="font-subtext flex items-center gap-2 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Banned
                  </span>
                  <strong className="text-slate-950">{bannedCount}</strong>
                </div>
                <p className="font-subtext text-xs font-medium text-slate-500">
                  Active rate: {clampPercentage(banSummary?.activePercentage ?? 0)}
                  %
                </p>
              </div>
            </div>
          )}
        </div>
      </ChartCard>

      <ChartCard>
        <SectionTitle
          title="Fields -> Topics -> Trends"
          subtitle="Fields define the research scope. Topics are generated from fields. Trends are calculated from topic and keyword activity"
        />

        <div className="mt-7 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <FlowMetric
            label="Fields"
            value="12"
            description="Research fields"
            tone="green"
          />
          <span className="font-subtext hidden text-xl font-medium text-slate-400 md:block">
            -&gt;
          </span>
          <FlowMetric
            label="Topics"
            value="186"
            description="From 12 fields"
            tone="blue"
          />
          <span className="font-subtext hidden text-xl font-medium text-slate-400 md:block">
            -&gt;
          </span>
          <FlowMetric
            label="Trends"
            value="42"
            description="Active signals"
            tone="amber"
          />
        </div>

        <div className="mt-6 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={taxonomyChartData}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <CartesianGrid
                stroke="#d4d4d8"
                strokeDasharray="4 6"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<TaxonomyTooltip />} cursor={false} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {taxonomyChartData.map((item) => (
                  <Cell key={item.label} fill={item.fill} stroke="#111111" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard>
        <SectionTitle title="API Usage Over Time" subtitle="Last 7 days" />

        <div className="mt-5">
          {isApiUsageOverTimeLoading && (
            <p className="font-subtext text-sm font-medium text-slate-500">
              Loading API usage...
            </p>
          )}
          {!isApiUsageOverTimeLoading && isApiUsageOverTimeError && (
            <p className="font-subtext text-sm font-semibold text-red-600">
              Cannot load API usage right now.
            </p>
          )}
          {!isApiUsageOverTimeLoading &&
            !isApiUsageOverTimeError &&
            sortedUsage.length === 0 && (
              <p className="font-subtext text-sm font-medium text-slate-500">
                No API usage found.
              </p>
            )}
          {!isApiUsageOverTimeLoading &&
            !isApiUsageOverTimeError &&
            sortedUsage.length > 0 && (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={usageChartData}
                    margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="adminUsageGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="#d4d4d8"
                      strokeDasharray="4 6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={formatSummaryNumber}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<UsageTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="callCount"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fill="url(#adminUsageGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
        </div>

        <div className="font-subtext mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
          <span>
            Peak:{" "}
            {peakUsage
              ? `${formatWeekday(peakUsage.date)} - ${formatSummaryNumber(peakUsage.callCount)} calls`
              : "Unavailable"}
          </span>
          <span>Total: {formatSummaryNumber(totalUsage)}</span>
        </div>
      </ChartCard>
    </div>
  );
}

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) return 0;

  return Math.min(100, Math.max(0, value));
}

function formatSummaryNumber(value: number | undefined) {
  if (value === undefined) return "Unavailable";

  return new Intl.NumberFormat("en").format(value);
}

function sortUsagePoints(points: AdminApiUsagePoint[]) {
  return [...points].sort(
    (left, right) =>
      new Date(left.date).getTime() - new Date(right.date).getTime(),
  );
}

function getPeakUsagePoint(points: AdminApiUsagePoint[]) {
  return points.reduce<AdminApiUsagePoint | null>((peak, item) => {
    if (!peak || item.callCount > peak.callCount) {
      return item;
    }

    return peak;
  }, null);
}

function formatWeekday(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
}

function shortenEmail(email: string) {
  if (email.length <= 24) {
    return email;
  }

  return `${email.slice(0, 10)}...${email.slice(-10)}`;
}

function CustomTooltipShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black bg-white px-3 py-2 shadow-sm">
      {children}
    </div>
  );
}

function ConsumerTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;
  const value = payload[0]?.value;

  if (!item || typeof value !== "number") {
    return null;
  }

  return (
    <CustomTooltipShell>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1d4ed8]">
        {String(item.email ?? "User")}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">
        {formatSummaryNumber(value)} calls
      </p>
    </CustomTooltipShell>
  );
}

function AccountStatusTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const value = item?.value;
  const label = item?.name;

  if (typeof value !== "number" || !label) {
    return null;
  }

  return (
    <CustomTooltipShell>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16a34a]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">
        {formatSummaryNumber(value)} accounts
      </p>
    </CustomTooltipShell>
  );
}

function TaxonomyTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length || typeof payload[0]?.value !== "number") {
    return null;
  }

  return (
    <CustomTooltipShell>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a6700]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">
        {formatSummaryNumber(payload[0].value as number)} items
      </p>
    </CustomTooltipShell>
  );
}

function UsageTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length || typeof payload[0]?.value !== "number") {
    return null;
  }

  return (
    <CustomTooltipShell>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4f46e5]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">
        {formatSummaryNumber(payload[0].value as number)} calls
      </p>
    </CustomTooltipShell>
  );
}

function FlowMetric({
  description,
  label,
  tone,
  value,
}: {
  description: string;
  label: string;
  tone: "amber" | "blue" | "green";
  value: string;
}) {
  const toneClasses = {
    amber: "border-black bg-amber-50 text-amber-600",
    blue: "border-black bg-blue-50 text-blue-600",
    green: "border-black bg-green-50 text-green-600",
  };

  return (
    <div
      className={["min-h-28 rounded-xl border p-4", toneClasses[tone]].join(
        " ",
      )}
    >
      <p className="font-subtext text-xs font-medium uppercase">{label}</p>
      <p className="font-title mt-3 text-2xl font-bold">{value}</p>
      <p className="font-subtext mt-3 text-xs font-medium text-slate-500">
        {description}
      </p>
    </div>
  );
}
