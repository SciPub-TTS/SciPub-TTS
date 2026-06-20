import type { ReactNode } from "react";

import type {
  AdminApiUsagePoint,
  AdminTopApiConsumer,
  AdminUserBanSummary,
} from "../types";

const accountStatusChartCircumference = 270;
const usageChartLeft = 24;
const usageChartRight = 210;
const usageChartTop = 24;
const usageChartBottom = 128;
const usageChartHeight = usageChartBottom - usageChartTop;

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
  const activePercentage = clampPercentage(
    banSummary?.activePercentage ?? 0,
  );
  const activeStrokeLength =
    (activePercentage / 100) * accountStatusChartCircumference;
  const activeCount = formatSummaryNumber(banSummary?.active);
  const bannedCount = formatSummaryNumber(banSummary?.banned);
  const maxConsumerCallCount = Math.max(
    1,
    ...topApiConsumers.map((consumer) => Math.max(0, consumer.callCount)),
  );
  const apiConsumerTicks = buildConsumerTicks(maxConsumerCallCount);
  const sortedUsage = sortUsagePoints(apiUsageOverTime);
  const maxUsageCallCount = Math.max(
    1,
    ...sortedUsage.map((item) => Math.max(0, item.callCount)),
  );
  const usageChartPoints = buildUsageChartPoints(
    sortedUsage,
    maxUsageCallCount,
  );
  const usageTicks = buildConsumerTicks(maxUsageCallCount).reverse();
  const peakUsage = getPeakUsagePoint(sortedUsage);
  const totalUsage = sortedUsage.reduce(
    (total, item) => total + Math.max(0, item.callCount),
    0,
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <ChartCard>
        <SectionTitle
          title="API Calls by User"
          subtitle="Top 5 consumers this month"
        />

        <div className="mt-7 space-y-4">
          {isTopApiConsumersLoading && (
            <p className="text-sm font-medium text-slate-500">
              Loading API consumers...
            </p>
          )}
          {!isTopApiConsumersLoading && isTopApiConsumersError && (
            <p className="text-sm font-semibold text-red-600">
              Cannot load API consumers right now.
            </p>
          )}
          {!isTopApiConsumersLoading &&
            !isTopApiConsumersError &&
            topApiConsumers.length === 0 && (
              <p className="text-sm font-medium text-slate-500">
                No API usage found.
              </p>
            )}
          {!isTopApiConsumersLoading &&
            !isTopApiConsumersError &&
            topApiConsumers.map((consumer) => (
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
                      width: `${(Math.max(0, consumer.callCount) / maxConsumerCallCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 flex justify-between pl-0 text-xs font-medium text-slate-500 sm:pl-[172px]">
          {apiConsumerTicks.map((tick) => (
            <span key={tick}>{formatSummaryNumber(tick)}</span>
          ))}
        </div>
      </ChartCard>

      <ChartCard>
        <SectionTitle title="User Account Status" subtitle="Active vs Banned" />

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
                strokeDasharray={`${activeStrokeLength} ${accountStatusChartCircumference}`}
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
                {isBanSummaryLoading ? "..." : activeCount}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Banned
              </span>
              <strong className="text-slate-950">
                {isBanSummaryLoading ? "..." : bannedCount}
              </strong>
            </div>
            {isBanSummaryLoading && (
              <p className="text-xs font-medium text-slate-500">
                Loading account status...
              </p>
            )}
            {isBanSummaryError && (
              <p className="text-xs font-semibold text-red-600">
                Cannot load account status right now.
              </p>
            )}
          </div>
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
          <span className="hidden text-xl font-medium text-slate-400 md:block">
            -&gt;
          </span>
          <FlowMetric
            label="Topics"
            value="186"
            description="From 12 fields"
            tone="blue"
          />
          <span className="hidden text-xl font-medium text-slate-400 md:block">
            -&gt;
          </span>
          <FlowMetric
            label="Trends"
            value="42"
            description="Active signals"
            tone="amber"
          />
        </div>

        <div className="mt-7 grid grid-cols-[36px_1fr] gap-3">
          <div className="grid h-28 grid-rows-4 text-right text-xs font-medium text-slate-500">
            <span>200</span>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>
          <div className="grid h-28 grid-cols-3 items-end gap-8">
            <VerticalBar label="Fields" value={12} maxValue={200} tone="green" />
            <VerticalBar label="Topics" value={186} maxValue={200} tone="blue" />
            <VerticalBar label="Trends" value={42} maxValue={200} tone="amber" />
          </div>
        </div>
      </ChartCard>

      <ChartCard>
        <SectionTitle title="API Usage Over Time" subtitle="Last 7 days" />

        <div className="mt-5">
          {isApiUsageOverTimeLoading && (
            <p className="text-sm font-medium text-slate-500">
              Loading API usage...
            </p>
          )}
          {!isApiUsageOverTimeLoading && isApiUsageOverTimeError && (
            <p className="text-sm font-semibold text-red-600">
              Cannot load API usage right now.
            </p>
          )}
          {!isApiUsageOverTimeLoading &&
            !isApiUsageOverTimeError &&
            sortedUsage.length === 0 && (
              <p className="text-sm font-medium text-slate-500">
                No API usage found.
              </p>
            )}
          {!isApiUsageOverTimeLoading &&
            !isApiUsageOverTimeError &&
            sortedUsage.length > 0 && (
              <svg className="h-44 w-full" viewBox="0 0 220 160" role="img">
                {usageTicks.map((tick, index) => {
                  const y =
                    usageChartTop +
                    (index / Math.max(1, usageTicks.length - 1)) *
                      usageChartHeight;

                  return (
                    <g key={`${tick}-${index}`}>
                      <text
                        x="0"
                        y={y + 4}
                        className="fill-slate-500 text-[10px] font-medium"
                      >
                        {formatSummaryNumber(tick)}
                      </text>
                    </g>
                  );
                })}
                <polyline
                  fill="none"
                  points={usageChartPoints.map((point) => point.point).join(" ")}
                  stroke="#4f46e5"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                {usageChartPoints.map((point) => (
                  <g key={point.date}>
                    <circle cx={point.x} cy={point.y} fill="#4f46e5" r="4" />
                    <text
                      x={point.x}
                      y="148"
                      textAnchor="middle"
                      className="fill-slate-500 text-[10px] font-medium"
                    >
                      {formatWeekday(point.date)}
                    </text>
                  </g>
                ))}
              </svg>
            )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
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

function buildConsumerTicks(maxValue: number) {
  return [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    Math.round(maxValue * ratio),
  );
}

function sortUsagePoints(points: AdminApiUsagePoint[]) {
  return [...points].sort(
    (left, right) =>
      new Date(left.date).getTime() - new Date(right.date).getTime(),
  );
}

function buildUsageChartPoints(
  points: AdminApiUsagePoint[],
  maxCallCount: number,
) {
  const horizontalRange = usageChartRight - usageChartLeft;
  const divisor = Math.max(1, points.length - 1);

  return points.map((item, index) => {
    const normalizedCallCount = Math.max(0, item.callCount);
    const x = usageChartLeft + (index / divisor) * horizontalRange;
    const y =
      usageChartBottom -
      (normalizedCallCount / maxCallCount) * usageChartHeight;

    return {
      date: item.date,
      point: `${x},${y}`,
      x,
      y,
    };
  });
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
