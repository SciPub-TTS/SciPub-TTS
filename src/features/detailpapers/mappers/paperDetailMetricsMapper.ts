import { formatFullNumber } from "@/features/search/utils";

import type {
  OpenAlexWorkDetailApi,
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
  const isFwciPositive = work.fwci !== null && work.fwci >= 1;
  const percentileBadgeLabel = percentile?.is_in_top_1_percent
    ? "Top 1%"
    : percentile?.is_in_top_10_percent
      ? "Top 10%"
      : undefined;
  const metrics: PaperDetailMetric[] = [
    {
      badgeLabel: isFwciPositive ? "Above avg" : undefined,
      label: "FWCI",
      value: formatDecimalValue(work.fwci),
      tone: isFwciPositive ? "positive" : "default",
    },
    {
      label: "Citations",
      value: formatFullNumber(work.cited_by_count || 0),
    },
    {
      badgeLabel: percentileBadgeLabel,
      label: "Citation percentile",
      value: formatCitationPercentile(percentile?.value),
      tone: percentileBadgeLabel ? "positive" : "default",
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

  return metrics.filter((metric) => metric.value.trim().length > 0);
}

export function buildQuickLinks(work: OpenAlexWorkDetailApi) {
  const links: PaperDetailQuickLink[] = [];

  addQuickLink(links, "DOI", work.doi);
  addQuickLink(links, "OpenAlex", work.ids?.openalex || work.id);
  addQuickLink(links, "PubMed", normalizePubmedUrl(work.ids?.pmid));
  addQuickLink(
    links,
    "View Source",
    work.primary_location?.landing_page_url ||
      work.best_oa_location?.landing_page_url ||
      null,
  );
  addQuickLink(links, "Open Access Link", work.open_access?.oa_url || null);

  return links;
}

function addQuickLink(
  links: PaperDetailQuickLink[],
  label: string,
  href: string | null | undefined,
) {
  const normalizedHref = href?.trim();

  if (!normalizedHref) {
    return;
  }

  links.push({
    href: normalizedHref,
    label,
    value: formatHostnameLabel(normalizedHref),
  });
}
