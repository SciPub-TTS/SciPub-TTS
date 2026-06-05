import type {
  OpenAlexWorkDetailApi,
  PaperDetailData,
} from "../types";
import { buildAccessItems, resolveWorkPdfUrl } from "./paperDetailAccessMapper";
import {
  mapAuthors,
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
  const publishedLabel = formatPublishedLabel(
    work.publication_year,
    work.publication_date,
  );
  const languageLabel = formatLanguageLabel(work.language);
  const doiLabel = normalizeIdentifierLabel(work.doi);
  const doiHref = work.doi?.trim() || null;
  const headerBadges = buildHeaderBadges(work, normalizedType);
  const accessItems = buildAccessItems(work, normalizedSourceName);
  const impactChartItems = buildImpactChartItems(work.counts_by_year);
  const impactPieChartItems = buildImpactPieChartItems(work.locations);
  const items = buildMetrics(work, authors.length, institutions.length);
  const quickLinks = buildQuickLinks(work);
  const pdfUrl = resolveWorkPdfUrl(work);
  const referencedWorks = mapWorkLinks(work.referenced_works);
  const relatedWorks = mapWorkLinks(work.related_works);
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
    doiHref,
    doiLabel,
    headerBadges,
    impactChartItems,
    impactPieChartItems,
    indexedIn: work.indexed_in,
    institutions,
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

function mapWorkLinks(workIds: string[]) {
  return workIds
    .map((workId) => extractLastSegment(workId))
    .filter(Boolean)
    .map((workId) => ({
      id: workId,
      label: normalizeOpenAlexWorkId(workId),
    }));
}
