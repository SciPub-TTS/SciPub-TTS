import {
  BarChart3,
  Tags,
  UserRound,
} from "lucide-react";

import {
  PaperDetailErrorState,
  PaperDetailLoadingState,
} from "@/features/detail/works/components/sections/PaperDetailFeedbackState";
import DetailSectionCard from "@/features/detail/works/components/sections/DetailSectionCard";
import { formatFullNumber } from "@/features/search/utils";

import { useEntityDetailNavigation } from "../hooks/useEntityDetailNavigation";
import { useEntityDetailPageState } from "../hooks/useEntityDetailPageState";
import type { AuthorDetailData } from "../types";
import {
  EntityDetailHero,
  EntityWorksSection,
  EntityYearChartSection,
  OverviewRow,
  RelatedTopicList,
} from "./EntityDetailShared";

export default function AuthorDetailPage() {
  const { buildDetailHref } = useEntityDetailNavigation();
  const { detail, errorMessage, isLoading } =
    useEntityDetailPageState("authors");

  if (isLoading) {
    return <PaperDetailLoadingState />;
  }

  if (errorMessage || !detail || detail.entityType !== "authors") {
    return <PaperDetailErrorState message={errorMessage} />;
  }

  return (
    <section className="space-y-6">
      <EntityDetailHero detail={detail} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <AuthorOverviewSection detail={detail} />
          <EntityWorksSection detail={detail} buildDetailHref={buildDetailHref} />
        </div>

        <div className="space-y-6">
          <AuthorMetricsSection detail={detail} />
          <EntityYearChartSection detail={detail} />
          <AuthorTopicHighlightsSection
            detail={detail}
            buildDetailHref={buildDetailHref}
          />
        </div>
      </div>
    </section>
  );
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
        label="ORCID"
        value={
          detail.orcid ? (
            <a
              href={detail.orcid}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#2563EB] underline decoration-[#2563EB]/50 underline-offset-4 transition hover:text-[#1D4ED8] hover:decoration-[#1D4ED8]"
            >
              {detail.orcid}
            </a>
          ) : (
            "No ORCID available."
          )
        }
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

function AuthorMetricsSection({ detail }: { detail: AuthorDetailData }) {
  const metricItems = [
    { label: "Works count", value: formatFullNumber(detail.worksCount) },
    {
      label: "Citation count",
      value: formatFullNumber(detail.citedByCount),
    },
    { label: "H-index", value: formatNullableMetric(detail.hIndex) },
    { label: "I10-index", value: formatNullableMetric(detail.i10Index) },
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

function AuthorTopicHighlightsSection({
  detail,
  buildDetailHref,
}: {
  buildDetailHref: (
    entityType: "authors" | "topics" | "works",
    entityId: string,
  ) => string;
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

function joinValues(values: string[], emptyLabel: string) {
  return values.length > 0 ? values.join(", ") : emptyLabel;
}

function formatNullableMetric(value: number | null) {
  return value === null ? "N/A" : formatFullNumber(value);
}
