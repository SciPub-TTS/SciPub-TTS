import type {
  PaperResult,
  RemoteOptionFilterKey,
  SearchFilters,
  SearchSortState,
} from "../types";

export type SearchOptionGroupKey =
  | "type"
  | "subField"
  | "author"
  | "institution"
  | "country"
  | "source"
  | "award";

export type OptionItem = {
  value?: string;
  id?: string;
  label: string;
  count?: number | null;
};

export type SearchSummaryApiData = {
  totalWorks: number;
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
  keywords: string[];
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

export type SearchSummaryState = {
  totalIndexedPapers: number;
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
  | "citation"
  | "published"
  | "trending";
