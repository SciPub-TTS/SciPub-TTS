import {
  BarChart3,
  Building2,
  Layers3,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  PaperDetailErrorState,
  PaperDetailLoadingState,
} from "@/features/detail/works/components/sections/PaperDetailFeedbackState";
import DetailSectionCard from "@/features/detail/works/components/sections/DetailSectionCard";
import { formatFullNumber } from "@/features/search/utils";

import { useEntityDetailNavigation } from "../hooks/useEntityDetailNavigation";
import { useEntityDetailPageState } from "../hooks/useEntityDetailPageState";
import type { TopicDetailData } from "../types";
import {
  type DetailClickHandler,
  type DetailHrefBuilder,
  EntityDetailHero,
  EntityWorksSection,
  EntityYearChartSection,
  OverviewRow,
  RelatedTopicList,
} from "./EntityDetailShared";

export default function TopicDetailPage() {
  const { buildDetailHref, handleDetailClick } = useEntityDetailNavigation();
  const { detail, errorMessage, isLoading } =
    useEntityDetailPageState("topics");

  if (isLoading) {
    return <PaperDetailLoadingState />;
  }

  if (errorMessage || !detail || detail.entityType !== "topics") {
    return <PaperDetailErrorState message={errorMessage} />;
  }

  return (
    <section className="space-y-6">
      <EntityDetailHero detail={detail} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <TopicOverviewSection
            detail={detail}
            buildDetailHref={buildDetailHref}
            handleDetailClick={handleDetailClick}
          />
          <EntityWorksSection
            detail={detail}
            buildDetailHref={buildDetailHref}
          />
        </div>

        <div className="space-y-6">
          <TopicMetricsSection detail={detail} />
          <EntityYearChartSection detail={detail} />
          <TopicTypeBreakdownSection
            detail={detail}
            buildDetailHref={buildDetailHref}
            handleDetailClick={handleDetailClick}
          />
        </div>
      </div>
    </section>
  );
}

function TopicOverviewSection({
  detail,
  buildDetailHref,
  handleDetailClick,
}: {
  buildDetailHref: DetailHrefBuilder;
  handleDetailClick: DetailClickHandler;
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
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6700]">
            Sibling topics
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {detail.siblingTopics.map((topic) => (
              <Link
                key={topic.id}
                to={buildDetailHref("topics", topic.id)}
                onClick={() => {
                  handleDetailClick("topics", topic.id);
                }}
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

function TopicMetricsSection({ detail }: { detail: TopicDetailData }) {
  const metricItems = [
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

function TopicTypeBreakdownSection({
  detail,
  buildDetailHref,
  handleDetailClick,
}: {
  buildDetailHref: DetailHrefBuilder;
  handleDetailClick: DetailClickHandler;
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
              handleDetailClick={handleDetailClick}
              items={detail.siblingTopics}
              emptyLabel="No sibling topics are available."
            />
          </div>
        </div>
      ) : null}
    </DetailSectionCard>
  );
}
