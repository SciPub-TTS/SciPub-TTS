import { SEARCH_MIN_YEAR } from "../constants";
import type {
  SearchFilterOptions,
  SearchSortDirection,
  SearchSortState,
  SearchSortBy,
  SearchTrendingMode,
  SearchYearRange,
} from "../types";
import type {
  SearchOptionValueLookup,
  SearchResultSortGroup,
  SearchResultSortGroupKey,
} from "./types";

export const searchTabs = ["Works"];

export const defaultSearchSortState: SearchSortState = {
  sortBy: "relevance",
  sortDirection: "desc",
  trendingMode: "none",
};

export const searchResultSortGroups: SearchResultSortGroup[] = [
  {
    key: "citation",
    label: "Citation",
    options: [
      { value: "citation_most_cited", label: "Most cited" },
      { value: "citation_least_cited", label: "Least cited" },
    ],
  },
  {
    key: "published",
    label: "Published",
    options: [
      { value: "published_latest", label: "Latest" },
      { value: "published_oldest", label: "Oldest" },
    ],
  },
  {
    key: "trending",
    label: "Trending",
    disabled: true,
    options: [
      { value: "trending_keyword", label: "By keyword" },
      { value: "trending_topic", label: "By topic" },
      { value: "trending_both", label: "Both" },
    ],
  },
];

export const mockSuggestedSearches = [
  "Topic 1",
  "Topic 2",
  "Topic 3",
  "Topic 4",
  "Topic 5",
  "Topic 6",
  "Topic 7",
];

export const emptySearchFilterOptions: SearchFilterOptions = {
  type: [],
  subField: [],
  author: [],
  institution: [],
  country: [],
  source: [],
  award: [],
};

export const mockSearchYearRange: SearchYearRange = {
  minimumYear: SEARCH_MIN_YEAR,
  currentYear: new Date().getFullYear(),
};

export const emptySearchOptionValueLookup: SearchOptionValueLookup = {
  type: {},
  subField: {},
  author: {},
  institution: {},
  country: {},
  source: {},
  award: {},
};

export function hasActiveSearchSort(sortState: SearchSortState) {
  return (
    sortState.trendingMode !== "none"
    || sortState.sortBy !== defaultSearchSortState.sortBy
    || sortState.sortDirection !== defaultSearchSortState.sortDirection
  );
}

export function normalizeSearchSortState(
  value?: Partial<SearchSortState> | string[] | string | null,
): SearchSortState {
  if (!value) {
    return { ...defaultSearchSortState };
  }

  if (Array.isArray(value) || typeof value === "string") {
    return normalizeLegacySearchSortState(value);
  }

  return {
    sortBy: normalizeSortBy(value.sortBy),
    sortDirection: normalizeSortDirection(value.sortDirection),
    trendingMode: normalizeTrendingMode(value.trendingMode),
  };
}

export function createSearchSortStateFromOption(
  sortOption: string,
): SearchSortState {
  switch (sortOption.trim().toLowerCase()) {
    case "citation_most_cited":
      return {
        sortBy: "citation",
        sortDirection: "desc",
        trendingMode: "none",
      };
    case "citation_least_cited":
      return {
        sortBy: "citation",
        sortDirection: "asc",
        trendingMode: "none",
      };
    case "published_latest":
      return {
        sortBy: "published",
        sortDirection: "desc",
        trendingMode: "none",
      };
    case "published_oldest":
      return {
        sortBy: "published",
        sortDirection: "asc",
        trendingMode: "none",
      };
    case "trending_keyword":
      return {
        ...defaultSearchSortState,
        trendingMode: "keyword",
      };
    case "trending_topic":
      return {
        ...defaultSearchSortState,
        trendingMode: "topic",
      };
    case "trending_both":
      return {
        ...defaultSearchSortState,
        trendingMode: "both",
      };
    default:
      return { ...defaultSearchSortState };
  }
}

export function getSearchSortOptionValue(
  sortState: SearchSortState,
  groupKey: SearchResultSortGroupKey,
) {
  if (groupKey === "citation" && sortState.sortBy === "citation") {
    return sortState.sortDirection === "asc"
      ? "citation_least_cited"
      : "citation_most_cited";
  }

  if (groupKey === "published" && sortState.sortBy === "published") {
    return sortState.sortDirection === "asc"
      ? "published_oldest"
      : "published_latest";
  }

  if (groupKey === "trending") {
    if (sortState.trendingMode === "keyword") {
      return "trending_keyword";
    }

    if (sortState.trendingMode === "topic") {
      return "trending_topic";
    }

    if (sortState.trendingMode === "both") {
      return "trending_both";
    }
  }

  return "";
}

function normalizeLegacySearchSortState(values: string[] | string) {
  const rawValues = Array.isArray(values) ? values : [values];

  for (const value of rawValues) {
    const normalizedSortState = createSearchSortStateFromOption(value);

    if (hasActiveSearchSort(normalizedSortState)) {
      return normalizedSortState;
    }
  }

  return { ...defaultSearchSortState };
}

function normalizeSortBy(value?: string | null): SearchSortBy {
  const normalizedValue = value?.trim().toLowerCase();

  if (normalizedValue === "citation" || normalizedValue === "published") {
    return normalizedValue;
  }

  return "relevance";
}

function normalizeSortDirection(value?: string | null): SearchSortDirection {
  return value?.trim().toLowerCase() === "asc" ? "asc" : "desc";
}

function normalizeTrendingMode(value?: string | null): SearchTrendingMode {
  const normalizedValue = value?.trim().toLowerCase();

  if (
    normalizedValue === "keyword"
    || normalizedValue === "topic"
    || normalizedValue === "both"
  ) {
    return normalizedValue;
  }

  return "none";
}
