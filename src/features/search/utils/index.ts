import { SEARCH_MIN_CITATION } from "../constants";
import { mockSearchYearRange } from "../services";
import type {
  SearchEntityType,
  SearchFilters,
  SearchFilterWidgetKey,
} from "../types";

const { currentYear, minimumYear } = mockSearchYearRange;

// Reuse formatter instances instead of creating them on every render.
const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullNumberFormatter = new Intl.NumberFormat("en");

const searchFilterWidgetKeyMap: Record<string, SearchFilterWidgetKey> = {
  year: "year",
  type: "type",
  openaccess: "openAccess",
  subfield: "subField",
  author: "author",
  institution: "institution",
  pdf: "pdf",
  country: "country",
  primarytopic: "primaryTopic",
  field: "field",
  citation: "citation",
  citationcount: "citation",
  source: "source",
  award: "award",
  indexedbyorcid: "indexedByOrcid",
};

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

export function formatFullNumber(value: number) {
  return fullNumberFormatter.format(value);
}

export function normalizeSearchFilterWidgetKey(value: string) {
  const normalizedValue = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") as keyof typeof searchFilterWidgetKeyMap;

  return searchFilterWidgetKeyMap[normalizedValue] || null;
}

export function normalizeSearchFilterWidgetKeys(values: string[]) {
  const seen = new Set<SearchFilterWidgetKey>();
  const normalizedValues: SearchFilterWidgetKey[] = [];

  for (const value of values) {
    const normalizedValue = normalizeSearchFilterWidgetKey(value);

    if (!normalizedValue || seen.has(normalizedValue)) {
      continue;
    }

    seen.add(normalizedValue);
    normalizedValues.push(normalizedValue);
  }

  return normalizedValues;
}

export function formatLatestUpdate(minutesAgo: number) {
  if (minutesAgo < 1) {
    return "just now";
  }

  return `${minutesAgo} min ago`;
}

export function formatResponseTime(seconds: number) {
  return `${seconds.toFixed(2)}s`;
}

export function hasInvalidYearRange(filters: SearchFilters) {
  // Exact mode validates one year field.
  if (filters.yearMode === "exact") {
    if (!filters.yearExact) {
      return false;
    }

    const exactYear = Number(filters.yearExact);
    const exactYearIsBeforeMinimum = exactYear < minimumYear;
    const exactYearIsAfterCurrentYear = exactYear > currentYear;

    return exactYearIsBeforeMinimum || exactYearIsAfterCurrentYear;
  }

  const yearFrom = filters.yearFrom ? Number(filters.yearFrom) : null;
  const yearTo = filters.yearTo ? Number(filters.yearTo) : null;

  // Convert nullable values into named booleans so each rule is explicit.
  const yearFromIsFilled = yearFrom !== null;
  const yearToIsFilled = yearTo !== null;
  const yearFromIsOutOfRange =
    yearFromIsFilled && (yearFrom < minimumYear || yearFrom > currentYear);
  const yearToIsOutOfRange =
    yearToIsFilled && (yearTo < minimumYear || yearTo > currentYear);
  const yearFromIsGreaterThanYearTo =
    yearFromIsFilled && yearToIsFilled && yearFrom > yearTo;

  if (yearFromIsOutOfRange) {
    return true;
  }

  if (yearToIsOutOfRange) {
    return true;
  }

  if (yearFromIsGreaterThanYearTo) {
    return true;
  }

  return false;
}

export function hasInvalidCitationRange(filters: SearchFilters) {
  if (filters.citationMode !== "range") {
    return false;
  }

  if (!filters.citationMin || !filters.citationMax) {
    return false;
  }

  const citationMin = Number(filters.citationMin);
  const citationMax = Number(filters.citationMax);

  return citationMin > citationMax;
}

export function countActiveFilters(
  entityType: SearchEntityType,
  filters: SearchFilters,
) {
  if (entityType === "authors") {
    let activeFilterCount = 0;

    if (filters.institution.length > 0) {
      activeFilterCount += 1;
    }

    if (filters.country.length > 0) {
      activeFilterCount += 1;
    }

    if (filters.primaryTopic.length > 0) {
      activeFilterCount += 1;
    }

    return activeFilterCount;
  }

  if (entityType === "topics") {
    let activeFilterCount = 0;

    if (filters.subField.length > 0) {
      activeFilterCount += 1;
    }

    if (filters.field.length > 0) {
      activeFilterCount += 1;
    }

    return activeFilterCount;
  }

  let activeFilterCount = 0;

  if (hasYearFilter(filters)) {
    activeFilterCount += 1;
  }

  if (filters.type.length > 0) {
    activeFilterCount += 1;
  }

  if (filters.openAccess) {
    activeFilterCount += 1;
  }

  if (filters.subField.length > 0) {
    activeFilterCount += 1;
  }

  if (filters.author.length > 0) {
    activeFilterCount += 1;
  }

  if (filters.institution.length > 0) {
    activeFilterCount += 1;
  }

  if (filters.pdf) {
    activeFilterCount += 1;
  }

  if (filters.country.length > 0) {
    activeFilterCount += 1;
  }

  if (hasCitationFilter(filters)) {
    activeFilterCount += 1;
  }

  if (filters.source.length > 0) {
    activeFilterCount += 1;
  }

  if (filters.award.length > 0) {
    activeFilterCount += 1;
  }

  if (filters.indexedByOrcid) {
    activeFilterCount += 1;
  }

  return activeFilterCount;
}

export function buildAppliedFilterSummary(
  entityType: SearchEntityType,
  filters: SearchFilters,
) {
  const summary: string[] = [];

  if (entityType === "authors") {
    addListFilterSummary(summary, "Institution", filters.institution);
    addListFilterSummary(summary, "Country", filters.country);
    addListFilterSummary(summary, "Primary Topic", filters.primaryTopic);
    return summary;
  }

  if (entityType === "topics") {
    addListFilterSummary(summary, "SubField", filters.subField);
    addListFilterSummary(summary, "Field", filters.field);
    return summary;
  }

  addYearSummary(summary, filters);
  addListFilterSummary(summary, "Type", filters.type);

  if (filters.openAccess) {
    summary.push("Open Access");
  }

  addListFilterSummary(summary, "SubField", filters.subField);
  addListFilterSummary(summary, "Author", filters.author);
  addListFilterSummary(summary, "Institution", filters.institution);

  if (filters.pdf) {
    summary.push("PDF");
  }

  addListFilterSummary(summary, "Country", filters.country);
  addCitationSummary(summary, filters);
  addListFilterSummary(summary, "Source", filters.source);
  addListFilterSummary(summary, "Award", filters.award);

  if (filters.indexedByOrcid) {
    summary.push(`ORCID: ${filters.indexedByOrcid}`);
  }

  return summary;
}

function hasYearFilter(filters: SearchFilters) {
  if (filters.yearMode === "exact") {
    return Boolean(filters.yearExact);
  }

  return Boolean(filters.yearFrom || filters.yearTo);
}

function hasCitationFilter(filters: SearchFilters) {
  if (filters.citationMode === "exact") {
    return Boolean(filters.citationExact);
  }

  return Boolean(filters.citationMin || filters.citationMax);
}

function addYearSummary(summary: string[], filters: SearchFilters) {
  if (filters.yearMode === "exact" && filters.yearExact) {
    summary.push(`Year: ${filters.yearExact}`);
    return;
  }

  if (filters.yearMode === "range" && hasYearFilter(filters)) {
    const yearFrom = filters.yearFrom || minimumYear;
    const yearTo = filters.yearTo || currentYear;

    summary.push(`Year: ${yearFrom}-${yearTo}`);
  }
}

function addCitationSummary(summary: string[], filters: SearchFilters) {
  if (filters.citationMode === "exact" && filters.citationExact) {
    summary.push(`Citation: ${filters.citationExact}`);
    return;
  }

  if (filters.citationMode === "range" && hasCitationFilter(filters)) {
    const citationMin = filters.citationMin || SEARCH_MIN_CITATION;
    const citationMax = filters.citationMax || "max";

    summary.push(`Citation: ${citationMin}-${citationMax}`);
  }
}

function addListFilterSummary(
  summary: string[],
  label: string,
  values: string[],
) {
  // No selected values means no summary chip for this filter.
  if (values.length === 0) {
    return;
  }

  summary.push(`${label}: ${values.join(", ")}`);
}

