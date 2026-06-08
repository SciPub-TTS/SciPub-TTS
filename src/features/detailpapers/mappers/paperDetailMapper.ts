import type {
  OpenAlexWorkReferenceApi,
  OpenAlexWorkDetailApi,
  PaperDetailData,
} from "../types";
import {
  buildAccessItems,
  buildAwardLabels,
  resolveWorkPdfUrl,
} from "./paperDetailAccessMapper";
import {
  mapAuthors,
  mapCountries,
  mapInstitutions,
  mapNamedEntityToDetailRef,
  mapTopics,
} from "./paperDetailContributorsMapper";
import { buildHeaderBadges } from "./paperDetailHeaderMapper";
import {
  buildImpactChartItems,
  buildImpactPieChartItems,
  buildMetrics,
  buildQuickLinks,
} from "./paperDetailMetricsMapper";
import {
  extractLastSegment,
  formatLanguageLabel,
  formatPublishedLabel,
  formatTypeLabel,
  normalizeIdentifierLabel,
  normalizeOpenAlexWorkId,
  reconstructAbstractText,
} from "./paperDetailShared";

export function mapWorkDetailToPaperDetail(
  work: OpenAlexWorkDetailApi,
): PaperDetailData {
  const normalizedTitle = work.title?.trim() || "Untitled work";
  const normalizedType = formatTypeLabel(
    work.type || work.primary_location?.raw_type || "work",
  );
  const normalizedSourceName =
    work.primary_location?.source?.display_name?.trim() || "Unknown source";
  const normalizedSourceType = formatTypeLabel(
    work.primary_location?.source?.type || "source",
  );
  const abstractText =
    reconstructAbstractText(work.abstract_inverted_index) ||
    "No abstract available.";
  const authors = mapAuthors(work.authorships);
  const institutions = mapInstitutions(work.authorships);
  const countries = mapCountries(work.authorships);
  const publishedLabel = formatPublishedLabel(
    work.publication_year,
    work.publication_date,
  );
  const languageLabel = formatLanguageLabel(work.language);
  const doiLabel = normalizeIdentifierLabel(work.doi);
  const doiHref = work.doi?.trim() || null;
  const headerBadges = buildHeaderBadges(work, normalizedType);
  const accessItems = buildAccessItems(work, normalizedSourceName);
  const awards = buildAwardLabels(work.awards);
  const impactChartItems = buildImpactChartItems(work.counts_by_year);
  const impactPieChartItems = buildImpactPieChartItems(work.locations);
  const items = buildMetrics(work, authors.length, institutions.length);
  const quickLinks = buildQuickLinks(work);
  const pdfUrl = resolveWorkPdfUrl(work);
  const referencedWorks = mapWorkLinks(
    work.referenced_work_details,
    work.referenced_works,
  );
  const relatedWorks = mapWorkLinks(
    work.related_work_details,
    work.related_works,
  );
  const source = mapNamedEntityToDetailRef(
    work.primary_location?.source || work.best_oa_location?.source,
    "source",
  );
  const topics = mapTopics(work);
  const keywords = work.keywords
    .map((keyword) => keyword.display_name?.trim() || "")
    .filter(Boolean)
    .slice(0, 8);

  return {
    abstractText,
    accessItems,
    authors,
    awards,
    doiHref,
    doiLabel,
    headerBadges,
    impactChartItems,
    impactPieChartItems,
    indexedIn: work.indexed_in,
    institutions,
    countries,
    keywords,
    languageLabel,
    items,
    pdfUrl,
    publishedLabel,
    quickLinks,
    referencedWorks,
    relatedWorks,
    source,
    sourceHostOrganization:
      work.primary_location?.source?.host_organization_name?.trim() || null,
    sourceName: normalizedSourceName,
    sourceType: normalizedSourceType,
    title: normalizedTitle,
    topics,
  };
}

function mapWorkLinks(
  workReferences: OpenAlexWorkReferenceApi[] | undefined,
  fallbackWorkIds: string[],
) {
  if (workReferences && workReferences.length > 0) {
    return dedupeWorkLinks(
      workReferences
      .map((workReference) => {
        const workId = extractLastSegment(workReference.id);
        if (!workId) {
          return null;
        }

        const workTitle = workReference.title?.trim();

        return {
          id: workId,
          label: workTitle || normalizeOpenAlexWorkId(workId),
        };
      })
      .filter((workReference): workReference is { id: string; label: string } =>
        Boolean(workReference),
      ),
    );
  }

  return dedupeWorkLinks(
    fallbackWorkIds
    .map((workId) => extractLastSegment(workId))
    .filter(Boolean)
    .map((workId) => ({
      id: workId,
      label: normalizeOpenAlexWorkId(workId),
    })),
  );
}

function dedupeWorkLinks(workLinks: Array<{ id: string; label: string }>) {
  const uniqueLinks = new Map<string, { id: string; label: string }>();

  for (const workLink of workLinks) {
    const normalizedKey = normalizeWorkLinkLabel(workLink.label);

    if (normalizedKey && !uniqueLinks.has(normalizedKey)) {
      uniqueLinks.set(normalizedKey, workLink);
      continue;
    }

    if (!normalizedKey && !uniqueLinks.has(workLink.id)) {
      uniqueLinks.set(workLink.id, workLink);
    }
  }

  return [...uniqueLinks.values()];
}

function normalizeWorkLinkLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
