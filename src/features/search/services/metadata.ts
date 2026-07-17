import { SEARCH_MIN_YEAR } from "../constants";
import type {
  SearchEntityType,
  SearchFilterOptions,
  SearchSortDirection,
  SearchSortState,
  SearchSortBy,
  SearchYearRange,
} from "../types";
import type {
  SearchOptionValueLookup,
  SearchResultSortGroup,
  SearchResultSortGroupKey,
} from "./types";

type SearchEntityMetadata = {
  emptyStateMessage: string;
  indexedLabel: string;
  loadingLabel: string;
  noResultsLabel: string;
  placeholder: string;
  resultLabelPlural: string;
  resultLabelSingular: string;
  searchAriaLabel: string;
  tabLabel: string;
};

const searchEntityMetadataMap: Record<SearchEntityType, SearchEntityMetadata> = {
  works: {
    emptyStateMessage:
      "Enter a keyword or choose filters, then click Search or Apply filters.",
    indexedLabel: "works indexed",
    loadingLabel: "Searching papers...",
    noResultsLabel: "No papers matched this search.",
    placeholder: "Search papers by title or abstract.",
    resultLabelPlural: "papers",
    resultLabelSingular: "paper",
    searchAriaLabel: "Search papers",
    tabLabel: "Works",
  },
  authors: {
    emptyStateMessage: "Enter an author name or apply filters, then click Search.",
    indexedLabel: "authors indexed",
    loadingLabel: "Searching authors...",
    noResultsLabel: "No authors matched this search.",
    placeholder: "Search authors by name.",
    resultLabelPlural: "authors",
    resultLabelSingular: "author",
    searchAriaLabel: "Search authors",
    tabLabel: "Authors",
  },
  topics: {
    emptyStateMessage: "Enter a topic name or apply filters, then click Search.",
    indexedLabel: "topics indexed",
    loadingLabel: "Searching topics...",
    noResultsLabel: "No topics matched this search.",
    placeholder: "Search topics by name.",
    resultLabelPlural: "topics",
    resultLabelSingular: "topic",
    searchAriaLabel: "Search topics",
    tabLabel: "Topics",
  },
};

const searchTabOrder: SearchEntityType[] = [
  "works",
  "authors",
  "topics",
];

export const searchScopeLabel =
  "Scope: Physical Sciences - Computer Science (17) and Engineering (22).";

export const searchTabs = searchTabOrder.map((entityType) => ({
  entityType,
  label: searchEntityMetadataMap[entityType].tabLabel,
}));

export const defaultSearchSortState: SearchSortState = {
  sortBy: "relevance",
  sortDirection: "desc",
  trendingMode: "none",
  citationDirection: null,
  publishedDirection: null,
};

const worksSearchResultSortGroups: SearchResultSortGroup[] = [
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
];

const entitySearchResultSortGroups: SearchResultSortGroup[] = [
  {
    key: "entity",
    label: "Sort",
    options: [
      { value: "", label: "None" },
      { value: "works_most_works", label: "Most works" },
      { value: "alphabetical_az", label: "A-Z" },
    ],
  },
];

export const emptySearchFilterOptions: SearchFilterOptions = {
  type: [],
  subField: [],
  author: [],
  institution: [],
  country: [],
  primaryTopic: [],
  field: [],
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
  primaryTopic: {},
  field: {},
  source: {},
  award: {},
};

export function getSearchEntityMetadata(entityType: SearchEntityType) {
  return searchEntityMetadataMap[entityType];
}

export function getSearchResultSortGroups(
  entityType: SearchEntityType,
) {
  return entityType === "works"
    ? worksSearchResultSortGroups
    : entitySearchResultSortGroups;
}

export function normalizeSearchTabEntityType(
  entityType: SearchEntityType | null | undefined,
): SearchEntityType {
  return searchTabOrder.includes(entityType as SearchEntityType)
    ? (entityType as SearchEntityType)
    : "works";
}

export function hasActiveSearchSort(sortState: SearchSortState) {
  return (
    sortState.sortBy !== defaultSearchSortState.sortBy
    || sortState.sortDirection !== defaultSearchSortState.sortDirection
    || Boolean(sortState.citationDirection)
    || Boolean(sortState.publishedDirection)
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

  const sortBy = normalizeSortBy(value.sortBy);
  const sortDirection = normalizeSortDirection(value.sortDirection);
  const citationDirection =
    normalizeNullableSortDirection(value.citationDirection)
    ?? (sortBy === "citation" ? sortDirection : null);
  const publishedDirection =
    normalizeNullableSortDirection(value.publishedDirection)
    ?? (sortBy === "published" ? sortDirection : null);

  return {
    sortBy,
    sortDirection,
    trendingMode: "none",
    citationDirection,
    publishedDirection,
  };
}

export function createSearchSortStateFromOption(
  sortOption: string,
): SearchSortState {
  switch (sortOption.trim().toLowerCase()) {
    case "":
    case "relevance":
      return { ...defaultSearchSortState };
    case "works_most_works":
      return {
        sortBy: "works",
        sortDirection: "desc",
        trendingMode: "none",
        citationDirection: null,
        publishedDirection: null,
      };
    case "citation_most_cited":
      return {
        sortBy: "citation",
        sortDirection: "desc",
        trendingMode: "none",
        citationDirection: "desc",
        publishedDirection: null,
      };
    case "citation_least_cited":
      return {
        sortBy: "citation",
        sortDirection: "asc",
        trendingMode: "none",
        citationDirection: "asc",
        publishedDirection: null,
      };
    case "published_latest":
      return {
        sortBy: "published",
        sortDirection: "desc",
        trendingMode: "none",
        citationDirection: null,
        publishedDirection: "desc",
      };
    case "published_oldest":
      return {
        sortBy: "published",
        sortDirection: "asc",
        trendingMode: "none",
        citationDirection: null,
        publishedDirection: "asc",
      };
    case "alphabetical_az":
      return {
        sortBy: "alphabetical",
        sortDirection: "asc",
        trendingMode: "none",
        citationDirection: null,
        publishedDirection: null,
      };
    default:
      return { ...defaultSearchSortState };
  }
}

export function updateSearchSortStateFromOption(
  currentSortState: SearchSortState,
  sortOption: string,
): SearchSortState {
  const normalizedOption = sortOption.trim().toLowerCase();

  if (!normalizedOption || normalizedOption === "relevance") {
    return { ...defaultSearchSortState };
  }

  if (
    normalizedOption === "works_most_works"
    || normalizedOption === "alphabetical_az"
  ) {
    return createSearchSortStateFromOption(normalizedOption);
  }

  const current = normalizeSearchSortState(currentSortState);

  if (normalizedOption === "citation_most_cited") {
    return buildWorkSortState(current, "citation", "desc");
  }

  if (normalizedOption === "citation_least_cited") {
    return buildWorkSortState(current, "citation", "asc");
  }

  if (normalizedOption === "published_latest") {
    return buildWorkSortState(current, "published", "desc");
  }

  if (normalizedOption === "published_oldest") {
    return buildWorkSortState(current, "published", "asc");
  }

  return current;
}

export function getSearchSortOptionValue(
  sortState: SearchSortState,
  groupKey: SearchResultSortGroupKey,
) {
  if (groupKey === "entity") {
    if (sortState.sortBy === "works") {
      return "works_most_works";
    }

    if (sortState.sortBy === "alphabetical") {
      return "alphabetical_az";
    }

    return "";
  }

  if (groupKey === "citation" && sortState.citationDirection) {
    return sortState.citationDirection === "asc"
      ? "citation_least_cited"
      : "citation_most_cited";
  }

  if (groupKey === "published" && sortState.publishedDirection) {
    return sortState.publishedDirection === "asc"
      ? "published_oldest"
      : "published_latest";
  }
  return "";
}

function normalizeLegacySearchSortState(values: string[] | string) {
  const rawValues = Array.isArray(values) ? values : [values];
  let normalizedState = { ...defaultSearchSortState };

  for (const value of rawValues) {
    normalizedState = updateSearchSortStateFromOption(normalizedState, value);
  }

  return normalizedState;
}

function normalizeSortBy(value?: string | null): SearchSortBy {
  const normalizedValue = value?.trim().toLowerCase();

  if (
    normalizedValue === "citation"
    || normalizedValue === "published"
    || normalizedValue === "works"
    || normalizedValue === "alphabetical"
  ) {
    return normalizedValue;
  }

  return "relevance";
}

function normalizeSortDirection(value?: string | null): SearchSortDirection {
  return value?.trim().toLowerCase() === "asc" ? "asc" : "desc";
}

function normalizeNullableSortDirection(
  value?: string | null,
): SearchSortDirection | null {
  if (value?.trim().toLowerCase() === "asc") {
    return "asc";
  }

  if (value?.trim().toLowerCase() === "desc") {
    return "desc";
  }

  return null;
}

function buildWorkSortState(
  currentSortState: SearchSortState,
  sortBy: "citation" | "published",
  sortDirection: SearchSortDirection,
): SearchSortState {
  const citationDirection =
    sortBy === "citation"
      ? sortDirection
      : currentSortState.citationDirection ?? null;
  const publishedDirection =
    sortBy === "published"
      ? sortDirection
      : currentSortState.publishedDirection ?? null;

  return {
    sortBy,
    sortDirection,
    trendingMode: "none",
    citationDirection,
    publishedDirection,
  };
}

