import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Link2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { formatCompactNumber, formatFullNumber } from "@/features/search/utils";
import MetadataBadge from "@/layout/components/MetadataBadge";

import { getOpenAlexEntity, getOpenAlexWorks } from "../services";
import type {
  EntityCanvasEntry,
  EntityType,
  OpenAlexEntity,
  OpenAlexWorkListItem,
} from "../types";
import {
  formatEntityTypeLabel,
  getOpenAlexEntityUrl,
  normalizeOpenAlexId,
} from "../utils";
import EntityCanvasLink from "./EntityCanvasLink";

type EntityCanvasProps = {
  stack: EntityCanvasEntry[];
  onClose: () => void;
  onBack: () => void;
  isFollowed: (entry: EntityCanvasEntry) => boolean;
  onToggleFollow: (entry: EntityCanvasEntry) => void;
};

type SummaryItem = {
  label: string;
  value: string;
  href?: string;
};

type WorkItem = {
  id: string;
  title: string;
  year?: number | null;
  citations?: number | null;
  pdfUrl?: string | null;
};

type EntityRef = {
  id: string;
  label: string;
  type: EntityType;
};

const worksSelectFields = [
  "id",
  "display_name",
  "publication_year",
  "cited_by_count",
  "ids",
  "primary_location",
  "best_oa_location",
  "has_content",
  "open_access",
].join(",");

export default function EntityCanvas({
  stack,
  onClose,
  onBack,
  isFollowed,
  onToggleFollow,
}: EntityCanvasProps) {
  if (stack.length === 0) {
    return null;
  }

  const activeEntry = stack[stack.length - 1];

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-slate-900/30"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-[50vw] min-w-[360px] max-w-[780px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <EntityCanvasPanel
          entry={activeEntry}
          canGoBack={stack.length > 1}
          onBack={onBack}
          onClose={onClose}
          isFollowed={isFollowed}
          onToggleFollow={onToggleFollow}
        />
      </aside>
    </div>
  );
}

function EntityCanvasPanel({
  entry,
  canGoBack,
  onBack,
  onClose,
  isFollowed,
  onToggleFollow,
}: {
  entry: EntityCanvasEntry;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  isFollowed: (entry: EntityCanvasEntry) => boolean;
  onToggleFollow: (entry: EntityCanvasEntry) => void;
}) {
  const [entity, setEntity] = useState<OpenAlexEntity | null>(null);
  const [topWorks, setTopWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEntity() {
      setIsLoading(true);
      setErrorMessage("");
      setEntity(null);

      if (!entry.type) {
        setErrorMessage("Entity type is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getOpenAlexEntity(entry.type, entry.id);

        if (!mounted) {
          return;
        }

        setEntity(data);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setEntity(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Cannot load entity details right now.",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadEntity();

    return () => {
      mounted = false;
    };
  }, [entry.id, entry.type]);

  useEffect(() => {
    let mounted = true;

    async function loadTopWorks() {
      if (!entry.type) {
        return;
      }

      const filter = buildWorksFilter(entry.type, entry.id);
      if (!filter) {
        setTopWorks([]);
        return;
      }

      try {
        const results = await getOpenAlexWorks({
          filter,
          sort: "cited_by_count:desc",
          perPage: 3,
          select: worksSelectFields,
        });

        if (!mounted) {
          return;
        }

        setTopWorks(mapWorks(results));
      } catch {
        if (!mounted) {
          return;
        }

        setTopWorks([]);
      }
    }

    void loadTopWorks();

    return () => {
      mounted = false;
    };
  }, [entry.id, entry.type]);

  const resolvedType = entry.type || "author";
  const typeLabel = formatEntityTypeLabel(resolvedType);
  const isAuthorOrTopic = resolvedType === "author" || resolvedType === "topic";
  const followActive = isFollowed(entry);

  const canvasState = useMemo(() => {
    if (!entity) {
      return null;
    }

    return buildEntityCanvasState(entity, resolvedType, topWorks, entry.label);
  }, [entity, entry.label, resolvedType, topWorks]);

  if (isLoading) {
    return (
      <CanvasLoadingState
        canGoBack={canGoBack}
        onBack={onBack}
        onClose={onClose}
      />
    );
  }

  if (!canvasState) {
    return (
      <CanvasErrorState
        canGoBack={canGoBack}
        message={errorMessage || "Unable to load entity details."}
        onBack={onBack}
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <CanvasHeader
        canGoBack={canGoBack}
        onBack={onBack}
        onClose={onClose}
        title={canvasState.title}
        subtitle={typeLabel}
        openAlexId={canvasState.openAlexId}
      />

      <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
        <div className="space-y-6">
          {canvasState.description ? (
            <SectionCard title="Overview">
              <p className="text-sm leading-7 text-slate-700">
                {canvasState.description}
              </p>
            </SectionCard>
          ) : null}

          {canvasState.overviewItems.length > 0 ? (
            <SectionCard title="Overview">
              <SummaryGrid items={canvasState.overviewItems} />
            </SectionCard>
          ) : null}

          {canvasState.keyStats.length > 0 ? (
            <SectionCard title="Key Statistics">
              <StatsGrid items={canvasState.keyStats} />
            </SectionCard>
          ) : null}

          {canvasState.activityItems.length > 0 ? (
            <SectionCard title="Publication Activity">
              <SummaryGrid items={canvasState.activityItems} />
            </SectionCard>
          ) : null}

          {canvasState.topics.length > 0 ? (
            <SectionCard title="Top Topics">
              <TagList items={canvasState.topics} tone="topic" />
            </SectionCard>
          ) : null}

          {canvasState.fields.length > 0 ? (
            <SectionCard title="Main Fields">
              <TagList items={canvasState.fields} tone="default" />
            </SectionCard>
          ) : null}

          {canvasState.institutions.length > 0 ? (
            <SectionCard title="Institutions">
              <EntityList items={canvasState.institutions} />
            </SectionCard>
          ) : null}

          {canvasState.relatedEntities.length > 0 ? (
            <SectionCard title={canvasState.relatedEntitiesTitle}>
              <EntityList items={canvasState.relatedEntities} />
            </SectionCard>
          ) : null}

          {canvasState.topWorks.length > 0 ? (
            <SectionCard title="Top Works">
              <WorkList items={canvasState.topWorks} />
            </SectionCard>
          ) : null}

          {canvasState.quickLinks.length > 0 ? (
            <SectionCard title="Metadata & Quick Links">
              <QuickLinksList items={canvasState.quickLinks} />
            </SectionCard>
          ) : null}
        </div>
      </div>

      {isAuthorOrTopic ? (
        <CanvasFooter>
          <button
            type="button"
            onClick={() => onToggleFollow(entry)}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
              followActive
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
            ].join(" ")}
          >
            {followActive ? "Following" : `+ Follow ${typeLabel}`}
          </button>
        </CanvasFooter>
      ) : null}
    </>
  );
}

function CanvasHeader({
  canGoBack,
  onBack,
  onClose,
  title,
  subtitle,
  openAlexId,
}: {
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  title: string;
  subtitle: string;
  openAlexId: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              {subtitle}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              {title}
            </h2>
            {openAlexId ? (
              <p className="mt-1 text-xs font-semibold text-slate-400">
                OpenAlex · {openAlexId}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CanvasFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4">
      {children}
    </div>
  );
}

function CanvasLoadingState({
  canGoBack,
  onBack,
  onClose,
}: {
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <CanvasHeader
        canGoBack={canGoBack}
        onBack={onBack}
        onClose={onClose}
        title="Loading"
        subtitle="Entity"
        openAlexId=""
      />
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <p className="text-sm font-semibold text-slate-500">
          Loading entity data...
        </p>
      </div>
    </>
  );
}

function CanvasErrorState({
  canGoBack,
  message,
  onBack,
  onClose,
}: {
  canGoBack: boolean;
  message: string;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <CanvasHeader
        canGoBack={canGoBack}
        onBack={onBack}
        onClose={onClose}
        title="Entity"
        subtitle="Error"
        openAlexId=""
      />
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <p className="text-sm font-semibold text-rose-600">{message}</p>
      </div>
    </>
  );
}

function SectionCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 space-y-4">{children}</div>
    </article>
  );
}

function SummaryGrid({ items }: { items: SummaryItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="flex items-center justify-between gap-4 text-sm"
        >
          <span className="font-semibold text-slate-600">{item.label}</span>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
            >
              {item.value}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-right font-semibold text-slate-900">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function StatsGrid({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {item.label}
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function TagList({
  items,
  tone,
}: {
  items: string[];
  tone: "default" | "topic";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <MetadataBadge key={item} tone={tone} label={item} />
      ))}
    </div>
  );
}

function EntityList({ items }: { items: EntityRef[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <EntityCanvasLink
          key={`${item.type}-${item.id}`}
          entityId={item.id}
          entityType={item.type}
          className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <Link2 className="h-4 w-4" />
          {item.label}
        </EntityCanvasLink>
      ))}
    </div>
  );
}

function WorkList({ items }: { items: WorkItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <EntityCanvasLink
            entityId={item.id}
            entityType="work"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            {item.title}
          </EntityCanvasLink>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            {item.year ? <span>{item.year}</span> : null}
            {item.citations !== null && item.citations !== undefined ? (
              <span>{formatCompactNumber(item.citations)} citations</span>
            ) : null}
            {item.pdfUrl ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                <FileText className="h-3.5 w-3.5" />
                PDF
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickLinksList({
  items,
}: {
  items: Array<{ label: string; value: string; href?: string }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <span className="font-semibold text-slate-700">{item.label}</span>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
            >
              {item.value}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="font-semibold text-slate-500">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function buildEntityCanvasState(
  entity: OpenAlexEntity,
  entityType: EntityType,
  topWorks: WorkItem[],
  fallbackTitle?: string,
) {
  const displayName =
    getString(entity.display_name) ||
    getString(entity.name) ||
    getString(entity.title) ||
    fallbackTitle ||
    "Unknown entity";
  const openAlexId = normalizeOpenAlexId(getOpenAlexEntityId(entity));

  const overviewItems: SummaryItem[] = [];
  const keyStats: SummaryItem[] = [];
  const activityItems: SummaryItem[] = [];
  const quickLinks: Array<{ label: string; value: string; href?: string }> = [];

  const orcid = getString(entity.orcid) || getString(getIds(entity).orcid);
  const openAlexUrl = getOpenAlexEntityUrl(openAlexId);
  const homepage = getString(entity.homepage_url) || getString(entity.homepage);
  const updatedDate = formatDateLabel(getString(entity.updated_date));
  const createdDate = formatDateLabel(getString(entity.created_date));

  const summaryStats = asRecord(entity.summary_stats);
  const hIndex = getNumber(summaryStats?.h_index);
  const i10Index = getNumber(summaryStats?.i10_index);
  const meanCitedness = getNumber(summaryStats?.["2yr_mean_citedness"]);

  const worksCount = getNumber(entity.works_count);
  const citedByCount = getNumber(entity.cited_by_count);

  const countsByYear = normalizeCountsByYear(entity.counts_by_year);
  const mostActive = findMostActiveYear(countsByYear);
  const mostRecent = countsByYear[0];

  const topics = extractEntityLabels(
    entity.topics || entity.x_concepts || entity.concepts,
  );
  const fields = extractFieldLabels(entity, topics);

  const institutions = extractInstitutionRefs(entity);
  const relatedEntities = extractRelatedEntities(entity, entityType);

  const description = getString(entity.description);
  const observedNames = extractEntityLabels(
    entity.display_name_alternatives || entity.observed_names,
  );

  if (displayName) {
    overviewItems.push({ label: "Display name", value: displayName });
  }
  if (orcid) {
    overviewItems.push({
      label: "ORCID",
      value: normalizeOrcidLabel(orcid),
      href: normalizeOrcidUrl(orcid),
    });
  }
  if (observedNames.length > 0) {
    overviewItems.push({
      label: "Observed names",
      value: observedNames.join(", "),
    });
  }
  const currentInstitution = getInstitutionLabel(entity.last_known_institution);
  if (currentInstitution) {
    overviewItems.push({ label: "Current institution", value: currentInstitution });
  }
  const pastInstitutions = institutions
    .filter((institution) => institution.label !== currentInstitution)
    .map((institution) => institution.label);
  if (pastInstitutions.length > 0) {
    overviewItems.push({
      label: "Past institutions",
      value: pastInstitutions.join(", "),
    });
  }
  if (openAlexId) {
    overviewItems.push({
      label: "OpenAlex ID",
      value: openAlexId,
      href: openAlexUrl || undefined,
    });
  }

  if (worksCount !== null) {
    keyStats.push({ label: "Works count", value: formatFullNumber(worksCount) });
  }
  if (citedByCount !== null) {
    keyStats.push({
      label: "Citations count",
      value: formatFullNumber(citedByCount),
    });
  }
  if (hIndex !== null) {
    keyStats.push({ label: "H-index", value: formatFullNumber(hIndex) });
  }
  if (i10Index !== null) {
    keyStats.push({ label: "I10-index", value: formatFullNumber(i10Index) });
  }
  if (meanCitedness !== null) {
    keyStats.push({
      label: "2-yr mean citedness",
      value: formatDecimalValue(meanCitedness),
    });
  }

  if (mostActive) {
    activityItems.push({
      label: "Most active year",
      value: String(mostActive.year),
    });
  }
  if (mostRecent?.year && mostRecent.worksCount !== null) {
    activityItems.push({
      label: "Recent works",
      value: `${mostRecent.year} · ${formatFullNumber(mostRecent.worksCount)} works`,
    });
  }
  if (worksCount !== null) {
    activityItems.push({
      label: "Total works",
      value: formatFullNumber(worksCount),
    });
  }

  if (openAlexUrl) {
    quickLinks.push({
      label: "OpenAlex",
      value: "View",
      href: openAlexUrl,
    });
  }
  if (orcid) {
    quickLinks.push({
      label: "ORCID",
      value: "View",
      href: normalizeOrcidUrl(orcid),
    });
  }
  if (homepage) {
    quickLinks.push({
      label: "Homepage",
      value: "Visit",
      href: homepage,
    });
  }
  if (updatedDate) {
    quickLinks.push({ label: "Updated date", value: updatedDate });
  }
  if (createdDate) {
    quickLinks.push({ label: "Created date", value: createdDate });
  }

  return {
    activityItems,
    description: description || "",
    fields,
    institutions,
    keyStats,
    openAlexId,
    overviewItems,
    quickLinks,
    relatedEntities,
    relatedEntitiesTitle:
      entityType === "author" ? "Related Authors" : "Related Topics",
    title: displayName,
    topWorks,
    topics,
  };
}

function buildWorksFilter(entityType: EntityType, entityId: string) {
  const normalizedId = normalizeOpenAlexId(entityId);

  switch (entityType) {
    case "author":
      return `authorships.author.id:${normalizedId}`;
    case "topic":
      return `topics.id:${normalizedId}`;
    case "institution":
      return `authorships.institutions.id:${normalizedId}`;
    case "source":
      return `primary_location.source.id:${normalizedId}`;
    case "work":
      return "";
    default:
      return "";
  }
}

function mapWorks(works: OpenAlexWorkListItem[]) {
  return works
    .map((work) => {
      const title =
        getString(work.display_name) ||
        getString(work.title) ||
        "Untitled work";
      const id = normalizeOpenAlexId(
        getString(getIds(work).openalex) || getString(work.id),
      );

      if (!id) {
        return null;
      }

      return {
        citations: getNumber(work.cited_by_count),
        id,
        pdfUrl: resolveWorkPdfUrl(work),
        title,
        year: getNumber(work.publication_year),
      } as WorkItem;
    })
    .filter(Boolean) as WorkItem[];
}

function resolveWorkPdfUrl(work: OpenAlexWorkListItem) {
  const primaryLocation = asRecord(work.primary_location);
  const bestOaLocation = asRecord(work.best_oa_location);
  const contentUrls = asRecord(work.content_urls);

  const candidates = [
    getString(bestOaLocation?.pdf_url),
    getString(primaryLocation?.pdf_url),
    getString(contentUrls?.pdf),
  ];

  return candidates.find(Boolean) || null;
}

function extractEntityLabels(list: unknown): string[] {
  return asArray(list)
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      const record = asRecord(item);
      return (
        getString(record?.display_name) ||
        getString(record?.name) ||
        getString(record?.label)
      );
    })
    .filter(Boolean);
}

function extractFieldLabels(entity: OpenAlexEntity, topicNames: string[]) {
  const fields: string[] = [];

  const domain = getInstitutionLabel(entity.domain);
  const field = getInstitutionLabel(entity.field);
  const subfield = getInstitutionLabel(entity.subfield);

  if (subfield) {
    fields.push(subfield);
  }
  if (field) {
    fields.push(field);
  }
  if (domain) {
    fields.push(domain);
  }

  if (fields.length === 0 && topicNames.length > 0) {
    return topicNames.slice(0, 6);
  }

  return uniqueStrings(fields);
}

function extractInstitutionRefs(entity: OpenAlexEntity): EntityRef[] {
  const institutions: EntityRef[] = [];
  const seen = new Set<string>();

  const lastInstitution = asRecord(entity.last_known_institution);
  const lastInstitutionRef = toEntityRef(lastInstitution, "institution");
  if (lastInstitutionRef && !seen.has(lastInstitutionRef.id)) {
    institutions.push(lastInstitutionRef);
    seen.add(lastInstitutionRef.id);
  }

  const affiliations = asArray(entity.affiliations);
  affiliations.forEach((affiliation) => {
    const record = asRecord(affiliation);
    const institution = asRecord(record?.institution) || record;
    const ref = toEntityRef(institution, "institution");
    if (ref && !seen.has(ref.id)) {
      institutions.push(ref);
      seen.add(ref.id);
    }
  });

  const pastInstitutions = asArray(entity.past_institutions);
  pastInstitutions.forEach((item) => {
    const ref = toEntityRef(asRecord(item) || item, "institution");
    if (ref && !seen.has(ref.id)) {
      institutions.push(ref);
      seen.add(ref.id);
    }
  });

  return institutions;
}

function extractRelatedEntities(
  entity: OpenAlexEntity,
  entityType: EntityType,
): EntityRef[] {
  const relatedItems =
    entityType === "author"
      ? entity.related_authors || entity.related_authorships
      : entity.related_topics || entity.related_concepts || entity.siblings;

  const refs = asArray(relatedItems)
    .map((item) => toEntityRef(asRecord(item) || item, entityType))
    .filter(Boolean) as EntityRef[];

  return refs.slice(0, 6);
}

function toEntityRef(item: unknown, type: EntityType): EntityRef | null {
  const record = asRecord(item);
  if (!record) {
    return null;
  }

  const id = normalizeOpenAlexId(
    getString(getIds(record).openalex) || getString(record.id),
  );
  const label =
    getString(record.display_name) ||
    getString(record.name) ||
    getString(record.label);

  if (!id || !label) {
    return null;
  }

  return { id, label, type };
}

function normalizeCountsByYear(list: unknown) {
  return asArray(list)
    .map((item) => {
      const record = asRecord(item);
      if (!record) {
        return null;
      }

      const year = getNumber(record.year);
      const worksCount = getNumber(record.works_count);
      const citedByCount = getNumber(record.cited_by_count);

      if (!year) {
        return null;
      }

      return {
        citedByCount,
        worksCount,
        year,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right!.year - left!.year) as Array<{
    year: number;
    worksCount: number | null;
    citedByCount: number | null;
  }>;
}

function findMostActiveYear(
  counts: Array<{ year: number; worksCount: number | null }>,
) {
  let best: { year: number; worksCount: number | null } | null = null;

  for (const entry of counts) {
    if (entry.worksCount === null) {
      continue;
    }

    if (!best || (best.worksCount ?? 0) < entry.worksCount) {
      best = entry;
    }
  }

  return best;
}

function getIds(entity: Record<string, unknown>) {
  return (asRecord(entity.ids) || {}) as Record<string, unknown>;
}

function getOpenAlexEntityId(entity: OpenAlexEntity) {
  return getString(getIds(entity).openalex) || getString(entity.id);
}

function getInstitutionLabel(value: unknown) {
  const record = asRecord(value);
  if (!record) {
    return "";
  }

  return (
    getString(record.display_name) ||
    getString(record.name) ||
    getString(record.label)
  );
}

function normalizeOrcidLabel(value: string) {
  return value.replace(/^https?:\/\/orcid\.org\//i, "");
}

function normalizeOrcidUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalized = normalizeOrcidLabel(value).trim();
  if (!normalized) {
    return "";
  }

  return `https://orcid.org/${normalized}`;
}

function formatDateLabel(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDecimalValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function uniqueStrings(items: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  items.forEach((item) => {
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    result.push(normalized);
  });

  return result;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return value;
}
