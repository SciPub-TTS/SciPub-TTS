import { formatFullNumber } from "@/features/search/utils";

import type { EntityType, OpenAlexEntity, OpenAlexWorkListItem } from "./types";
import {
  getOpenAlexEntityUrl,
  normalizeOpenAlexId,
} from "./utils";

export type SummaryItem = {
  label: string;
  value: string;
  href?: string;
};

export type WorkItem = {
  citations?: number | null;
  id: string;
  pdfUrl?: string | null;
  source?: string;
  title: string;
  year?: number | null;
};

export type EntityRef = {
  id: string;
  label: string;
  type: EntityType;
};

export type EntityCanvasState = {
  activityItems: SummaryItem[];
  description: string;
  fields: string[];
  institutions: EntityRef[];
  keyStats: SummaryItem[];
  openAlexId: string;
  overviewItems: SummaryItem[];
  quickLinks: SummaryItem[];
  relatedEntities: EntityRef[];
  relatedEntitiesTitle: string;
  title: string;
  topWorks: WorkItem[];
  topics: EntityRef[];
};

export function buildEntityCanvasState(
  entity: OpenAlexEntity,
  entityType: EntityType,
  topWorks: WorkItem[],
  fallbackTitle?: string,
): EntityCanvasState {
  const displayName =
    getString(entity.display_name) ||
    getString(entity.name) ||
    getString(entity.title) ||
    fallbackTitle ||
    "Unknown entity";
  const openAlexId = normalizeOpenAlexId(getOpenAlexEntityId(entity));
  const openAlexUrl = getOpenAlexEntityUrl(openAlexId);

  const overviewItems: SummaryItem[] = [];
  const keyStats: SummaryItem[] = [];
  const activityItems: SummaryItem[] = [];
  const quickLinks: SummaryItem[] = [];

  const worksCount = getNumber(entity.works_count);
  const citedByCount = getNumber(entity.cited_by_count);
  const summaryStats = asRecord(entity.summary_stats);
  const hIndex = getNumber(summaryStats?.h_index);
  const i10Index = getNumber(summaryStats?.i10_index);
  const meanCitedness = getNumber(summaryStats?.["2yr_mean_citedness"]);
  const countsByYear = normalizeCountsByYear(entity.counts_by_year);
  const mostActive = findMostActiveYear(countsByYear);
  const mostRecent = countsByYear[0];
  const updatedDate = formatDateLabel(getString(entity.updated_date));
  const createdDate = formatDateLabel(getString(entity.created_date));

  const description = getString(entity.description);
  const topics = extractEntityRefs(
    entity.topics || entity.x_concepts || entity.concepts,
    "topic",
  );
  const fields = extractFieldLabels(entity, topics);
  const institutions = extractInstitutionRefs(entity);
  const relatedEntities = extractRelatedEntities(entity, entityType);
  const relatedEntitiesTitle = getRelatedEntitiesTitle(entityType);

  addGenericOverviewItems(
    overviewItems,
    entity,
    displayName,
    openAlexId,
    openAlexUrl,
  );
  addGenericStatItems(
    keyStats,
    worksCount,
    citedByCount,
    hIndex,
    i10Index,
    meanCitedness,
  );
  addGenericActivityItems(activityItems, worksCount, mostActive, mostRecent);
  addGenericQuickLinks(quickLinks, entity, openAlexUrl, updatedDate, createdDate);
  addEntityTypeSpecificOverviewItems(overviewItems, entity, entityType);
  addEntityTypeSpecificQuickLinks(quickLinks, entity, entityType);

  return {
    activityItems,
    description,
    fields,
    institutions,
    keyStats,
    openAlexId,
    overviewItems,
    quickLinks,
    relatedEntities,
    relatedEntitiesTitle,
    title: displayName,
    topWorks,
    topics,
  };
}

export function mapWorks(works: OpenAlexWorkListItem[]) {
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
        source: getEntityLabel(asRecord(asRecord(work.primary_location)?.source)),
        title,
        year: getNumber(work.publication_year),
      } satisfies WorkItem;
    })
    .filter(Boolean) as WorkItem[];
}

function addGenericOverviewItems(
  items: SummaryItem[],
  entity: OpenAlexEntity,
  displayName: string,
  openAlexId: string,
  openAlexUrl: string,
) {
  const orcid = getString(entity.orcid) || getString(getIds(entity).orcid);
  const observedNames = extractStringLabels(
    entity.display_name_alternatives || entity.observed_names,
  );
  const currentInstitution = getEntityLabel(entity.last_known_institution);
  const institutionLabels = extractInstitutionRefs(entity).map(
    (institution) => institution.label,
  );
  const pastInstitutions = institutionLabels.filter(
    (institution) => institution !== currentInstitution,
  );

  addSummaryItem(items, "Display name", displayName);

  if (orcid) {
    addSummaryItem(
      items,
      "ORCID",
      normalizeOrcidLabel(orcid),
      normalizeOrcidUrl(orcid),
    );
  }

  if (observedNames.length > 0) {
    addSummaryItem(items, "Observed names", observedNames.join(", "));
  }

  addSummaryItem(items, "Current institution", currentInstitution);

  if (pastInstitutions.length > 0) {
    addSummaryItem(items, "Past institutions", pastInstitutions.join(", "));
  }

  if (openAlexId) {
    addSummaryItem(items, "OpenAlex ID", openAlexId, openAlexUrl || undefined);
  }
}

function addGenericStatItems(
  items: SummaryItem[],
  worksCount: number | null,
  citedByCount: number | null,
  hIndex: number | null,
  i10Index: number | null,
  meanCitedness: number | null,
) {
  addSummaryItem(items, "Works count", formatMetricNumber(worksCount));
  addSummaryItem(items, "Citations count", formatMetricNumber(citedByCount));
  addSummaryItem(items, "H-index", formatMetricNumber(hIndex));
  addSummaryItem(items, "I10-index", formatMetricNumber(i10Index));
  addSummaryItem(items, "2-yr mean citedness", formatMetricDecimal(meanCitedness));
}

function addGenericActivityItems(
  items: SummaryItem[],
  worksCount: number | null,
  mostActive: { year: number; worksCount: number | null } | null,
  mostRecent:
    | {
        citedByCount: number | null;
        worksCount: number | null;
        year: number;
      }
    | undefined,
) {
  if (mostActive) {
    addSummaryItem(items, "Most active year", String(mostActive.year));
  }

  if (mostRecent?.year && mostRecent.worksCount !== null) {
    addSummaryItem(
      items,
      "Recent works",
      `${mostRecent.year} - ${formatFullNumber(mostRecent.worksCount)} works`,
    );
  }

  addSummaryItem(items, "Total works", formatMetricNumber(worksCount));
}

function addGenericQuickLinks(
  items: SummaryItem[],
  entity: OpenAlexEntity,
  openAlexUrl: string,
  updatedDate: string,
  createdDate: string,
) {
  const orcid = getString(entity.orcid) || getString(getIds(entity).orcid);
  const homepage = getString(entity.homepage_url) || getString(entity.homepage);

  if (openAlexUrl) {
    items.push({ href: openAlexUrl, label: "OpenAlex", value: "View" });
  }

  if (orcid) {
    items.push({
      href: normalizeOrcidUrl(orcid),
      label: "ORCID",
      value: "View",
    });
  }

  if (homepage) {
    items.push({ href: homepage, label: "Homepage", value: "Visit" });
  }

  addSummaryItem(items, "Updated date", updatedDate);
  addSummaryItem(items, "Created date", createdDate);
}

function addEntityTypeSpecificOverviewItems(
  items: SummaryItem[],
  entity: OpenAlexEntity,
  entityType: EntityType,
) {
  if (entityType === "institution") {
    addSummaryItem(items, "Country", getString(entity.country_code));
    addSummaryItem(items, "Type", formatValueLabel(getString(entity.type)));
    addSummaryItem(items, "ROR", normalizeIdentifierLabel(getString(entity.ror)));
  }

  if (entityType === "source") {
    addSummaryItem(items, "Source type", formatValueLabel(getString(entity.type)));
    addSummaryItem(items, "Host organization", getString(entity.host_organization_name));
    addSummaryItem(items, "ISSN-L", getString(entity.issn_l));
    addSummaryItem(items, "ISSN", extractStringLabels(entity.issn).join(", "));
  }

  if (entityType === "topic") {
    addSummaryItem(items, "Score", formatMetricDecimal(getNumber(entity.score)));
    addSummaryItem(items, "Subfield", getEntityLabel(entity.subfield));
    addSummaryItem(items, "Field", getEntityLabel(entity.field));
    addSummaryItem(items, "Domain", getEntityLabel(entity.domain));
  }
}

function addEntityTypeSpecificQuickLinks(
  items: SummaryItem[],
  entity: OpenAlexEntity,
  entityType: EntityType,
) {
  if (entityType !== "institution") {
    return;
  }

  const ror = getString(entity.ror);
  if (!ror) {
    return;
  }

  items.push({
    href: /^https?:\/\//i.test(ror) ? ror : `https://ror.org/${ror}`,
    label: "ROR",
    value: "View",
  });
}

function resolveWorkPdfUrl(work: Record<string, unknown>) {
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

function extractEntityRefs(list: unknown, type: EntityType) {
  const refs = asArray(list)
    .map((item) => toEntityRef(asRecord(item), type))
    .filter(Boolean) as EntityRef[];

  return uniqueEntityRefs(refs).slice(0, 8);
}

function extractStringLabels(list: unknown) {
  return uniqueStrings(
    asArray(list)
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        return getEntityLabel(item);
      })
      .filter(Boolean),
  );
}

function extractFieldLabels(entity: OpenAlexEntity, topicRefs: EntityRef[]) {
  const fields = [
    getEntityLabel(entity.subfield),
    getEntityLabel(entity.field),
    getEntityLabel(entity.domain),
  ].filter(Boolean);

  if (fields.length === 0) {
    return topicRefs.slice(0, 6).map((topic) => topic.label);
  }

  return uniqueStrings(fields);
}

function extractInstitutionRefs(entity: OpenAlexEntity) {
  const refs: EntityRef[] = [];

  const lastInstitution = toEntityRef(
    asRecord(entity.last_known_institution),
    "institution",
  );
  if (lastInstitution) {
    refs.push(lastInstitution);
  }

  const pastInstitutionRefs = extractEntityRefs(
    entity.past_institutions,
    "institution",
  );
  refs.push(...pastInstitutionRefs);

  const affiliations = asArray(entity.affiliations)
    .map((affiliation) => {
      const affiliationRecord = asRecord(affiliation);

      return toEntityRef(
        asRecord(affiliationRecord?.institution) || affiliationRecord,
        "institution",
      );
    })
    .filter(Boolean) as EntityRef[];

  refs.push(...affiliations);

  return uniqueEntityRefs(refs);
}

function extractRelatedEntities(entity: OpenAlexEntity, entityType: EntityType) {
  const relatedItems =
    entityType === "author"
      ? entity.related_authors || entity.related_authorships
      : entityType === "topic"
        ? entity.related_topics || entity.related_concepts || entity.siblings
        : [];

  const relatedType = entityType === "author" ? "author" : "topic";

  return extractEntityRefs(relatedItems, relatedType);
}

function getRelatedEntitiesTitle(entityType: EntityType) {
  if (entityType === "author") {
    return "Related Authors";
  }

  if (entityType === "topic") {
    return "Related Topics";
  }

  return "Related Entities";
}

function toEntityRef(item: Record<string, unknown> | null, type: EntityType) {
  if (!item) {
    return null;
  }

  const id = normalizeOpenAlexId(
    getString(getIds(item).openalex) || getString(item.id),
  );
  const label = getEntityLabel(item);

  if (!id || !label) {
    return null;
  }

  return { id, label, type } satisfies EntityRef;
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
    citedByCount: number | null;
    worksCount: number | null;
    year: number;
  }>;
}

function findMostActiveYear(
  counts: Array<{ worksCount: number | null; year: number }>,
) {
  let best: { worksCount: number | null; year: number } | null = null;

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

function addSummaryItem(
  items: SummaryItem[],
  label: string,
  value: string,
  href?: string,
) {
  if (!value.trim()) {
    return;
  }

  items.push({ href, label, value });
}

function getIds(entity: Record<string, unknown>) {
  return (asRecord(entity.ids) || {}) as Record<string, unknown>;
}

function getOpenAlexEntityId(entity: OpenAlexEntity) {
  return getString(getIds(entity).openalex) || getString(entity.id);
}

function getEntityLabel(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return typeof value === "string" ? value.trim() : "";
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

function normalizeIdentifierLabel(value: string) {
  if (!value.trim()) {
    return "";
  }

  return value
    .replace(/^https?:\/\/doi\.org\//i, "")
    .replace(/^https?:\/\/openalex\.org\//i, "")
    .replace(/^https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//i, "")
    .replace(/\/$/, "");
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

function formatMetricNumber(value: number | null) {
  return value === null || value === undefined ? "" : formatFullNumber(value);
}

function formatMetricDecimal(value: number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatValueLabel(value: string) {
  if (!value.trim()) {
    return "";
  }

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

function uniqueEntityRefs(items: EntityRef[]) {
  const seen = new Set<string>();
  const result: EntityRef[] = [];

  items.forEach((item) => {
    const key = `${item.type}:${item.id}`;
    if (!item.id || !item.label || seen.has(key)) {
      return;
    }

    seen.add(key);
    result.push(item);
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
