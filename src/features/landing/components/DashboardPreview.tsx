import { useQuery } from "@tanstack/react-query";
import { FileText, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  YAxis,
  Legend,
} from "recharts";

import { getLandingTrendPreview } from "../services/landingApi";
import { Reveal } from "./primitives";
import { SectionBg } from "./SectionBg";

const TREND = [
  { year: "2016", publications: 10_400_000 },
  { year: "2017", publications: 10_300_000 },
  { year: "2018", publications: 10_250_000 },
  { year: "2019", publications: 10_700_000 },
  { year: "2020", publications: 11_500_000 },
  { year: "2021", publications: 10_800_000 },
  { year: "2022", publications: 10_200_000 },
  { year: "2023", publications: 10_700_000 },
  { year: "2024", publications: 10_600_000 },
  { year: "2025", publications: 16_000_000 },
  { year: "2026", publications: 23_800_000 },
] as const;

function formatCompactNumber(value: number | null) {
  if (value === null) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value >= 1_000 ? 1 : 0,
  }).format(value);
}

function formatSnapshotDate(value?: string) {
  if (!value) {
    return "latest snapshot";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatMillions(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function YearBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span
        className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9AAFD0]"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {label}
      </span>
      <div className="flex min-w-[112px] items-center justify-between rounded-[0.95rem] border border-[#D7E3F4] bg-[#F9FBFF] px-4 py-3 text-[1.05rem] font-semibold text-[#264C7E]">
        <span>{value}</span>
        <ChevronDown className="size-4 text-[#8BA7CC]" />
      </div>
    </div>
  );
}

export function DashboardPreview() {
  const landingTrendPreviewQuery = useQuery({
    queryKey: ["landingTrendPreview"],
    queryFn: () => getLandingTrendPreview(),
  });

  const landingTrendPreview = landingTrendPreviewQuery.data;
  const hasLoadedTrendSnapshot = landingTrendPreviewQuery.status !== "pending";
  const topicResults = landingTrendPreview?.topTopics ?? [];
  const keywordResults = landingTrendPreview?.topKeywords ?? [];
  const hasTrendingThisWeek = topicResults.length > 0;

  return (
    <section className="relative bg-[#E1EFE6]">
      <SectionBg src="/image-4.jpg" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <span
            className="text-[0.72rem] tracking-[0.2em] text-[#166534]"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
          >
            PRODUCT PREVIEW
          </span>
          <h2
            className="mt-3 text-[2.2rem] leading-tight text-[#0F172A] sm:text-[2.6rem]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            One structured research workspace.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-300 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
              <span className="size-3 rounded-full bg-[#F37021]" />
              <span className="size-3 rounded-full bg-[#0F75BC]" />
              <span className="size-3 rounded-full bg-[#7AC143]" />
              <div
                className="ml-3 rounded-md border border-slate-200 bg-white px-3 py-1 text-[0.78rem] text-slate-400"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                owlreka.app / workspace
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[0.95fr_1.35fr]">
              <div className="space-y-3">
                {!hasLoadedTrendSnapshot
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`loading-topic-${index + 1}`}
                        className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0F75BC]/10 text-[#0F75BC]">
                          <FileText className="size-4" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
                          <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ))
                  : null}

                {hasLoadedTrendSnapshot && !hasTrendingThisWeek ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-500">
                    <p
                      className="text-[0.92rem]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      No trending this week.
                    </p>
                  </div>
                ) : null}

                {topicResults.map((topic) => (
                  <div
                    key={topic.topicId ?? topic.name}
                    className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0F75BC]/10 text-[#0F75BC]">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="break-words text-[0.98rem] text-[#0F172A]"
                        style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                      >
                        {topic.name}
                      </p>
                      <p
                        className="mt-0.5 text-[0.82rem] text-slate-500"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        Topic trend - {formatCompactNumber(topic.works)} works -{" "}
                        <span className="text-[#0F75BC]">
                          {formatCompactNumber(topic.citations)} citations
                        </span>
                      </p>
                    </div>
                  </div>
                ))}

                {hasLoadedTrendSnapshot && hasTrendingThisWeek ? (
                  <div className="rounded-[1.2rem] border border-slate-200 bg-[#F8FBFF] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-[0.72rem] uppercase tracking-[0.2em] text-[#0F75BC]"
                          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                        >
                          Trending Keywords
                        </p>
                        <p
                          className="mt-1 text-[0.88rem] text-slate-500"
                          style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                          This week's strongest keyword signals from the same snapshot.
                        </p>
                      </div>
                      <span
                        className="rounded-full bg-[#0F75BC]/10 px-3 py-1 text-[0.75rem] font-semibold text-[#0F75BC]"
                        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                      >
                        {keywordResults.length}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {keywordResults.map((keyword) => (
                        <span
                          key={keyword.keywordId ?? keyword.name}
                          className="rounded-full border border-[#BFDBFE] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[#1D4ED8]"
                          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                        >
                          {keyword.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.35rem] border border-slate-200 bg-white p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3
                        className="text-[2rem] leading-tight text-[#0F172A]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                      >
                        Publication Trend Over Time
                      </h3>
                      <p
                        className="mt-1 text-[1rem] text-slate-500"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        Number of papers published per year
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <YearBox label="From" value="2016" />
                      <YearBox label="To" value="2026" />
                    </div>
                  </div>

                  <div className="mt-6 h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TREND} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="landing-publication-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="#CBD5E1"
                          strokeDasharray="10 10"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="year"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#64748B" }}
                        />
                        <YAxis
                          width={58}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#64748B" }}
                          tickFormatter={(value) => formatMillions(Number(value))}
                        />
                        <Tooltip
                          formatter={(value) => [
                            Number(value ?? 0).toLocaleString("en-US"),
                            "Publications",
                          ]}
                          contentStyle={{
                            borderRadius: 14,
                            border: "1px solid #D7E3F4",
                            boxShadow: "0 12px 30px rgba(37,99,235,0.08)",
                          }}
                        />
                        <Legend
                          align="right"
                          wrapperStyle={{
                            paddingTop: 8,
                            color: "#2563EB",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="publications"
                          name="Publications"
                          stroke="#2563EB"
                          strokeWidth={2.25}
                          fill="url(#landing-publication-gradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span
                    className="text-[0.8rem] text-slate-600"
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >
                    Report summary
                  </span>
                  <p
                    className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-500"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {!hasLoadedTrendSnapshot
                      ? "Loading this week's trend snapshot."
                      : hasTrendingThisWeek
                      ? `${formatCompactNumber(landingTrendPreview?.totalTrendingTopics ?? null)} trending topics - ${formatCompactNumber(landingTrendPreview?.totalTrendingKeywords ?? null)} trending keywords - ${formatSnapshotDate(landingTrendPreview?.snapshotDate)}.`
                      : `No trending this week. Waiting for Monday ${formatSnapshotDate(landingTrendPreview?.snapshotDate)}.`}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="flex-1 rounded-lg border border-[#F37021] bg-[#F37021] py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-[#D85C12]"
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                    >
                      CSV
                    </button>
                    <button
                      className="flex-1 rounded-lg border border-[#0F75BC] bg-[#0F75BC] py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-[#0B5D97]"
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                    >
                      JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
