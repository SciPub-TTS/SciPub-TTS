import type {
  LandingKeyword,
  LandingSummaryData,
  LandingTrendingPaper,
  LandingTopic,
} from "@/features/landing/types/landing.types";

interface LandingHeroPreviewProps {
  summary: LandingSummaryData | null;
}

const fallbackTopKeywordCard = {
  name: "Routing Stability in MoE Models",
  worksCount: "248K",
  citedByCount: "1.2M",
};

const fallbackTopTopicCard = {
  name: "Blockchain Technology Applications and Security",
  worksCount: "147.9K",
  citations: "1.6M",
};

const fallbackTrendingPaperCard = {
  title: "OpenMP: an industry standard API",
  authors: "Leonardo Dagum, Ramesh Menon",
  citations: "3.3K",
  saveCount: "2",
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function buildKeywordCard(keyword: LandingKeyword | undefined) {
  if (!keyword) return null;

  return {
    name: keyword.name,
    worksCount: formatCompactNumber(keyword.worksCount),
    citedByCount: formatCompactNumber(keyword.citedByCount),
  };
}

function buildTopicCard(topic: LandingTopic | undefined) {
  if (!topic) return null;

  return {
    name: topic.name,
    worksCount: formatCompactNumber(topic.works),
    citations: formatCompactNumber(topic.citations),
  };
}

function buildPaperCard(paper: LandingTrendingPaper | undefined) {
  if (!paper) return null;

  return {
    title: paper.title,
    authors: paper.authors,
    citations: formatCompactNumber(paper.citations),
    saveCount: paper.saveCount.toLocaleString("en"),
  };
}

export function LandingHeroPreview({ summary }: LandingHeroPreviewProps) {
  const topKeywordCard =
    buildKeywordCard(summary?.top1Keyword ?? undefined) ??
    fallbackTopKeywordCard;
  const topTopicCard =
    buildTopicCard(summary?.top10Topics?.[0]) ?? fallbackTopTopicCard;
  const trendingPaperCard =
    buildPaperCard(summary?.top6TrendingPapers?.[0]) ??
    fallbackTrendingPaperCard;

  return (
    <div
      id="trending-topic-preview"
      className="relative mt-12 scroll-mt-24 overflow-visible rounded-[28px] border border-slate-300/70 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.09)] md:p-4"
    >
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
        <div className="relative">
          <img
            src="/LandingPage-Img/DashboardPreview.png"
            alt="Trending topic preview"
            className="h-[420px] w-full rounded-3xl object-cover object-left-top md:h-[460px]"
          />

          <article
            className="floating-node absolute left-[-8px] top-[8px] w-[160px] rounded-2xl border border-emerald-200/70 bg-white/65 p-2.5 shadow-[0_14px_28px_rgba(15,23,42,0.14)] backdrop-blur-lg md:left-[-14px] md:top-[10px] md:w-[190px]"
            style={{ animationDelay: "0s" }}
          >
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              TOP KEYWORD
            </p>
            <h3 className="text-[16px] font-semibold leading-tight text-slate-950 md:text-[17px]">
              {topKeywordCard.name}
            </h3>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 border-t border-emerald-100 pt-2">
              <Metric label="Works" value={topKeywordCard.worksCount} />
              <Metric label="Cited" value={topKeywordCard.citedByCount} />
            </div>
          </article>

          <article
            className="floating-node absolute right-[8px] top-[26px] w-[160px] rounded-2xl border border-blue-200/70 bg-white/65 p-2.5 shadow-[0_14px_28px_rgba(15,23,42,0.14)] backdrop-blur-lg md:right-[12px] md:top-[34px] md:w-[190px]"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-blue-700">
              TOP TOPIC
            </p>
            <h3 className="text-[16px] font-semibold leading-tight text-slate-950 md:text-[17px]">
              {topTopicCard.name}
            </h3>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 border-t border-blue-100 pt-2">
              <Metric label="Works" value={topTopicCard.worksCount} />
              <Metric label="Citations" value={topTopicCard.citations} />
            </div>
          </article>

          <article
            className="floating-node absolute left-[-8px] bottom-[76px] w-[178px] rounded-2xl border border-amber-200/70 bg-white/65 p-2.5 shadow-[0_14px_28px_rgba(15,23,42,0.14)] backdrop-blur-lg md:left-[-14px] md:bottom-[92px] md:w-[210px]"
            style={{ animationDelay: "1.1s" }}
          >
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              TRENDING PAPER
            </p>
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-slate-950 md:text-[16px]">
              {trendingPaperCard.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-[10px] font-medium text-slate-500">
              {trendingPaperCard.authors}
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 border-t border-amber-100 pt-2">
              <Metric label="Cites" value={trendingPaperCard.citations} />
              <Metric label="Saves" value={trendingPaperCard.saveCount} />
            </div>
          </article>
        </div>

        <PreviewStats summary={summary} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-[14px] font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function PreviewStats({ summary }: { summary: LandingSummaryData | null }) {
  const keywordChips = summary?.top6Keywords?.length
    ? summary.top6Keywords.slice(0, 6).map((keyword) => keyword.name)
    : [
        "OpenAlex Metadata",
        "Topic Trend Analysis",
        "Personalized Feed",
        "Report Export",
        "Citation Graph",
      ];

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        <StatCard
          label="Papers Synced"
          value={formatCompactNumber(summary?.totalPapers ?? 317596832)}
          tone="emerald"
          path="M0 34 C20 34 34 31 48 34 C62 37 72 25 88 27 C104 29 114 34 130 27 C146 20 160 22 176 25 C194 28 204 10 224 13 C236 15 244 8 252 3"
        />
        <StatCard
          label="Authors"
          value={formatCompactNumber(summary?.totalAuthors ?? 118689100)}
          tone="amber"
          path="M0 36 C20 30 38 30 52 35 C66 40 76 24 92 26 C108 28 118 33 134 25 C150 17 164 20 180 18 C198 16 210 6 228 8 C240 10 248 4 252 3"
        />
        <StatCard
          label="Topics"
          value={formatCompactNumber(summary?.totalTopics ?? 4516)}
          tone="blue"
          path="M0 38 C20 31 40 28 56 33 C72 38 82 24 98 25 C114 26 124 34 140 25 C156 16 170 22 184 24 C202 27 216 16 232 7 C242 2 248 3 252 3"
        />
        <StatCard
          label="Fields"
          value={formatCompactNumber(summary?.totalFields ?? 26)}
          tone="emerald"
          path="M0 40 C20 33 40 31 56 35 C72 40 82 21 98 24 C114 27 124 32 140 26 C156 21 166 25 182 19 C200 12 214 21 232 8 C242 1 248 4 252 3"
        />
      </div>

      <article className="h-[120px] rounded-2xl border border-slate-200 bg-white px-4 pt-3 pb-1">
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500">
          <span>Top 6 Keywords</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywordChips.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[13px] text-slate-800"
            >
              {item}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  path,
}: {
  label: string;
  value: string;
  tone: "emerald" | "amber" | "blue";
  path: string;
}) {
  const styles = {
    emerald: {
      wrapper: "border-emerald-100 bg-emerald-50",
      value: "text-emerald-600",
      stroke: "#16a34a",
      fill: "rgba(22,163,74,0.12)",
    },
    amber: {
      wrapper: "border-amber-200 bg-amber-50",
      value: "text-amber-500",
      stroke: "#f59e0b",
      fill: "rgba(245,158,11,0.14)",
    },
    blue: {
      wrapper: "border-blue-100 bg-blue-50",
      value: "text-blue-600",
      stroke: "#2563eb",
      fill: "rgba(37,99,235,0.12)",
    },
  }[tone];

  return (
    <article className={`overflow-hidden rounded-2xl border p-4 ${styles.wrapper}`}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-3xl font-semibold ${styles.value}`}>{value}</p>
      <svg
        className="-ml-2 mt-1.5 h-11 w-[calc(100%+0.5rem)]"
        viewBox="0 0 260 56"
        fill="none"
        aria-hidden="true"
      >
        <path d={`${path} L252 56 L0 56 Z`} fill={styles.fill} />
        <path
          className="stat-sparkline-path"
          d={path}
          stroke={styles.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </article>
  );
}
