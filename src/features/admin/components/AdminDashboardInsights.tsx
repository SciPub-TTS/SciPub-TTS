import type { ReactNode } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AdminApiUsagePoint, AdminTopApiConsumer } from "../types";

type AdminDashboardInsightsProps = {
  apiUsageOverTime: AdminApiUsagePoint[];
  isApiUsageOverTimeError: boolean;
  isApiUsageOverTimeLoading: boolean;
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
      <h3 className="font-title text-sm font-bold text-black">{title}</h3>
      <p className="font-subtext mt-1 text-xs font-medium text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}

export default function AdminDashboardInsights({
  apiUsageOverTime,
  isApiUsageOverTimeError,
  isApiUsageOverTimeLoading,
  isTopApiConsumersError,
  isTopApiConsumersLoading,
  topApiConsumers,
}: AdminDashboardInsightsProps) {
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

  const usageChartData = sortedUsage.map((item) => ({
    ...item,
    day: formatWeekday(item.date),
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <ChartCard>
        <SectionTitle
          title="API Calls by Consumer to Open Alex"
          subtitle="Top users and guest usage this month."
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
                        <stop
                          offset="0%"
                          stopColor="#4f46e5"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#4f46e5"
                          stopOpacity={0.04}
                        />
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

function CustomTooltipShell({ children }: { children: ReactNode }) {
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
