import { mockSearchYearRange } from "../services";
import type { PaperResult, SavedSearch, SearchFilters } from "../types";

const { currentYear, minimumYear } = mockSearchYearRange;

// Reuse formatter instances instead of creating them on every render.
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

export function countActiveFilters(filters: SearchFilters) {
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

export function buildAppliedFilterSummary(filters: SearchFilters) {
  const summary: string[] = [];

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

export function getVisibleSearchSuggestions(
  savedSearches: SavedSearch[],
  keyword: string,
  showAll: boolean,
) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  let matchedSearches = savedSearches;

  // Empty keyword shows all saved searches; typed keyword filters them.
  if (normalizedKeyword) {
    matchedSearches = savedSearches.filter((savedSearch) =>
      savedSearchMatchesKeyword(savedSearch, normalizedKeyword),
    );
  }

  return showAll ? matchedSearches : matchedSearches.slice(0, 5);
}

export function filterPaperResults(papers: PaperResult[], keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return papers;
  }

  return papers.filter((paper) => paperMatchesKeyword(paper, normalizedKeyword));
}

export function sortPaperResults(
  papers: PaperResult[],
  selectedSort: string,
) {
  // Copy before sorting because Array.sort mutates the original array.
  const sortedPapers = [...papers];

  if (selectedSort === "Most cited") {
    return sortPapersByCitationCount(sortedPapers);
  }

  if (selectedSort === "Latest") {
    return sortPapersByPublishedYear(sortedPapers);
  }

  if (selectedSort === "Trending") {
    return sortPapersByTrendScore(sortedPapers);
  }

  return sortPapersByCitationCount(sortedPapers);
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
    const citationMin = filters.citationMin || 0;
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

function savedSearchMatchesKeyword(
  savedSearch: SavedSearch,
  normalizedKeyword: string,
) {
  return savedSearch.query.toLowerCase().includes(normalizedKeyword);
}

function paperMatchesKeyword(paper: PaperResult, normalizedKeyword: string) {
  const searchableFields = [paper.title, paper.abstract, paper.fullText];

  // A manual loop is easier to step through than nested array callbacks.
  for (const searchableText of searchableFields) {
    if (searchableText.toLowerCase().includes(normalizedKeyword)) {
      return true;
    }
  }

  return false;
}

function sortPapersByCitationCount(papers: PaperResult[]) {
  return papers.sort((firstPaper, secondPaper) => {
    return secondPaper.citations - firstPaper.citations;
  });
}

function sortPapersByPublishedYear(papers: PaperResult[]) {
  return papers.sort((firstPaper, secondPaper) => {
    return secondPaper.year - firstPaper.year;
  });
}

function sortPapersByTrendScore(papers: PaperResult[]) {
  return papers.sort((firstPaper, secondPaper) => {
    const firstTrendScore = getPaperTrendScore(firstPaper);
    const secondTrendScore = getPaperTrendScore(secondPaper);

    return secondTrendScore - firstTrendScore;
  });
}

function getPaperTrendScore(paper: PaperResult) {
  let trendScore = paper.growthPercent;

  if (paper.isTrendTopic) {
    trendScore += 100;
  }

  return trendScore;
}

/*
SEARCH_FILE_NOTE
Syntax su dung:
- File index trong module search dung de gom export hoac constants/types.
File nay lam gi:
- Giu vai tro diem tap trung import/export trong tung folder.
Flow chay:
- Cac file khac import tu index de gon duong dan va de maintain.
*/

