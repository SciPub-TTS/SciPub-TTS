import type {
  RemoteOptionFilterKey,
  SearchEntityType,
  RemoteOptionStateMap,
  SearchFilterOptions,
  SearchFilters,
  SearchFilterWidgetKey,
  SearchSortState,
} from "../types";
import type { SearchOptionValueLookup } from "../services";

export type SubmittedSearch = {
  appliedFilters: SearchFilters;
  appliedSearchQuery: string;
  entityType: SearchEntityType;
  optionValueLookup: SearchOptionValueLookup;
  sortState: SearchSortState;
};

export type RemoteFilterOptionsSnapshot = {
  filterOptions: SearchFilterOptions;
  hasMoreFilterOptions: RemoteOptionStateMap;
  optionValueLookup: SearchOptionValueLookup;
  remoteOptionKeywords: Record<RemoteOptionFilterKey, string>;
  remoteOptionPages: Record<RemoteOptionFilterKey, number>;
};

export type SearchPageSnapshot = {
  activeEntityType: SearchEntityType;
  filters: SearchFilters;
  filtersOpen: boolean;
  remoteFilterOptions: RemoteFilterOptionsSnapshot;
  scrollY: number;
  searchQuery: string;
  sortState: SearchSortState;
  submittedSearch: SubmittedSearch | null;
  visibleFilterWidgets: SearchFilterWidgetKey[];
};
