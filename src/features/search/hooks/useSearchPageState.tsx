import { useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearSearchResults,
  resetSearchFilters,
  selectSearchPageState,
  setActiveEntityType,
  setFiltersOpen,
  setSearchQuery,
  setSortState,
  submitSearch,
  toggleVisibleFilterWidget,
  updateSearchFilter,
} from "@/features/search/store/searchPageSlice";
import { initialFilters, SEARCH_DEFAULT_PAGE } from "../constants";
import {
  createSearchSortStateFromOption,
  defaultSearchSortState,
  getSearchEntityMetadata,
  updateSearchSortStateFromOption,
} from "../services";
import type {
  SearchEntityType,
  SearchFilters,
  SearchFilterWidgetKey,
} from "../types";
import {
  buildAppliedFilterSummary,
  countActiveFilters,
  hasInvalidCitationRange,
  hasInvalidYearRange,
} from "../utils";
import { readSearchPageRestorePending } from "../utils/navigationState";
import {
  cloneSearchFilters,
  isReloadNavigation,
  readPersistedSearchPageSnapshot,
  type SearchPageSnapshot,
} from "./stateHelpers";
import { useSearchHistoryState } from "./useSearchHistoryState";
import { useSearchPagePersistence } from "./useSearchPagePersistence";
import { useSearchResultsState } from "./useSearchResultsState";
import { useRemoteFilterOptions } from "./useRemoteFilterOptions";

const authorFilterWidgets: SearchFilterWidgetKey[] = [
  "institution",
  "country",
];

const topicFilterWidgets: SearchFilterWidgetKey[] = [
  "subField",
  "field",
];

export function useSearchPageState() {
  const { isAuthenticated } = useAuthSession();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigationType = useNavigationType();
  const requestedEntityType = normalizeRequestedSearchEntityType(
    (location.state as { initialEntityType?: string } | null)?.initialEntityType ?? null,
  );
  const isSearchHistoryEnabled = isAuthenticated;
  const shouldRestoreSearchPageState =
    navigationType === "POP"
    && readSearchPageRestorePending()
    && !isReloadNavigation();
  const [restoredSnapshot] = useState<SearchPageSnapshot | null>(() =>
    shouldRestoreSearchPageState ? readPersistedSearchPageSnapshot() : null,
  );
  const searchPageState = useAppSelector(selectSearchPageState);
  const {
    activeEntityType,
    filters,
    filtersOpen,
    searchQuery,
    sortState,
    submittedSearch,
    visibleFilterWidgets: storedVisibleFilterWidgets,
  } = searchPageState;
  const isWorksTab = activeEntityType === "works";
  const activeEntityMetadata = getSearchEntityMetadata(activeEntityType);
  const {
    filterOptions,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    hasMoreFilterOptions,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    optionValueLookup,
    remoteFilterOptionsSnapshot,
  } = useRemoteFilterOptions(
    activeEntityType,
    filters,
    filtersOpen,
    restoredSnapshot?.remoteFilterOptions,
  );
  const searchHistory = useSearchHistoryState({
    isSearchHistoryEnabled,
    searchQuery,
  });
  const searchResults = useSearchResultsState({
    activeEntityType,
    currentSortState: sortState,
    submittedSearch,
  });
  const {
    appliedEntityType,
    appliedFilters,
    appliedSearchQuery,
    currentResultPage,
    hasSearched,
    handleResultPageChange,
    isIndexedCountExact,
    isLoadingResults,
    isTotalResultCountExact,
    matchedResultCount,
    resultErrorMessage,
    resultPageSize,
    totalIndexedCount,
    visibleResults,
  } = searchResults;
  const visibleFilterWidgets = getVisibleFilterWidgets(
    activeEntityType,
    storedVisibleFilterWidgets,
  );
  const showFilters = true;
  const showFilterAddMenu = isWorksTab;
  const activeFilterCount = countActiveFilters(activeEntityType, filters);
  const appliedFilterSummary = buildAppliedFilterSummary(
    appliedEntityType,
    appliedFilters,
  );
  const hasFormError = isWorksTab
    ? hasInvalidYearRange(filters) || hasInvalidCitationRange(filters)
    : false;

  useSearchPagePersistence({
    dispatch,
    initialEntityType: requestedEntityType,
    restoredSnapshot,
    remoteFilterOptionsSnapshot,
    searchPageState,
  });

  function submitSearchRequest(
    nextEntityType: SearchEntityType,
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSortState = sortState,
    nextOptionValueLookup = optionValueLookup,
  ) {
    searchResults.handleResultPageChange(SEARCH_DEFAULT_PAGE);
    dispatch(submitSearch({
      appliedFilters: nextFilters,
      appliedSearchQuery: nextQuery,
      entityType: nextEntityType,
      optionValueLookup: nextOptionValueLookup,
      sortState: nextSortState,
    }));
  }

  function runSearchOrClear(
    nextEntityType: SearchEntityType,
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSortState = sortState,
    nextOptionValueLookup = optionValueLookup,
    shouldRecordSearchHistory = true,
  ) {
    const normalizedQuery = nextQuery.trim();

    if (shouldClearSearchState(nextEntityType, normalizedQuery, nextFilters)) {
      searchResults.handleResultPageChange(SEARCH_DEFAULT_PAGE);
      dispatch(clearSearchResults());
      return;
    }

    submitSearchRequest(
      nextEntityType,
      normalizedQuery,
      nextFilters,
      nextSortState,
      nextOptionValueLookup,
    );

    if (shouldRecordSearchHistory) {
      searchHistory.recordSearchHistory(normalizedQuery);
    }
  }

  function handleEntityTypeChange(nextEntityType: SearchEntityType) {
    if (nextEntityType === activeEntityType) {
      return;
    }

    searchHistory.clearSaveSearchFeedback();
    dispatch(setActiveEntityType(nextEntityType));
    searchResults.handleResultPageChange(SEARCH_DEFAULT_PAGE);
    const nextSortState = getNextSortStateForEntityType(
      activeEntityType,
      nextEntityType,
      sortState,
    );
    dispatch(setSortState(nextSortState));
    dispatch(setSearchQuery(""));
    dispatch(clearSearchResults());
  }

  function handleSearchQueryChange(nextQuery: string) {
    searchHistory.clearSaveSearchFeedback();
    dispatch(setSearchQuery(nextQuery));
  }

  function handleApplyFilters() {
    if (!showFilters || hasFormError) {
      return;
    }

    runSearchOrClear(activeEntityType, searchQuery, filters);
  }

  function handleSearch() {
    searchHistory.clearSaveSearchFeedback();
    runSearchOrClear(activeEntityType, searchQuery, filters);
  }

  function handleSuggestedSearch(query: string) {
    searchHistory.clearSaveSearchFeedback();
    dispatch(setSearchQuery(query));

    runSearchOrClear(activeEntityType, query, filters);
  }

  function handleSaveSearch() {
    searchHistory.handleSaveSearch();
  }

  function handleToggleFilters() {
    if (!showFilters) {
      return;
    }

    dispatch(setFiltersOpen(!filtersOpen));
  }

  function handleToggleVisibleFilterWidget(widgetKey: SearchFilterWidgetKey) {
    if (!showFilterAddMenu) {
      return;
    }

    dispatch(toggleVisibleFilterWidget(widgetKey));
  }

  function handleSelectSort(nextSort: string) {
    const nextSortState = nextSort
      ? activeEntityType === "works"
        ? updateSearchSortStateFromOption(sortState, nextSort)
        : createSearchSortStateFromOption(nextSort)
      : { ...defaultSearchSortState };

    dispatch(setSortState(nextSortState));
  }

  function handleApplySort() {
    if (!submittedSearch) {
      return;
    }

    runSearchOrClear(
      submittedSearch.entityType,
      searchResults.appliedSearchQuery,
      searchResults.appliedFilters,
      sortState,
      submittedSearch.optionValueLookup,
      false,
    );
  }

  function handleClearSorts() {
    dispatch(setSortState({ ...defaultSearchSortState }));
  }

  function resetFilters() {
    dispatch(resetSearchFilters());
    searchResults.handleResultPageChange(SEARCH_DEFAULT_PAGE);

    if (!hasSearched) {
      return;
    }

    const resetFilterState = cloneSearchFilters(initialFilters);

    runSearchOrClear(
      searchResults.appliedEntityType,
      searchResults.appliedSearchQuery,
      resetFilterState,
      sortState,
      optionValueLookup,
      false,
    );
  }

  function updateFilter(
    key: keyof SearchFilters,
    value: SearchFilters[keyof SearchFilters],
  ) {
    dispatch(updateSearchFilter({ key, value }));
  }

  return {
    activeEntityType,
    activeFilterCount,
    appliedFilterSummary,
    appliedSearchQuery,
    canSaveSearch: searchHistory.canSaveSearch,
    currentResultPage,
    filterOptions,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleApplySort,
    handleClearRecentSearches: searchHistory.handleClearRecentSearches,
    handleClearSorts,
    handleDeleteRecentSearch: searchHistory.handleDeleteRecentSearch,
    handleEntityTypeChange,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    handleResultPageChange,
    handleSaveSearch,
    handleSearch,
    handleSearchQueryChange,
    handleSelectSort,
    handleSuggestedSearch,
    handleToggleFilters,
    handleToggleVisibleFilterWidget,
    hasFormError,
    hasSearched,
    hasMoreFilterOptions,
    isClearingRecentSearches: searchHistory.isClearingRecentSearches,
    isDeletingRecentSearch: searchHistory.isDeletingRecentSearch,
    isIndexedCountExact,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    isLoadingResults,
    isSavingSearch: searchHistory.isSavingSearch,
    isTotalResultCountExact,
    matchedResultCount,
    recentSearches: searchHistory.recentSearches,
    resetFilters,
    resultErrorMessage,
    resultPageSize,
    saveSearchFeedback: searchHistory.saveSearchFeedback,
    saveSearchNotice: searchHistory.saveSearchNotice,
    saveSearchSuccessToken: searchHistory.saveSearchSuccessToken,
    searchPlaceholder: activeEntityMetadata.placeholder,
    searchQuery,
    showFilters,
    showFilterAddMenu,
    sortState,
    totalIndexedCount,
    updateFilter,
    visibleFilterWidgets,
    visibleResults,
  };
}

function shouldClearSearchState(
  entityType: SearchEntityType,
  searchQuery: string,
  filters: SearchFilters,
) {
  return !searchQuery && countActiveFilters(entityType, filters) === 0;
}

function getVisibleFilterWidgets(
  entityType: SearchEntityType,
  visibleFilterWidgets: SearchFilterWidgetKey[],
) {
  switch (entityType) {
    case "authors":
      return authorFilterWidgets;
    case "topics":
      return topicFilterWidgets;
    default:
      return visibleFilterWidgets;
  }
}

function getNextSortStateForEntityType(
  currentEntityType: SearchEntityType,
  nextEntityType: SearchEntityType,
  currentSortState: SearchPageSnapshot["sortState"],
) {
  const isCrossingWorkBoundary =
    (currentEntityType === "works") !== (nextEntityType === "works");

  return isCrossingWorkBoundary
    ? { ...defaultSearchSortState }
    : currentSortState;
}

function normalizeRequestedSearchEntityType(tab: string | null): SearchEntityType | null {
  if (tab === "authors" || tab === "topics" || tab === "works") {
    return tab;
  }

  return null;
}
