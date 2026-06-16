import { formatFullNumber } from "@/features/search/utils";

import type {
  OpenAlexCountByYear,
  OpenAlexLocation,
  OpenAlexWorkDetailApi,
  PaperDetailImpactChartItem,
  PaperDetailImpactPieChartItem,
  PaperDetailMetric,
  PaperDetailQuickLink,
} from "../types";
import {
  formatCitationPercentile,
  formatDecimalValue,
  formatHostnameLabel,
  normalizePubmedUrl,
} from "./paperDetailShared";

export function buildMetrics(
  work: OpenAlexWorkDetailApi,
  authorCount: number,
  institutionCount: number,
) {
  const percentile = work.citation_normalized_percentile;
  const items: PaperDetailMetric[] = [
    {
      label: "FWCI",
      value: formatDecimalValue(work.fwci),
    },
    {
      label: "Citations",
      value: formatFullNumber(work.cited_by_count || 0),
    },
    {
      label: "Citation percentile",
      value: formatCitationPercentile(percentile?.value),
    },
    {
      label: "Referenced works",
      value: formatFullNumber(work.referenced_works_count || 0),
    },
    {
      label: "Related works",
      value: formatFullNumber(work.related_works.length),
    },
    {
      label: "Locations",
      value: formatFullNumber(work.locations_count || 0),
    },
    {
      label: "Authors",
      value: formatFullNumber(authorCount),
    },
    {
      label: "Institutions",
      value: formatFullNumber(institutionCount),
    },
  ];

  return items.filter((item) => item.value.trim().length > 0);
}

export function buildImpactChartItems(
  countsByYear: OpenAlexCountByYear[],
): PaperDetailImpactChartItem[] {
  return [...countsByYear]
    .filter(
      (entry) =>
        Number.isFinite(entry.year) && Number.isFinite(entry.cited_by_count),
    )
    .sort((leftEntry, rightEntry) => leftEntry.year - rightEntry.year)
    .map((entry) => ({
      citations: entry.cited_by_count,
      year: entry.year,
    }));
}

export function buildImpactPieChartItems(
  locations: OpenAlexLocation[],
): PaperDetailImpactPieChartItem[] {
  let openAccessLocationCount = 0;
  let restrictedLocationCount = 0;

  for (const location of locations) {
    if (location.is_oa) {
      openAccessLocationCount += 1;
      continue;
    }

    restrictedLocationCount += 1;
  }

  const items: PaperDetailImpactPieChartItem[] = [];

  if (openAccessLocationCount > 0) {
    items.push({
      color: "#3c8534",
      label: "OA locations",
      value: openAccessLocationCount,
    });
  }

  if (restrictedLocationCount > 0) {
    items.push({
      color: "#9a6700",
      label: "Restricted locations",
      value: restrictedLocationCount,
    });
  }

  return items;
}

export function buildQuickLinks(work: OpenAlexWorkDetailApi) {
  const seenLinks = new Set<string>();

  return buildQuickLinkCandidates(work)
    .map((candidate) => buildQuickLink(candidate.label, candidate.href, seenLinks))
    .filter((link): link is PaperDetailQuickLink => Boolean(link));
}

function buildQuickLink(
  label: string,
  href: string | null | undefined,
  seenLinks: Set<string>,
) {
  const normalizedHref = href?.trim();

  if (!normalizedHref) {
    return {
      href: null,
      label,
      value: "Not available",
    };
  }

  const dedupeKey = normalizedHref.toLowerCase();

  if (seenLinks.has(dedupeKey)) {
    return null;
  }

  seenLinks.add(dedupeKey);

  return {
    href: normalizedHref,
    label,
    value: formatHostnameLabel(normalizedHref),
  };
}

function buildQuickLinkCandidates(work: OpenAlexWorkDetailApi) {
  return [
    { label: "OpenAlex", href: work.ids?.openalex || work.id },
    { label: "PubMed", href: normalizePubmedUrl(work.ids?.pmid) },
    {
      label: "View Source",
      href:
        work.primary_location?.landing_page_url ||
        work.best_oa_location?.landing_page_url ||
        null,
    },
    { label: "Open Access Link", href: work.open_access?.oa_url || null },
  ];
}
