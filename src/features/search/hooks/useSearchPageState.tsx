import { useEffect, useState } from "react";
import { useNavigationType } from "react-router-dom";

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
import { initialFilters } from "../constants";
import {
  defaultSearchSortState,
  getSearchEntityMetadata,
  getTrendingKeywords,
  getTrendingTopics,
  normalizeSearchSortState,
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
} from "./stateHelpers";
import type { SearchPageSnapshot } from "./types";
import {
  getNextSortStateForEntityType,
  getVisibleFilterWidgets,
  shouldClearSearchState,
} from "./searchPageHelpers";
import { useSearchHistoryState } from "./useSearchHistoryState";
import { useSearchPagePersistence } from "./useSearchPagePersistence";
import { useSearchResultsState } from "./useSearchResultsState";
import { useRemoteFilterOptions } from "./useRemoteFilterOptions";

export function useSearchPageState() {
  const { isAuthenticated } = useAuthSession();
  const dispatch = useAppDispatch();
  const navigationType = useNavigationType();
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
  const [hasLoadedTrendSnapshot, setHasLoadedTrendSnapshot] = useState(false);
  const [topicHotSearches, setTopicHotSearches] = useState<string[]>([]);
  const [trendingTopicNames, setTrendingTopicNames] = useState<string[]>([]);
  const [trendingKeywordNames, setTrendingKeywordNames] = useState<string[]>([]);
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
    autoLoadAnchorIndex,
    canLoadMoreResults,
    hasSearched,
    isIndexedCountExact,
    isLoadingMoreResults,
    isLoadingResults,
    isTotalResultCountExact,
    matchedResultCount,
    responseTimeSeconds,
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
    restoredSnapshot,
    remoteFilterOptionsSnapshot,
    searchPageState,
    visibleResultCount: visibleResults.length,
  });

  useEffect(() => {
    if (trendingTopicNames.length > 0 && trendingKeywordNames.length > 0) {
      return;
    }

    let isCancelled = false;

    async function loadWeeklyTrendSnapshot() {
      try {
        const [topicResult, keywordResult] = await Promise.allSettled([
          getTrendingTopics(undefined, 12),
          getTrendingKeywords(undefined, 16),
        ]);

        if (isCancelled) {
          return;
        }

        const topicResponse =
          topicResult.status === "fulfilled" ? topicResult.value : null;
        const keywordResponse =
          keywordResult.status === "fulfilled" ? keywordResult.value : null;

        const nextTrendingTopics = (topicResponse?.topics || [])
          .map((item) => item.name.trim())
          .filter((label, index, array) => label.length > 0 && array.indexOf(label) === index);
        const nextTrendingKeywords = (keywordResponse?.keywords || [])
          .map((item) => item.name.trim())
          .filter((label, index, array) => label.length > 0 && array.indexOf(label) === index);

        setTrendingTopicNames(nextTrendingTopics);
        setTrendingKeywordNames(nextTrendingKeywords);
        setTopicHotSearches(nextTrendingTopics.slice(0, 8));
        setHasLoadedTrendSnapshot(true);
      } catch (error) {
        if (!isCancelled) {
          console.error("Cannot load weekly trend snapshot:", error);
          setHasLoadedTrendSnapshot(true);
        }
      }
    }

    void loadWeeklyTrendSnapshot();

    return () => {
      isCancelled = true;
    };
  }, [trendingKeywordNames.length, trendingTopicNames.length]);

  // Centralize how a search request is submitted so every user action
  // eventually funnels through one readable path.
  function submitSearchRequest(
    nextEntityType: SearchEntityType,
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSortState = sortState,
    nextOptionValueLookup = optionValueLookup,
  ) {
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
  ) {
    const normalizedQuery = nextQuery.trim();

    if (shouldClearSearchState(nextEntityType, normalizedQuery, nextFilters)) {
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
  }

  function handleEntityTypeChange(nextEntityType: SearchEntityType) {
    if (nextEntityType === activeEntityType) {
      return;
    }

    searchHistory.clearSaveSearchFeedback();
    dispatch(setActiveEntityType(nextEntityType));
    const nextSortState = getNextSortStateForEntityType(
      activeEntityType,
      nextEntityType,
      sortState,
    );
    dispatch(setSortState(nextSortState));

    runSearchOrClear(
      nextEntityType,
      searchQuery,
      filters,
      nextSortState,
      optionValueLookup,
    );
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

  function handleLoadMoreResults() {
    searchResults.handleLoadMoreResults();
  }

  function handleSelectSort(nextSort: string) {
    const nextSortState = nextSort
      ? normalizeSearchSortState(nextSort)
      : { ...defaultSearchSortState };

    dispatch(setSortState(nextSortState));

    if (!submittedSearch) {
      return;
    }

    runSearchOrClear(
      submittedSearch.entityType,
      searchResults.appliedSearchQuery,
      searchResults.appliedFilters,
      nextSortState,
      submittedSearch.optionValueLookup,
    );
  }

  function handleClearSorts() {
    dispatch(setSortState({ ...defaultSearchSortState }));

    if (!submittedSearch) {
      return;
    }

    runSearchOrClear(
      submittedSearch.entityType,
      searchResults.appliedSearchQuery,
      searchResults.appliedFilters,
      defaultSearchSortState,
      submittedSearch.optionValueLookup,
    );
  }

  function resetFilters() {
    dispatch(resetSearchFilters());

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
    autoLoadAnchorIndex,
    canSaveSearch: searchHistory.canSaveSearch,
    canLoadMoreResults,
    filterOptions,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleClearRecentSearches: searchHistory.handleClearRecentSearches,
    handleClearSorts,
    handleDeleteRecentSearch: searchHistory.handleDeleteRecentSearch,
    handleEntityTypeChange,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    handleLoadMoreResults,
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
    isLoadingMoreResults,
    isLoadingResults,
    isSavingSearch: searchHistory.isSavingSearch,
    isTotalResultCountExact,
    matchedResultCount,
    recentSearches: searchHistory.recentSearches,
    resetFilters,
    responseTimeSeconds,
    saveSearchFeedback: searchHistory.saveSearchFeedback,
    saveSearchNotice: searchHistory.saveSearchNotice,
    saveSearchSuccessToken: searchHistory.saveSearchSuccessToken,
    hasLoadedTrendSnapshot,
    topicHotSearches,
    trendingKeywordNames,
    trendingTopicNames,
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
