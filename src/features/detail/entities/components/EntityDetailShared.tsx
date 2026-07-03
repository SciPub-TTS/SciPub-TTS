import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpenText,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEntityFollow } from "@/features/follows/hooks/useEntityFollow";
import type { FollowTargetType } from "@/features/follows/types/follow.types";
import type { DetailTrailEntityType } from "@/features/detail/detailTrail";
import DetailSectionCard from "@/features/detail/works/components/sections/DetailSectionCard";
import { formatCompactNumber, formatFullNumber } from "@/features/search/utils";
import ListWorkLayout from "@/layout/global/ListWorkLayout";

import type {
  EntityDetailData,
  EntityDetailRelatedItem,
} from "../types";

export type DetailHrefBuilder = (
  entityType: DetailTrailEntityType,
  entityId: string,
) => string;
export type DetailClickHandler = (
  entityType: DetailTrailEntityType,
  entityId: string,
) => void;

type YearChartTooltipProps = {
  active?: boolean;
  label?: number | string;
  payload?: Array<{ value?: number }>;
};

export function EntityDetailHero({ detail }: { detail: EntityDetailData }) {
  const followTargetType: FollowTargetType =
    detail.entityType === "authors" ? "AUTHOR" : "TOPIC";
  const {
    buttonLabel: followButtonLabel,
    handleFollowClick,
    isFollowActionPending,
    isFollowed,
  } = useEntityFollow({
    displayName: detail.displayName,
    targetOpenAlexId: detail.id,
    targetType: followTargetType,
  });
  const followButtonClassName = isFollowed
    ? "border border-[#14532D] bg-[#14532D] text-white hover:border-[#0f3d22] hover:bg-[#0f3d22] hover:text-white"
    : "border border-black bg-white text-black hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";

  return (
    <div className="px-4 py-4 sm:py-6">
      <div className="flex flex-wrap items-center justify-center gap-3 text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">
          {detail.displayName}
        </h1>
        <button
          type="button"
          disabled={isFollowActionPending}
          onClick={() => {
            void handleFollowClick();
          }}
          title={isFollowed ? "Unfollow this entity" : "Follow this entity"}
          className={[
            "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
            followButtonClassName,
          ].join(" ")}
        >
          {followButtonLabel}
        </button>
      </div>
    </div>
  );
}

export function EntityWorksSection({
  detail,
  buildDetailHref,
}: {
  buildDetailHref: DetailHrefBuilder;
  detail: EntityDetailData;
}) {
  const title =
    detail.entityType === "authors"
      ? "Works by this author"
      : "Works inside this topic";
  const emptyLabel =
    detail.entityType === "authors"
      ? "No works are available for this author yet."
      : "No works are available for this topic yet.";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black bg-white">
          <BookOpenText className="h-5 w-5 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-black">{title}</h2>
        </div>
      </div>

      {detail.works.length === 0 ? (
        <div className="rounded-3xl border border-black bg-white p-6 text-sm font-semibold text-slate-600">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-4">
          {detail.works.map((work) => (
            <ListWorkLayout
              key={work.id}
              abstractText={work.abstract}
              authors={work.authors}
              authorRefs={work.authorRefs}
              citations={work.citations}
              detailHref={buildDetailHref("works", work.id)}
              doi={work.doi}
              field={work.field}
              isSaved={work.saved}
              isTrendTopic={work.isTrendTopic}
              keywords={work.keywords}
              pdfUrl={work.pdfUrl}
              preserveSearchStateOnDetailClick={false}
              source={work.source}
              subField={work.subField}
              title={work.title}
              topic={work.topic}
              topicRef={work.topicRef}
              workId={work.id}
              year={work.year}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function EntityYearChartSection({ detail }: { detail: EntityDetailData }) {
  if (detail.countsByYear.length === 0) {
    return null;
  }

  return (
    <DetailSectionCard
      icon={<BarChart3 className="h-5 w-5" />}
      title="Yearly Output"
    >
      <div className="rounded-2xl border border-black bg-[#f1f3f4] p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-black">Works by year</h3>
          <p className="text-sm text-black">
            Recent publishing activity returned from OpenAlex.
          </p>
        </div>

        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={detail.countsByYear}
              margin={{ top: 12, right: 12, bottom: 6, left: 0 }}
            >
              <defs>
                <linearGradient
                  id="entityYearBarGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#14532D" stopOpacity={0.96} />
                  <stop offset="100%" stopColor="#86EFAC" stopOpacity={0.86} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#b8c2cc"
                strokeDasharray="4 6"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "#111111", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: "#111111" }}
              />
              <YAxis
                dataKey="worksCount"
                tickFormatter={formatCompactNumber}
                tick={{ fill: "#111111", fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip content={<YearChartTooltip />} />
              <Bar
                dataKey="worksCount"
                radius={[10, 10, 0, 0]}
                fill="url(#entityYearBarGradient)"
              >
                {detail.countsByYear.map((item) => (
                  <Cell
                    key={`entity-year-bar-${item.year}`}
                    stroke="#0f3d22"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DetailSectionCard>
  );
}

export function RelatedTopicList({
  buildDetailHref,
  handleDetailClick,
  items,
  emptyLabel,
}: {
  buildDetailHref: DetailHrefBuilder;
  handleDetailClick: DetailClickHandler;
  items: EntityDetailRelatedItem[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm font-semibold text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          to={buildDetailHref("topics", item.id)}
          onClick={() => {
            handleDetailClick("topics", item.id);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-[#00A859] bg-[#ECFFF5] px-3.5 py-1.5 text-xs font-semibold text-[#007A41] transition hover:-translate-y-0.5"
        >
          <Tags className="h-3.5 w-3.5" />
          <span>{item.displayName}</span>
          {item.count !== null ? (
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-[#14532D]">
              {formatCompactNumber(item.count)}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

export function OverviewRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="border-b border-black pb-4 last:border-b-0 last:pb-0">
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6700]">
        {label}
      </h3>
      <p className="mt-2 text-lg leading-8 text-slate-950">{value}</p>
    </div>
  );
}

function YearChartTooltip(props: YearChartTooltipProps) {
  const { active, label, payload } = props;

  if (!active || !payload?.length) {
    return null;
  }

  const worksCount = payload[0]?.value;

  if (typeof worksCount !== "number") {
    return null;
  }

  return (
    <div className="rounded-xl border border-black bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14532D]">
        Year {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-black">
        {formatFullNumber(worksCount)} works
      </p>
    </div>
  );
}
