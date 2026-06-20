import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

import type {
  AdminApiCallConsumerResponse,
  AdminApiUsageDailyResponse,
  AdminDashboardStatisticsResponse,
  AdminUserBanSummaryResponse,
} from "@/features/admin/types";

type AdminDashboardInsightsProps = {
  apiUsageQuery: UseQueryResult<AdminApiUsageDailyResponse[], Error>;
  banSummaryQuery: UseQueryResult<AdminUserBanSummaryResponse, Error>;
  statistics: AdminDashboardStatisticsResponse | null;
  topConsumersQuery: UseQueryResult<AdminApiCallConsumerResponse[], Error>;
};

const numberFormatter = new Intl.NumberFormat("en");

function formatNumber(value: number | null | undefined) {
  return numberFormatter.format(value ?? 0);
}

function formatDayLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
}

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
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
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
      <h3 className="text-sm font-bold text-slate-950">{title}</h3>
      <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>
    </div>
  );
}

function ChartFeedback({ label }: { label: string }) {
  return (
    <div className="mt-7 rounded-lg border border-slate-100 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-500">
      {label}
    </div>
  );
}

export default function AdminDashboardInsights({
  apiUsageQuery,
  banSummaryQuery,
  statistics,
  topConsumersQuery,
}: AdminDashboardInsightsProps) {
  const topConsumers = topConsumersQuery.data ?? [];
  const maxConsumerCalls = Math.max(
    1,
    ...topConsumers.map((consumer) => consumer.callCount),
  );
  const usageByDay = apiUsageQuery.data ?? [];
  const maxDailyCalls = Math.max(
    1,
    ...usageByDay.map((item) => item.callCount),
  );
  const lineChartPoints = usageByDay
    .map((item, index) => {
      const x = 22 + index * 29;
      const y = 128 - (item.callCount / maxDailyCalls) * 104;

      return `${x},${y}`;
    })
    .join(" ");
  const usageTotal = usageByDay.reduce(
    (total, item) => total + item.callCount,
    0,
  );
  const usagePeak = usageByDay.reduce<AdminApiUsageDailyResponse | null>(
    (peak, item) => (!peak || item.callCount > peak.callCount ? item : peak),
    null,
  );
  const flowValues = {
    activeTrends: statistics?.activeTrends.value ?? 0,
    totalSubfields: statistics?.totalSubfields.value ?? 0,
    totalTopics: statistics?.totalTopics.value ?? 0,
  };
  const maxFlowValue = Math.max(
    1,
    flowValues.activeTrends,
    flowValues.totalSubfields,
    flowValues.totalTopics,
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <ChartCard>
        <SectionTitle
          title="API Calls by User"
          subtitle="Top 5 consumers this month"
        />

        {topConsumersQuery.isPending && <ChartFeedback label="Loading users..." />}
        {topConsumersQuery.isError && (
          <ChartFeedback label="Cannot load top API consumers." />
        )}
        {!topConsumersQuery.isPending
          && !topConsumersQuery.isError
          && topConsumers.length === 0 && (
            <ChartFeedback label="No API consumers found." />
          )}

        {!topConsumersQuery.isPending
          && !topConsumersQuery.isError
          && topConsumers.length > 0 && (
            <>
              <div className="mt-7 space-y-4">
                {topConsumers.map((consumer) => (
                  <div
                    key={consumer.email}
                    className="grid items-center gap-3 sm:grid-cols-[160px_minmax(0,1fr)]"
                  >
                    <p className="truncate text-right text-xs font-medium text-slate-600">
                      {consumer.email}
                    </p>
                    <div className="h-4 overflow-hidden rounded bg-slate-100">
                      <div
                        className="h-full rounded bg-indigo-600"
                        style={{
                          width: `${(consumer.callCount / maxConsumerCalls) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-5 pl-0 text-xs font-medium text-slate-500 sm:pl-[172px]">
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <span key={ratio}>
                    {formatNumber(Math.round(maxConsumerCalls * ratio))}
                  </span>
                ))}
              </div>
            </>
          )}
      </ChartCard>

      <ChartCard>
        <SectionTitle title="User Account Status" subtitle="Active vs Banned" />

        {banSummaryQuery.isPending && <ChartFeedback label="Loading status..." />}
        {banSummaryQuery.isError && (
          <ChartFeedback label="Cannot load account status." />
        )}

        {!banSummaryQuery.isPending
          && !banSummaryQuery.isError
          && banSummaryQuery.data && (
            <div className="mt-7 flex flex-col items-center gap-5 sm:flex-row xl:flex-col 2xl:flex-row">
              <div className="relative h-36 w-36 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="43"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="43"
                    fill="none"
                    stroke="#16a34a"
                    strokeDasharray={`${(banSummaryQuery.data.activePercentage / 100) * 270} 270`}
                    strokeLinecap="butt"
                    strokeWidth="20"
                  />
                </svg>
                <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white" />
              </div>

              <div className="w-full space-y-3 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    Active
                  </span>
                  <strong className="text-slate-950">
                    {formatNumber(banSummaryQuery.data.active)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Banned
                  </span>
                  <strong className="text-slate-950">
                    {formatNumber(banSummaryQuery.data.banned)}
                  </strong>
                </div>
                <p className="leading-5 text-slate-500">
                  {banSummaryQuery.data.activePercentage}% active accounts
                </p>
              </div>
            </div>
          )}
      </ChartCard>

      <ChartCard>
        <SectionTitle
          title="Fields -> Topics -> Trends"
          subtitle="Fields define the research scope. Topics are generated from fields. Trends are calculated from topic and keyword activity"
        />

        {!statistics && <ChartFeedback label="Loading research scope..." />}
        {statistics && (
          <>
            <div className="mt-7 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <FlowMetric
                label="Fields"
                value={formatNumber(flowValues.totalSubfields)}
                description="Research fields"
                tone="green"
              />
              <span className="hidden text-xl font-medium text-slate-400 md:block">
                -&gt;
              </span>
              <FlowMetric
                label="Topics"
                value={formatNumber(flowValues.totalTopics)}
                description={statistics.totalTopics.description}
                tone="blue"
              />
              <span className="hidden text-xl font-medium text-slate-400 md:block">
                -&gt;
              </span>
              <FlowMetric
                label="Trends"
                value={formatNumber(flowValues.activeTrends)}
                description="Active signals"
                tone="amber"
              />
            </div>

            <div className="mt-7 grid grid-cols-[36px_1fr] gap-3">
              <div className="grid h-28 grid-rows-4 text-right text-xs font-medium text-slate-500">
                <span>{formatNumber(maxFlowValue)}</span>
                <span>{formatNumber(Math.round(maxFlowValue * 0.5))}</span>
                <span>{formatNumber(Math.round(maxFlowValue * 0.25))}</span>
                <span>0</span>
              </div>
              <div className="grid h-28 grid-cols-3 items-end gap-8">
                <VerticalBar
                  label="Fields"
                  value={flowValues.totalSubfields}
                  maxValue={maxFlowValue}
                  tone="green"
                />
                <VerticalBar
                  label="Topics"
                  value={flowValues.totalTopics}
                  maxValue={maxFlowValue}
                  tone="blue"
                />
                <VerticalBar
                  label="Trends"
                  value={flowValues.activeTrends}
                  maxValue={maxFlowValue}
                  tone="amber"
                />
              </div>
            </div>
          </>
        )}
      </ChartCard>

      <ChartCard>
        <SectionTitle title="API Usage Over Time" subtitle="Last 7 days" />

        {apiUsageQuery.isPending && <ChartFeedback label="Loading usage..." />}
        {apiUsageQuery.isError && (
          <ChartFeedback label="Cannot load API usage over time." />
        )}
        {!apiUsageQuery.isPending
          && !apiUsageQuery.isError
          && usageByDay.length === 0 && <ChartFeedback label="No usage found." />}

        {!apiUsageQuery.isPending
          && !apiUsageQuery.isError
          && usageByDay.length > 0 && (
            <>
              <div className="mt-5">
                <svg className="h-44 w-full" viewBox="0 0 220 160" role="img">
                  {[1, 0.75, 0.5, 0.25, 0].map((ratio, index) => {
                    const y = 24 + index * 26;

                    return (
                      <g key={ratio}>
                        <text
                          x="0"
                          y={y + 4}
                          className="fill-slate-500 text-[10px] font-medium"
                        >
                          {formatNumber(Math.round(maxDailyCalls * ratio))}
                        </text>
                      </g>
                    );
                  })}
                  <polyline
                    fill="none"
                    points={lineChartPoints}
                    stroke="#4f46e5"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  {usageByDay.map((item, index) => {
                    const x = 22 + index * 29;
                    const y = 128 - (item.callCount / maxDailyCalls) * 104;

                    return (
                      <g key={item.date}>
                        <circle cx={x} cy={y} fill="#4f46e5" r="4" />
                        <text
                          x={x}
                          y="148"
                          textAnchor="middle"
                          className="fill-slate-500 text-[10px] font-medium"
                        >
                          {formatDayLabel(item.date)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
                <span>
                  Peak: {usagePeak ? formatDayLabel(usagePeak.date) : "-"} -{" "}
                  {formatNumber(usagePeak?.callCount ?? 0)} calls
                </span>
                <span>Total: {formatNumber(usageTotal)}</span>
              </div>
            </>
          )}
      </ChartCard>
    </div>
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
    amber: "border-amber-200 bg-amber-50 text-amber-600",
    blue: "border-blue-200 bg-blue-50 text-blue-600",
    green: "border-green-200 bg-green-50 text-green-600",
  };

  return (
    <div
      className={[
        "min-h-28 rounded-xl border p-4",
        toneClasses[tone],
      ].join(" ")}
    >
      <p className="text-xs font-medium uppercase">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-3 text-xs font-medium text-slate-500">{description}</p>
    </div>
  );
}

function VerticalBar({
  label,
  maxValue,
  tone,
  value,
}: {
  label: string;
  maxValue: number;
  tone: "amber" | "blue" | "green";
  value: number;
}) {
  const toneClasses = {
    amber: "bg-amber-500",
    blue: "bg-blue-600",
    green: "bg-green-600",
  };

  return (
    <div className="flex h-full min-w-0 flex-col justify-end gap-2">
      <div
        className={["rounded-t-md", toneClasses[tone]].join(" ")}
        style={{ height: `${(value / maxValue) * 100}%` }}
      />
      <p className="truncate text-center text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}
