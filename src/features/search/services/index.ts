import type {
  PaperResult,
  RemoteOptionFilterKey,
  SavedSearch,
  SearchFilterOptions,
  SearchFilters,
  SearchSummaryStats,
  SearchYearRange,
} from "../types";
import { getAccessToken } from "@/features/auth/utils/authStorage";
import {
  SEARCH_DEFAULT_PAGE,
  SEARCH_FILTER_OPTION_LIMIT,
  SEARCH_MIN_YEAR,
  SEARCH_RECENT_SEARCH_LIMIT,
  SEARCH_WORKS_PER_PAGE,
} from "../constants";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || window.location.origin
).replace(/\/$/, "");

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

type ResponseEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

type SearchHistoryApiItem = {
  query: string;
  savedAt: string;
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
  selectedSort: string;
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

// The first option is the default sort used by the search hook.
export const mockResultSortOptions = ["Most cited", "Latest", "Trending"];

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
  const endpoint = new URL(`${apiBaseUrl}/api/search/filters/options`);
  endpoint.searchParams.set("limit", String(limit));
  endpoint.searchParams.set("page", String(page));
  appendIfFilled(endpoint, "keyword", keyword);

  const data = await requestData<FilterOptionsApiData>(endpoint.toString());

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
  const endpoint = new URL(`${apiBaseUrl}/api/search/works`);
  const { filters } = request;

  appendIfFilled(endpoint, "query", request.appliedSearchQuery.trim());

  appendIfFilled(endpoint, "yearMode", filters.yearMode);
  appendIfFilled(endpoint, "yearFrom", filters.yearFrom);
  appendIfFilled(endpoint, "yearTo", filters.yearTo);
  appendIfFilled(endpoint, "yearExact", filters.yearExact);

  appendMappedValues(
    endpoint,
    "type",
    filters.type,
    request.optionValueLookup.type,
  );

  if (filters.openAccess) {
    endpoint.searchParams.append("openAccess", "true");
  }

  appendMappedValues(
    endpoint,
    "subField",
    filters.subField,
    request.optionValueLookup.subField,
  );
  appendMappedValues(
    endpoint,
    "author",
    filters.author,
    request.optionValueLookup.author,
  );
  appendMappedValues(
    endpoint,
    "institution",
    filters.institution,
    request.optionValueLookup.institution,
  );

  if (filters.pdf) {
    endpoint.searchParams.append("pdf", "true");
  }

  appendMappedValues(
    endpoint,
    "country",
    filters.country,
    request.optionValueLookup.country,
  );

  appendIfFilled(endpoint, "citationMode", filters.citationMode);
  appendIfFilled(endpoint, "citationMin", filters.citationMin);
  appendIfFilled(endpoint, "citationMax", filters.citationMax);
  appendIfFilled(endpoint, "citationExact", filters.citationExact);

  appendMappedValues(
    endpoint,
    "source",
    filters.source,
    request.optionValueLookup.source,
  );
  appendMappedValues(
    endpoint,
    "award",
    filters.award,
    request.optionValueLookup.award,
  );

  appendIfFilled(endpoint, "indexedByOrcid", filters.indexedByOrcid);
  appendIfFilled(endpoint, "sort", request.selectedSort);
  endpoint.searchParams.set("page", String(request.page));
  endpoint.searchParams.set("perPage", String(SEARCH_WORKS_PER_PAGE));

  const data = await requestData<SearchWorksApiResponse>(endpoint.toString());
  const works: PaperResult[] = [];

  for (const item of data.results) {
    works.push(mapApiWorkToPaperResult(item));
  }

  return {
    page: data.meta.page,
    perPage: data.meta.perPage,
    responseTimeSeconds: data.meta.dbResponseTimeMs / 1000,
    totalCount: data.meta.totalCount,
    works,
  };
}

export async function getRecentSearches(
  limit = SEARCH_RECENT_SEARCH_LIMIT,
): Promise<SavedSearch[]> {
  const endpoint = new URL(`${apiBaseUrl}/api/search/history/recent`);
  endpoint.searchParams.set("limit", String(limit));

  const data = await requestData<SearchHistoryApiItem[]>(endpoint.toString());
  const savedSearches: SavedSearch[] = [];

  for (const item of data) {
    savedSearches.push({
      query: item.query,
      savedAt: item.savedAt,
    });
  }

  return savedSearches;
}

export async function saveSearchHistory(query: string): Promise<void> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return;
  }

  const payload = {
    query: normalizedQuery,
  };

  await requestData<null>(`${apiBaseUrl}/api/search/history`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteSearchHistory(query: string): Promise<void> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return;
  }

  const endpoint = new URL(`${apiBaseUrl}/api/search/history`);
  endpoint.searchParams.set("query", normalizedQuery);

  await requestData<null>(endpoint.toString(), {
    method: "DELETE",
  });
}

async function requestData<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  let envelope: ResponseEnvelope<T>;

  try {
    envelope = (await response.json()) as ResponseEnvelope<T>;
  } catch {
    throw new Error(`Request failed (${response.status})`);
  }

  if (!response.ok) {
    const message = envelope.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return envelope.data;
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
  const summary =
    sanitizePlainText(work.abstractText).trim() ||
    `OpenAlex result from ${normalizedSource}.`;
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
    isTrendTopic: Boolean(work.hasOrcid || work.openAccess),
    saved: false,
    trend: Boolean(work.openAccess),
  };
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
