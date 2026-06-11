import { createApiUrl, requestPublicJson } from "@/lib/api/fetchJson";
import type {
  PaperResult,
  RemoteOptionFilterKey,
  SearchFilterOptions,
  SearchFilters,
  SearchSummaryStats,
  SearchYearRange,
} from "../types";
import {
  SEARCH_DEFAULT_PAGE,
  SEARCH_FILTER_OPTION_LIMIT,
  SEARCH_MIN_YEAR,
  SEARCH_WORKS_PER_PAGE,
} from "../constants";

type SearchOptionGroupKey =
  | "type"
  | "subField"
  | "author"
  | "institution"
  | "country"
  | "source"
  | "award";

type OptionItem = {
  value?: string;
  id?: string;
  label: string;
  count?: number | null;
};

type FilterOptionsApiData = {
  totalWorks: number;
  year: SearchYearRange;
  citation: { minimumCitation: number; maximumCitation: number };
  type: OptionItem[];
  subField: OptionItem[];
  author: OptionItem[];
  institution: OptionItem[];
  country: OptionItem[];
  source: OptionItem[];
  award: OptionItem[];
};

type SearchWorksApiItem = {
  id: string;
  title: string;
  abstractText: string | null;
  doi: string | null;
  publicationYear: number | null;
  citedByCount: number | null;
  openAccess: boolean | null;
  hasPdf: boolean | null;
  pdfUrl: string | null;
  hasOrcid: boolean | null;
  type: string | null;
  topicName: string | null;
  subFieldName: string | null;
  sourceId: string | null;
  sourceName: string | null;
  authors: string[];
};

type SearchWorksApiResponse = {
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    dbResponseTimeMs: number;
    costUsd: number;
    appliedFilter: string;
    appliedSort: string;
  };
  results: SearchWorksApiItem[];
};

export type SearchOptionsState = {
  citationRange: { minimumCitation: number; maximumCitation: number };
  filterOptions: SearchFilterOptions;
  optionValueLookup: SearchOptionValueLookup;
  totalIndexedPapers: number;
  yearRange: SearchYearRange;
};

export type SearchOptionValueLookup = Record<
  SearchOptionGroupKey,
  Record<string, string>
>;

export type SearchWorksRequest = {
  appliedSearchQuery: string;
  filters: SearchFilters;
  optionValueLookup: SearchOptionValueLookup;
  page: number;
  selectedSorts: string[];
};

export type SearchWorksState = {
  page: number;
  perPage: number;
  responseTimeSeconds: number;
  totalCount: number;
  works: PaperResult[];
};

export type RemoteFilterOptionsPage = {
  hasMore: boolean;
  options: string[];
  page: number;
  valueLookup: Record<string, string>;
};

export const searchTabs = ["Works"];

export type SearchResultSortOption = {
  label: string;
  value: string;
};

export type SearchResultSortGroup = {
  key: string;
  label: string;
  options: SearchResultSortOption[];
};

export type SearchResultSortGroupKey =
  | "citation"
  | "published"
  | "trending";

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
    options: [
      { value: "trending_keyword", label: "By keyword" },
      { value: "trending_topic", label: "By topic" },
    ],
  },
];

export const searchResultSortValues = searchResultSortGroups.flatMap(
  (group) => group.options.map((option) => option.value),
);

export const defaultSearchResultSortValue = searchResultSortValues[0];

export function isSearchResultSortValue(value?: string | null) {
  if (!value) {
    return false;
  }

  return searchResultSortValues.includes(value);
}

export function normalizeSearchResultSortValues(
  values?: string[] | string | null,
) {
  const rawValues = Array.isArray(values)
    ? values
      : values
      ? [values]
      : [];

  const normalizedValues: string[] = [];
  const groupValueIndexMap = new Map<SearchResultSortGroupKey, number>();

  for (const value of rawValues) {
    const normalizedValue = normalizeSearchResultSortValue(value);
    const groupKey = getSearchResultSortGroupKey(normalizedValue);

    if (!normalizedValue || !groupKey) {
      continue;
    }

    const existingIndex = groupValueIndexMap.get(groupKey);

    if (existingIndex === undefined) {
      groupValueIndexMap.set(groupKey, normalizedValues.length);
      normalizedValues.push(normalizedValue);
      continue;
    }

    normalizedValues[existingIndex] = normalizedValue;
  }

  return normalizedValues;
}

export function getSearchResultSortGroupKey(
  value?: string | null,
): SearchResultSortGroupKey | null {
  const normalizedValue = normalizeSearchResultSortValue(value);

  if (!normalizedValue) {
    return null;
  }

  for (const group of searchResultSortGroups) {
    if (group.options.some((option) => option.value === normalizedValue)) {
      return group.key as SearchResultSortGroupKey;
    }
  }

  return null;
}

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

// TODO: Replace this mock summary with the search API response.
export const searchSummaryStats: SearchSummaryStats = {
  totalIndexedPapers: 500_000_000,
  matchedPapers: 12_481,
  latestUpdatedMinutesAgo: 4,
  resultCount: 12_481,
  responseTimeSeconds: 0.42,
};

export async function getSearchFilterOptions(
  limit = SEARCH_FILTER_OPTION_LIMIT,
  keyword = "",
  page = SEARCH_DEFAULT_PAGE,
): Promise<SearchOptionsState> {
  const endpoint = createApiUrl("/api/search/filters/options");
  endpoint.searchParams.set("limit", String(limit));
  endpoint.searchParams.set("page", String(page));
  appendIfFilled(endpoint, "keyword", keyword);

  const data = await requestPublicJson<FilterOptionsApiData>(endpoint);

  return buildSearchOptionsState(data);
}

export async function getRemoteFilterOptionsPage(
  filterKey: RemoteOptionFilterKey,
  keyword: string,
  page: number,
  limit = SEARCH_FILTER_OPTION_LIMIT,
): Promise<RemoteFilterOptionsPage> {
  const optionsState = await getSearchFilterOptions(limit, keyword, page);
  const options = optionsState.filterOptions[filterKey];
  const valueLookup = optionsState.optionValueLookup[filterKey];

  return {
    hasMore: options.length >= limit,
    options,
    page,
    valueLookup,
  };
}

export async function searchWorks(
  request: SearchWorksRequest,
): Promise<SearchWorksState> {
  const normalizedSorts = normalizeSearchResultSortValues(request.selectedSorts);
  const endpoint = buildSearchWorksUrl(request, normalizedSorts);
  const data = await requestPublicJson<SearchWorksApiResponse>(endpoint);
  const works: PaperResult[] = [];

  for (const item of data.results) {
    works.push(mapApiWorkToPaperResult(item));
  }

  return {
    page: data.meta.page,
    perPage: data.meta.perPage,
    responseTimeSeconds: data.meta.dbResponseTimeMs / 1000,
    totalCount: data.meta.totalCount,
    works: sortPaperResults(works, normalizedSorts),
  };
}

export function normalizeSearchResultSortValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const normalizedValue = value.trim().toLowerCase();

  switch (normalizedValue) {
    case "most cited":
    case "most_cited":
    case "cited_by_count:desc":
    case "citation_most_cited":
      return "citation_most_cited";
    case "least cited":
    case "least_cited":
    case "cited_by_count:asc":
    case "citation_least_cited":
      return "citation_least_cited";
    case "latest":
    case "publication_year:desc":
    case "published_latest":
      return "published_latest";
    case "oldest":
    case "publication_year:asc":
    case "published_oldest":
      return "published_oldest";
    case "trending":
    case "trending_keyword":
      return "trending_keyword";
    case "trending_topic":
      return "trending_topic";
    default:
      return "";
  }
}

/*
 * Search history calls are disabled for production because the history API can
 * return 401 for unauthenticated users. Re-enable this block together with the
 * search history UI after the backend flow is ready for production traffic.
 */
// export async function getRecentSearches(
//   limit = SEARCH_RECENT_SEARCH_LIMIT,
// ): Promise<SavedSearch[]> {
//   const endpoint = createApiUrl("/api/search/history/recent");
//   endpoint.searchParams.set("limit", String(limit));
//
//   const data = await requestJson<SearchHistoryApiItem[]>(endpoint);
//   return data.map((item) => ({
//     query: item.query,
//     savedAt: item.savedAt,
//   }));
// }
//
// export async function saveSearchHistory(query: string): Promise<void> {
//   const normalizedQuery = query.trim();
//   if (!normalizedQuery) {
//     return;
//   }
//
//   const payload = {
//     query: normalizedQuery,
//   };
//
//   await requestJson<null>(createApiUrl("/api/search/history"), {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// }
//
// export async function deleteSearchHistory(query: string): Promise<void> {
//   const normalizedQuery = query.trim();
//   if (!normalizedQuery) {
//     return;
//   }
//
//   const endpoint = createApiUrl("/api/search/history");
//   endpoint.searchParams.set("query", normalizedQuery);
//
//   await requestJson<null>(endpoint, {
//     method: "DELETE",
//   });
// }

function buildSearchOptionsState(data: FilterOptionsApiData): SearchOptionsState {
  return {
    citationRange: data.citation,
    filterOptions: {
      type: mapOptionsToLabels(data.type, false),
      subField: mapOptionsToLabels(data.subField, false),
      author: mapOptionsToLabels(data.author, true),
      institution: mapOptionsToLabels(data.institution, true),
      country: mapOptionsToLabels(data.country, false),
      source: mapOptionsToLabels(data.source, true),
      award: mapOptionsToLabels(data.award, true),
    },
    optionValueLookup: {
      type: mapOptionsToValueLookup(data.type, false),
      subField: mapOptionsToValueLookup(data.subField, false),
      author: mapOptionsToValueLookup(data.author, true),
      institution: mapOptionsToValueLookup(data.institution, true),
      country: mapOptionsToValueLookup(data.country, false),
      source: mapOptionsToValueLookup(data.source, true),
      award: mapOptionsToValueLookup(data.award, true),
    },
    totalIndexedPapers: data.totalWorks,
    yearRange: data.year,
  };
}

function buildSearchWorksUrl(
  request: SearchWorksRequest,
  normalizedSorts: string[],
) {
  const endpoint = createApiUrl("/api/search/works");
  const { filters, optionValueLookup } = request;
  const primarySort = normalizedSorts[0] ?? "";
  const hasYearFilter = Boolean(
    filters.yearMode === "exact" ? filters.yearExact : filters.yearFrom || filters.yearTo,
  );
  const hasCitationFilter = Boolean(
    filters.citationMode === "exact"
      ? filters.citationExact
      : filters.citationMin || filters.citationMax,
  );

  appendIfFilled(endpoint, "query", request.appliedSearchQuery.trim());
  if (hasYearFilter) {
    appendIfFilled(endpoint, "yearMode", filters.yearMode);
  }
  appendIfFilled(endpoint, "yearFrom", filters.yearFrom);
  appendIfFilled(endpoint, "yearTo", filters.yearTo);
  appendIfFilled(endpoint, "yearExact", filters.yearExact);

  appendMappedValues(endpoint, "type", filters.type, optionValueLookup.type);

  if (filters.openAccess) {
    endpoint.searchParams.append("openAccess", "true");
  }

  appendMappedValues(
    endpoint,
    "subField",
    filters.subField,
    optionValueLookup.subField,
  );
  appendMappedValues(
    endpoint,
    "author",
    filters.author,
    optionValueLookup.author,
  );
  appendMappedValues(
    endpoint,
    "institution",
    filters.institution,
    optionValueLookup.institution,
  );

  if (filters.pdf) {
    endpoint.searchParams.append("pdf", "true");
  }

  appendMappedValues(
    endpoint,
    "country",
    filters.country,
    optionValueLookup.country,
  );
  if (hasCitationFilter) {
    appendIfFilled(endpoint, "citationMode", filters.citationMode);
  }
  appendIfFilled(endpoint, "citationMin", filters.citationMin);
  appendIfFilled(endpoint, "citationMax", filters.citationMax);
  appendIfFilled(endpoint, "citationExact", filters.citationExact);
  appendMappedValues(
    endpoint,
    "source",
    filters.source,
    optionValueLookup.source,
  );
  appendMappedValues(
    endpoint,
    "award",
    filters.award,
    optionValueLookup.award,
  );
  appendIfFilled(endpoint, "indexedByOrcid", filters.indexedByOrcid);
  appendIfFilled(endpoint, "sort", primarySort);
  endpoint.searchParams.set("page", String(request.page));
  endpoint.searchParams.set("perPage", String(SEARCH_WORKS_PER_PAGE));

  return endpoint;
}

function mapOptionsToLabels(
  options: OptionItem[],
  includeStableSuffix: boolean,
) {
  const displayOptions = buildDisplayOptions(options, includeStableSuffix);
  const labels: string[] = [];

  for (const option of displayOptions) {
    if (option.value) {
      labels.push(option.label);
    }
  }

  return labels;
}

function mapOptionsToValueLookup(
  options: OptionItem[],
  includeStableSuffix: boolean,
) {
  const displayOptions = buildDisplayOptions(options, includeStableSuffix);
  const lookup: Record<string, string> = {};

  for (const option of displayOptions) {
    if (!option.value) {
      continue;
    }
    lookup[option.label] = option.value;
  }

  return lookup;
}

function buildDisplayOptions(
  options: OptionItem[],
  includeStableSuffix: boolean,
) {
  const duplicatedLabelSet = new Set<string>();
  const labelCountMap: Record<string, number> = {};

  for (const option of options) {
    labelCountMap[option.label] = (labelCountMap[option.label] || 0) + 1;
  }

  for (const [label, count] of Object.entries(labelCountMap)) {
    if (count > 1) {
      duplicatedLabelSet.add(label);
    }
  }

  const displayOptions: OptionItem[] = [];

  for (const option of options) {
    const sanitizedLabel = sanitizePlainText(option.label);
    const optionValue = resolveOptionValue(option);

    if (!optionValue) {
      displayOptions.push({
        ...option,
        label: sanitizedLabel,
        value: "",
      });
      continue;
    }

    if (!includeStableSuffix || !duplicatedLabelSet.has(option.label)) {
      displayOptions.push({
        ...option,
        label: sanitizedLabel,
        value: optionValue,
      });
      continue;
    }

    const stableSuffix = extractLastSegment(optionValue);
    displayOptions.push({
      ...option,
      value: optionValue,
      label: `${sanitizedLabel} (${stableSuffix})`,
    });
  }

  return displayOptions;
}

function resolveOptionValue(option: OptionItem) {
  return option.value || option.id || "";
}

function appendIfFilled(url: URL, key: string, value: string) {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return;
  }

  url.searchParams.append(key, normalizedValue);
}

function appendMappedValues(
  url: URL,
  key: string,
  labels: string[],
  valueLookup: Record<string, string>,
) {
  for (const label of labels) {
    const value = valueLookup[label] || label;
    if (!value.trim()) {
      continue;
    }

    url.searchParams.append(key, value);
  }
}

function mapApiWorkToPaperResult(work: SearchWorksApiItem): PaperResult {
  const title = sanitizePlainText(work.title) || "Untitled";
  const normalizedType = normalizeTypeLabel(work.type);
  const normalizedSource =
    sanitizePlainText(work.sourceName) || "Unknown source";
  const normalizedTopic =
    sanitizePlainText(work.topicName).trim() || normalizedSource;
  const normalizedSubField =
    sanitizePlainText(work.subFieldName).trim() || "Unknown subfield";
  const currentYear = new Date().getFullYear();
  const publicationYear = normalizePublicationYear(
    work.publicationYear,
    currentYear,
  );
  const citedByCount = work.citedByCount || 0;
  const normalizedAbstract =
    work.abstractText === null
      ? "Null"
      : sanitizePlainText(work.abstractText).trim();
  const summary =
    normalizedAbstract || `OpenAlex result from ${normalizedSource}.`;
  const authors = mapAuthorNames(work.authors);

  return {
    id: extractLastSegment(work.id),
    title,
    authors,
    venue: normalizedSource,
    citations: citedByCount,
    year: publicationYear,
    abstract: summary,
    fullText: summary,
    doi: normalizeDoi(work.doi),
    pdfUrl: work.pdfUrl,
    tags: buildTags(normalizedSubField, normalizedTopic),
    field: normalizedType,
    topic: normalizedTopic,
    subField: normalizedSubField,
    growthPercent: 0,
    isTrendTopic: false,
    saved: false,
    trend: false,
  };
}

export function sortPaperResults(
  works: PaperResult[],
  selectedSorts: string[],
): PaperResult[] {
  const normalizedSorts = normalizeSearchResultSortValues(selectedSorts);

  if (normalizedSorts.length === 0) {
    return [...works];
  }

  const sortedWorks = [...works];

  sortedWorks.sort((left, right) => {
    for (const normalizedSort of normalizedSorts) {
      let comparison = 0;

      switch (normalizedSort) {
        case "citation_most_cited":
          comparison = compareNumbers(right.citations, left.citations)
            || compareNumbers(right.year, left.year)
            || compareText(left.title, right.title);
          break;
        case "citation_least_cited":
          comparison = compareNumbers(left.citations, right.citations)
            || compareNumbers(right.year, left.year)
            || compareText(left.title, right.title);
          break;
        case "published_latest":
          comparison = compareNumbers(right.year, left.year)
            || compareNumbers(right.citations, left.citations)
            || compareText(left.title, right.title);
          break;
        case "published_oldest":
          comparison = compareNumbers(left.year, right.year)
            || compareNumbers(right.citations, left.citations)
            || compareText(left.title, right.title);
          break;
        case "trending_keyword":
          comparison = compareText(resolvePrimaryKeyword(left), resolvePrimaryKeyword(right))
            || compareText(left.topic, right.topic)
            || compareNumbers(right.citations, left.citations)
            || compareText(left.title, right.title);
          break;
        case "trending_topic":
          comparison = compareText(left.topic, right.topic)
            || compareText(resolvePrimaryKeyword(left), resolvePrimaryKeyword(right))
            || compareNumbers(right.citations, left.citations)
            || compareText(left.title, right.title);
          break;
        default:
          comparison = 0;
      }

      if (comparison !== 0) {
        return comparison;
      }
    }

    return 0;
  });

  return sortedWorks;
}

function normalizePublicationYear(
  publicationYear: number | null,
  currentYear: number,
) {
  if (!publicationYear) {
    return currentYear;
  }

  if (publicationYear > currentYear) {
    return currentYear;
  }

  return publicationYear;
}

function compareNumbers(left: number, right: number) {
  return left - right;
}

function compareText(left: string, right: string) {
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function resolvePrimaryKeyword(paper: PaperResult) {
  return paper.tags.find((tag) => tag.trim().length > 0) ?? "";
}

function normalizeTypeLabel(type: string | null) {
  const normalizedType = sanitizePlainText(type).trim();

  if (!normalizedType) {
    return "Work";
  }

  const segments = normalizedType.split("-");
  const normalizedSegments: string[] = [];

  for (const segment of segments) {
    normalizedSegments.push(segment.charAt(0).toUpperCase() + segment.slice(1));
  }

  return normalizedSegments.join(" ");
}

function normalizeDoi(doi: string | null) {
  if (!doi) {
    return "";
  }

  return doi.replace(/^https?:\/\//, "");
}

function buildTags(subField: string, topicName: string) {
  const tags: string[] = [];
  const values = [subField, topicName];

  for (const value of values) {
    if (value.trim().length > 0) {
      tags.push(value);
    }

    if (tags.length === 3) {
      break;
    }
  }

  return tags;
}

function extractLastSegment(value: string) {
  const lastSlashIndex = value.lastIndexOf("/");

  if (lastSlashIndex === -1 || lastSlashIndex === value.length - 1) {
    return value;
  }

  return value.slice(lastSlashIndex + 1);
}

function mapAuthorNames(authorNames: string[]) {
  const result: string[] = [];

  for (const authorName of authorNames) {
    const normalizedName = sanitizePlainText(authorName);
    if (normalizedName.length > 0) {
      result.push(normalizedName);
    }
  }

  return result;
}

let htmlEntityDecoder: HTMLTextAreaElement | null = null;

function sanitizePlainText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const decodedText = decodeHtmlEntities(value);
  const withoutHtmlTags = decodedText.replace(/<[^>]*>/g, " ");

  return withoutHtmlTags.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string) {
  if (!value.includes("&")) {
    return value;
  }

  if (typeof document === "undefined") {
    return value;
  }

  if (!htmlEntityDecoder) {
    htmlEntityDecoder = document.createElement("textarea");
  }

  htmlEntityDecoder.innerHTML = value;
  return htmlEntityDecoder.value;
}
