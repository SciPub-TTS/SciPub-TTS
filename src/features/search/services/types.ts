import type {
  AuthorResult,
  PaperResult,
  RemoteOptionFilterKey,
  SearchEntityType,
  SearchFilters,
  SearchResultItem,
  SearchSortState,
  TopicResult,
} from "../types";

export type SearchOptionGroupKey =
  | "type"
  | "subField"
  | "author"
  | "institution"
  | "country"
  | "primaryTopic"
  | "field"
  | "source"
  | "award";

export type OptionItem = {
  value?: string;
  id?: string;
  label: string;
  count?: number | null;
};

export type SearchSummaryApiData = {
  totalCount: number;
  entityType: SearchEntityType;
  totalCountExact: boolean;
};

export type SearchHistoryApiItem = {
  id: string;
  query: string;
  savedAt: string | null;
};

export type FilterOptionPageApiData = {
  filterKey: RemoteOptionFilterKey;
  options: OptionItem[];
};

export type SearchWorksApiItem = {
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
  topic: string | null;
  subFieldName: string | null;
  sourceId: string | null;
  sourceName: string | null;
  authors: string[];
  authorRefs?: Array<{
    id: string | null;
    displayName: string;
  }> | null;
  keywords: string[];
  topicRef?: {
    id: string | null;
    displayName: string;
  } | null;
  matchesTrendingKeyword: boolean | null;
  matchesTrendingTopic: boolean | null;
  trendingScore: number | null;
};

export type SearchWorksApiResponse = {
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

export type SearchEntityApiItem = {
  id: string;
  entityType: Exclude<SearchEntityType, "works">;
  displayName: string;
  primaryInstitutionName: string | null;
  primaryTopicName: string | null;
  subfieldName: string | null;
  fieldName: string | null;
  domainName: string | null;
  worksCount: number;
};

export type SearchEntitiesApiResponse = {
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    dbResponseTimeMs: number;
    costUsd: number;
    entityType: Exclude<SearchEntityType, "works">;
    hasMore: boolean;
    totalCountExact: boolean;
  };
  results: SearchEntityApiItem[];
};

export type SearchSummaryState = {
  entityType: SearchEntityType;
  totalIndexedCount: number;
  totalCountExact: boolean;
};

export type HotTopicApiItem = {
  topicId: string | null;
  name: string;
  fieldId: number | null;
  works: number | null;
  citations: number | null;
};

export type HotTopicApiResponse = {
  snapshotDate: string;
  topics: HotTopicApiItem[];
};

export type HotKeywordApiItem = {
  keywordId: string | null;
  name: string;
  fieldId: number | null;
  works: number | null;
  citations: number | null;
};

export type HotKeywordApiResponse = {
  snapshotDate: string;
  keywords: HotKeywordApiItem[];
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
  sortState: SearchSortState;
};

export type SearchEntityRequest = {
  appliedSearchQuery: string;
  entityType: Exclude<SearchEntityType, "works">;
  filters: SearchFilters;
  optionValueLookup: SearchOptionValueLookup;
  page: number;
  sortState: SearchSortState;
};

export type SearchWorksState = {
  entityType: "works";
  page: number;
  perPage: number;
  responseTimeSeconds: number;
  totalCount: number;
  works: PaperResult[];
};

export type SearchEntitiesState = {
  entityType: Exclude<SearchEntityType, "works">;
  items: Array<AuthorResult | TopicResult>;
  page: number;
  perPage: number;
  responseTimeSeconds: number;
  totalCount: number;
  hasMore: boolean;
  totalCountExact: boolean;
};

export type SearchResultsPage = SearchWorksState | SearchEntitiesState;

export type SearchResultState = {
  entityType: SearchEntityType;
  items: SearchResultItem[];
  page: number;
  perPage: number;
  responseTimeSeconds: number;
  totalCount: number;
};

export type RemoteFilterOptionsPage = {
  hasMore: boolean;
  options: string[];
  page: number;
  valueLookup: Record<string, string>;
};

export type SearchResultSortOption = {
  label: string;
  value: string;
};

export type SearchResultSortGroup = {
  key: SearchResultSortGroupKey;
  disabled?: boolean;
  label: string;
  options: SearchResultSortOption[];
};

export type SearchResultSortGroupKey =
  | "entity"
  | "citation"
  | "published"
  | "trending";
