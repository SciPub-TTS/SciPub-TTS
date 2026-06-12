// Domain data types returned by the backend or mock services.
export type SavedSearch = {
  query: string;
  savedAt: string;
};

export type PaperResult = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  citations: number;
  year: number;
  abstract: string;
  fullText: string;
  doi: string;
  pdfUrl: string | null;
  keywords: string[];
  field: string;
  topic: string;
  subField: string;
  matchesTrendingKeyword: boolean;
  matchesTrendingTopic: boolean;
  trendingScore: number;
  growthPercent: number;
  isTrendTopic?: boolean;
  saved?: boolean;
  trend?: boolean;
};

export type SearchTrendingMode = "none" | "keyword" | "topic" | "both";

export type SearchSortBy = "relevance" | "citation" | "published";

export type SearchSortDirection = "asc" | "desc";

export type SearchSortState = {
  sortBy: SearchSortBy;
  sortDirection: SearchSortDirection;
  trendingMode: SearchTrendingMode;
};

export type SearchFilters = {
  yearMode: "range" | "exact";
  yearFrom: string;
  yearTo: string;
  yearExact: string;
  type: string[];
  openAccess: boolean;
  subField: string[];
  author: string[];
  institution: string[];
  pdf: boolean;
  country: string[];
  citationMode: "range" | "exact";
  citationMin: string;
  citationMax: string;
  citationExact: string;
  source: string[];
  award: string[];
  indexedByOrcid: "" | "is" | "is not";
};

export type SearchFilterWidgetKey =
  | "year"
  | "type"
  | "openAccess"
  | "subField"
  | "author"
  | "institution"
  | "pdf"
  | "country"
  | "citation"
  | "source"
  | "award"
  | "indexedByOrcid";

export type RemoteOptionFilterKey =
  | "type"
  | "subField"
  | "author"
  | "institution"
  | "country"
  | "award"
  | "source";

export type RemoteOptionStateMap = Record<RemoteOptionFilterKey, boolean>;

// Option lists used to render filter dropdowns.
export type SearchFilterOptions = {
  type: string[];
  subField: string[];
  author: string[];
  institution: string[];
  country: string[];
  source: string[];
  award: string[];
};

// Year validation range can come from backend metadata later.
export type SearchYearRange = {
  minimumYear: number;
  currentYear: number;
};

// Simple updater shared by filter components.
export type UpdateSearchFilter = (
  key: keyof SearchFilters,
  value: SearchFilters[keyof SearchFilters],
) => void;

// Component prop types live here so JSX files stay focused on rendering.
export type PaperResultCardProps = {
  paper: PaperResult;
};

export type SearchPanelProps = {
  activeFilterCount: number;
  appliedFilterSummary: string[];
  filterOptions: SearchFilterOptions;
  filters: SearchFilters;
  filtersOpen: boolean;
  hasFormError: boolean;
  isLoadingResults: boolean;
  isLoadingFilterOptions: RemoteOptionStateMap;
  isLoadingMoreFilterOptions: RemoteOptionStateMap;
  hasMoreFilterOptions: RemoteOptionStateMap;
  matchedPaperCount: number;
  searchQuery: string;
  totalIndexedPapers: number;
  visibleFilterWidgets: SearchFilterWidgetKey[];
  onApplyFilters: () => void;
  onFilterOptionSearch: (filterKey: RemoteOptionFilterKey, keyword: string) => void;
  onLoadMoreFilterOptions: (filterKey: RemoteOptionFilterKey) => void;
  onResetFilters: () => void;
  onSearch: () => void;
  onSearchQueryChange: (query: string) => void;
  onSuggestedSearchSelect: (query: string) => void;
  onToggleFilters: () => void;
  onToggleVisibleFilterWidget: (widgetKey: SearchFilterWidgetKey) => void;
  updateFilter: UpdateSearchFilter;
};

export type SearchInputRowProps = {
  isLoadingResults: boolean;
  searchQuery: string;
  onSearch: () => void;
  onSearchQueryChange: (query: string) => void;
};

export type SuggestedSearchListProps = {
  onSelect: (query: string) => void;
};

export type SearchFiltersPanelProps = {
  activeFilterCount: number;
  appliedFilterSummary: string[];
  filterOptions: SearchFilterOptions;
  filters: SearchFilters;
  filtersOpen: boolean;
  hasFormError: boolean;
  isLoadingFilterOptions: RemoteOptionStateMap;
  isLoadingMoreFilterOptions: RemoteOptionStateMap;
  hasMoreFilterOptions: RemoteOptionStateMap;
  isLoadingResults: boolean;
  matchedPaperCount: number;
  visibleFilterWidgets: SearchFilterWidgetKey[];
  onApplyFilters: () => void;
  onFilterOptionSearch: (filterKey: RemoteOptionFilterKey, keyword: string) => void;
  onLoadMoreFilterOptions: (filterKey: RemoteOptionFilterKey) => void;
  onResetFilters: () => void;
  onToggleFilters: () => void;
  onToggleVisibleFilterWidget: (widgetKey: SearchFilterWidgetKey) => void;
  updateFilter: UpdateSearchFilter;
};

export type SearchFiltersHeaderProps = {
  activeFilterCount: number;
  filtersOpen: boolean;
  matchedPaperCount: number;
  onToggleFilters: () => void;
};

export type FilterVisibilityToggleProps = {
  visibleFilterWidgets: SearchFilterWidgetKey[];
  onToggleVisibleFilterWidget: (widgetKey: SearchFilterWidgetKey) => void;
};

export type SearchFilterGridProps = {
  filterOptions: SearchFilterOptions;
  filters: SearchFilters;
  hasMoreFilterOptions: RemoteOptionStateMap;
  isLoadingFilterOptions: RemoteOptionStateMap;
  isLoadingMoreFilterOptions: RemoteOptionStateMap;
  visibleFilterWidgets: SearchFilterWidgetKey[];
  onFilterOptionSearch: (filterKey: RemoteOptionFilterKey, keyword: string) => void;
  onLoadMoreFilterOptions: (filterKey: RemoteOptionFilterKey) => void;
  updateFilter: UpdateSearchFilter;
};

export type AppliedFilterSummaryProps = {
  summary: string[];
};

export type FilterActionsProps = {
  activeFilterCount: number;
  hasFormError: boolean;
  isLoadingResults: boolean;
  onApplyFilters: () => void;
  onResetFilters: () => void;
};

export type MultiSelectFilterProps = {
  filterKey?:
    | "type"
    | "subField"
    | "author"
    | "institution"
    | "country"
    | "source"
    | "award";
  label: string;
  options: string[];
  selected: string[];
  hasMoreOptions?: boolean;
  isLoadingOptions?: boolean;
  isLoadingMoreOptions?: boolean;
  onChange: (nextSelected: string[]) => void;
  onLoadMoreOptions?: () => void;
  onSearchKeywordChange?: (keyword: string) => void;
};

export type CheckboxFilterProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export type YearFilterProps = {
  filters: SearchFilters;
  updateFilter: UpdateSearchFilter;
};

export type CitationFilterProps = {
  filters: SearchFilters;
  updateFilter: UpdateSearchFilter;
};

export type OrcidFilterProps = {
  value: SearchFilters["indexedByOrcid"];
  updateFilter: UpdateSearchFilter;
};

export type SearchResultsProps = {
  appliedSearchQuery: string;
  autoLoadAnchorIndex: number;
  canLoadMoreResults: boolean;
  hasSearched: boolean;
  isLoadingResults: boolean;
  isLoadingMoreResults: boolean;
  responseTimeSeconds: number;
  sortState: SearchSortState;
  totalResultCount: number;
  visiblePaperResults: PaperResult[];
  onLoadMoreResults: () => void;
  onClearSorts: () => void;
  onSelectSort: (sortOption: string) => void;
};

export type ResultsListProps = {
  autoLoadAnchorIndex: number;
  visiblePaperResults: PaperResult[];
};

