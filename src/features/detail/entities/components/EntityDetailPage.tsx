import {
  BarChart3,
  BookOpenText,
  Building2,
  Layers3,
  Orbit,
  Tags,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
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

import { routePaths } from "@/app/router";
import {
  buildNextDetailUrl,
  type DetailTrailEntityType,
  getDetailContextFromRouteParams,
} from "@/features/detail/detailTrail";
import {
  PaperDetailErrorState,
  PaperDetailLoadingState,
} from "@/features/detail/works/components/sections/PaperDetailFeedbackState";
import DetailSectionCard from "@/features/detail/works/components/sections/DetailSectionCard";
import { formatCompactNumber, formatFullNumber } from "@/features/search/utils";
import ListWorkLayout from "@/layout/components/ListWorkLayout";

import { useEntityDetailPageState } from "../hooks/useEntityDetailPageState";
import type {
  AuthorDetailData,
  EntityDetailData,
  EntityDetailRelatedItem,
  EntityDetailType,
  TopicDetailData,
} from "../types";

type EntityDetailPageProps = {
  entityType: EntityDetailType;
};

type DetailHrefBuilder = (
  entityType: DetailTrailEntityType,
  entityId: string,
) => string;

type YearChartTooltipProps = {
  active?: boolean;
  label?: number | string;
  payload?: Array<{ value?: number }>;
};

export default function EntityDetailPage(props: EntityDetailPageProps) {
  const { entityType } = props;
  const location = useLocation();
  const currentDetailContext = getDetailContextFromRouteParams(useParams());
  const { detail, errorMessage, isLoading } =
    useEntityDetailPageState(entityType);

  function buildDetailHref(
    targetEntityType: DetailTrailEntityType,
    targetEntityId: string,
  ) {
    if (!currentDetailContext) {
      if (targetEntityType === "works") {
        return routePaths.paperDetail(targetEntityId);
      }

      if (targetEntityType === "authors") {
        return routePaths.authorDetail(targetEntityId);
      }

      return routePaths.topicDetail(targetEntityId);
    }

    return buildNextDetailUrl(
      location.search,
      currentDetailContext.entityType,
      currentDetailContext.entityId,
      targetEntityType,
      targetEntityId,
    );
  }

  if (isLoading) {
    return <PaperDetailLoadingState />;
  }

  if (errorMessage || !detail) {
    return <PaperDetailErrorState message={errorMessage} />;
  }

  return (
    <section className="space-y-6">
      <EntityDetailHero detail={detail} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <EntityOverviewSection detail={detail} buildDetailHref={buildDetailHref} />
          <EntityWorksSection detail={detail} buildDetailHref={buildDetailHref} />
        </div>

        <div className="space-y-6">
          <EntityMetricsSection detail={detail} />
          <EntityYearChartSection detail={detail} />
          {detail.entityType === "authors" ? (
            <EntityTopicHighlightsSection
              detail={detail}
              buildDetailHref={buildDetailHref}
            />
          ) : (
            <EntityTypeBreakdownSection
              detail={detail}
              buildDetailHref={buildDetailHref}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function EntityDetailHero({ detail }: { detail: EntityDetailData }) {
  return (
    <div className="px-4 py-4 text-center sm:py-6">
      <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">
        {detail.displayName}
      </h1>
    </div>
  );
}

function EntityOverviewSection({
  detail,
  buildDetailHref,
}: {
  buildDetailHref: DetailHrefBuilder;
  detail: EntityDetailData;
}) {
  if (detail.entityType === "authors") {
    return <AuthorOverviewSection detail={detail} />;
  }

  return <TopicOverviewSection detail={detail} buildDetailHref={buildDetailHref} />;
}

function AuthorOverviewSection({ detail }: { detail: AuthorDetailData }) {
  return (
    <DetailSectionCard
      icon={<UserRound className="h-5 w-5" />}
      title="Profile Snapshot"
    >
      <OverviewRow
        label="Observed names"
        value={joinValues(
          detail.observedNames,
          "No alternative names available.",
        )}
      />
      <OverviewRow
        label="Primary institution"
        value={detail.primaryInstitutionName || "No institution available."}
      />
      <OverviewRow
        label="Observed institutions"
        value={joinValues(
          detail.observedInstitutions,
          "No additional institutions available.",
        )}
      />
    </DetailSectionCard>
  );
}

function TopicOverviewSection({
  detail,
  buildDetailHref,
}: {
  buildDetailHref: DetailHrefBuilder;
  detail: TopicDetailData;
}) {
  return (
    <DetailSectionCard
      icon={<Layers3 className="h-5 w-5" />}
      title="Topic Snapshot"
    >
      <OverviewRow
        label="Description"
        value={detail.description || "No description available."}
      />

      {detail.siblingTopics.length > 0 ? (
        <div className="border-t border-black pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-black">
            <Orbit className="h-4 w-4" />
            Sibling topics
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {detail.siblingTopics.map((topic) => (
              <Link
                key={topic.id}
                to={buildDetailHref("topics", topic.id)}
                className="inline-flex items-center gap-2 rounded-full border border-[#00A859] bg-[#ECFFF5] px-3.5 py-1.5 text-xs font-semibold text-[#007A41] transition hover:-translate-y-0.5"
              >
                <Tags className="h-3.5 w-3.5" />
                {topic.displayName}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </DetailSectionCard>
  );
}

function EntityWorksSection({
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
              subField={work.subField}
              title={work.title}
              topic={work.topic}
              topicRef={work.topicRef}
              venue={work.venue}
              workId={work.id}
              year={work.year}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EntityMetricsSection({ detail }: { detail: EntityDetailData }) {
  const metricItems =
    detail.entityType === "authors"
      ? [
          { label: "Works count", value: formatFullNumber(detail.worksCount) },
          {
            label: "Citation count",
            value: formatFullNumber(detail.citedByCount),
          },
          { label: "H-index", value: formatNullableMetric(detail.hIndex) },
          { label: "I10-index", value: formatNullableMetric(detail.i10Index) },
        ]
      : [
          { label: "Works count", value: formatFullNumber(detail.worksCount) },
          {
            label: "Citation count",
            value: formatFullNumber(detail.citedByCount),
          },
          {
            label: "Field",
            value: detail.fieldName || "No field",
          },
          {
            label: "Subfield",
            value: detail.subfieldName || "No subfield",
          },
        ];

  return (
    <DetailSectionCard
      icon={<BarChart3 className="h-5 w-5" />}
      title="Key Metrics"
    >
      <div className="space-y-4">
        {metricItems.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a6700]">
              {item.label}
            </p>
            <p className="text-right text-xl font-semibold text-slate-950">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </DetailSectionCard>
  );
}

function EntityYearChartSection({ detail }: { detail: EntityDetailData }) {
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

function EntityTopicHighlightsSection({
  detail,
  buildDetailHref,
}: {
  buildDetailHref: DetailHrefBuilder;
  detail: AuthorDetailData;
}) {
  if (detail.topicHighlights.length === 0) {
    return null;
  }

  return (
    <DetailSectionCard
      icon={<Tags className="h-5 w-5" />}
      title="Topic Highlights"
    >
      <RelatedTopicList
        buildDetailHref={buildDetailHref}
        items={detail.topicHighlights}
        emptyLabel="No topics are available for this author."
      />
    </DetailSectionCard>
  );
}

function EntityTypeBreakdownSection({
  detail,
  buildDetailHref,
}: {
  buildDetailHref: DetailHrefBuilder;
  detail: TopicDetailData;
}) {
  if (detail.typeBreakdown.length === 0) {
    return null;
  }

  const maxCount = Math.max(
    ...detail.typeBreakdown.map((item) => item.count),
    1,
  );

  return (
    <DetailSectionCard
      icon={<Building2 className="h-5 w-5" />}
      title="Work Types"
    >
      <div className="space-y-4">
        {detail.typeBreakdown.map((item) => {
          const widthPercent = `${Math.max((item.count / maxCount) * 100, 8)}%`;

          return (
            <div key={`${item.value}-${item.label}`} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm font-semibold text-black">
                <span className="break-words">{item.label}</span>
                <span>{formatFullNumber(item.count)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#14532D] to-[#86EFAC]"
                  style={{ width: widthPercent }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {detail.siblingTopics.length > 0 ? (
        <div className="border-t border-black pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-black">
            <Tags className="h-4 w-4" />
            Nearby topics
          </div>
          <div className="mt-3">
            <RelatedTopicList
              buildDetailHref={buildDetailHref}
              items={detail.siblingTopics}
              emptyLabel="No sibling topics are available."
            />
          </div>
        </div>
      ) : null}
    </DetailSectionCard>
  );
}

function RelatedTopicList({
  buildDetailHref,
  items,
  emptyLabel,
}: {
  buildDetailHref: DetailHrefBuilder;
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

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
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

function joinValues(values: string[], emptyLabel: string) {
  return values.length > 0 ? values.join(", ") : emptyLabel;
}

function formatNullableMetric(value: number | null) {
  return value === null ? "N/A" : formatFullNumber(value);
}
