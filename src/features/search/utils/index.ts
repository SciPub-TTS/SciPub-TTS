import { currentYear, minimumYear } from "../constants";
import type { PaperResult, SavedSearch, SearchFilters } from "../types";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullNumberFormatter = new Intl.NumberFormat("en");

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

export function formatFullNumber(value: number) {
  return fullNumberFormatter.format(value);
}

export function formatLatestUpdate(minutesAgo: number) {
  if (minutesAgo < 1) return "just now";

  return `${minutesAgo} min ago`;
}

export function formatResponseTime(seconds: number) {
  return `${seconds.toFixed(2)}s`;
}

export function hasInvalidYearRange(filters: SearchFilters) {
  if (filters.yearMode === "exact") {
    if (!filters.yearExact) return false;

    const exactYear = Number(filters.yearExact);

    return exactYear < minimumYear || exactYear > currentYear;
  }

  const from = filters.yearFrom ? Number(filters.yearFrom) : null;
  const to = filters.yearTo ? Number(filters.yearTo) : null;

  if (from !== null && (from < minimumYear || from > currentYear)) return true;
  if (to !== null && (to < minimumYear || to > currentYear)) return true;
  if (from !== null && to !== null && from > to) return true;

  return false;
}

export function hasInvalidCitationRange(filters: SearchFilters) {
  if (filters.citationMode !== "range") return false;
  if (!filters.citationMin || !filters.citationMax) return false;

  return Number(filters.citationMin) > Number(filters.citationMax);
}

export function countActiveFilters(filters: SearchFilters) {
  return [
    Boolean(
      filters.yearMode === "exact"
        ? filters.yearExact
        : filters.yearFrom || filters.yearTo,
    ),
    filters.type.length > 0,
    filters.openAccess,
    filters.subField.length > 0,
    filters.author.length > 0,
    filters.institution.length > 0,
    filters.pdf,
    filters.country.length > 0,
    Boolean(
      filters.citationMode === "exact"
        ? filters.citationExact
        : filters.citationMin || filters.citationMax,
    ),
    filters.source.length > 0,
    filters.award.length > 0,
    Boolean(filters.indexedByOrcid),
  ].filter(Boolean).length;
}

export function buildAppliedFilterSummary(filters: SearchFilters) {
  const summary: string[] = [];

  if (filters.yearMode === "exact" && filters.yearExact) {
    summary.push(`Year: ${filters.yearExact}`);
  }

  if (filters.yearMode === "range" && (filters.yearFrom || filters.yearTo)) {
    summary.push(
      `Year: ${filters.yearFrom || minimumYear}-${filters.yearTo || currentYear}`,
    );
  }

  if (filters.type.length) summary.push(`Type: ${filters.type.join(", ")}`);
  if (filters.openAccess) summary.push("Open Access");
  if (filters.subField.length) {
    summary.push(`SubField: ${filters.subField.join(", ")}`);
  }
  if (filters.author.length) summary.push(`Author: ${filters.author.join(", ")}`);
  if (filters.institution.length) {
    summary.push(`Institution: ${filters.institution.join(", ")}`);
  }
  if (filters.pdf) summary.push("PDF");
  if (filters.country.length) summary.push(`Country: ${filters.country.join(", ")}`);

  if (filters.citationMode === "exact" && filters.citationExact) {
    summary.push(`Citation: ${filters.citationExact}`);
  }

  if (
    filters.citationMode === "range" &&
    (filters.citationMin || filters.citationMax)
  ) {
    summary.push(
      `Citation: ${filters.citationMin || 0}-${filters.citationMax || "max"}`,
    );
  }

  if (filters.source.length) summary.push(`Source: ${filters.source.join(", ")}`);
  if (filters.award.length) summary.push(`Award: ${filters.award.join(", ")}`);
  if (filters.indexedByOrcid) summary.push(`ORCID: ${filters.indexedByOrcid}`);

  return summary;
}

export function getVisibleSearchSuggestions(
  savedSearches: SavedSearch[],
  keyword: string,
  showAll: boolean,
) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const matchedSearches = normalizedKeyword
    ? savedSearches.filter((savedSearch) =>
        savedSearch.query.toLowerCase().includes(normalizedKeyword),
      )
    : savedSearches;

  return showAll ? matchedSearches : matchedSearches.slice(0, 5);
}

export function filterPaperResults(papers: PaperResult[], keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) return papers;

  return papers.filter((paper) =>
    [paper.title, paper.abstract, paper.fullText].some((searchableText) =>
      searchableText.toLowerCase().includes(normalizedKeyword),
    ),
  );
}
