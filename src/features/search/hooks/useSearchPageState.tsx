import { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigationType } from "react-router-dom";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearSearchResults,
  hydrateSearchPageState,
  resetSearchFilters,
  resetSearchPageState,
  selectSearchPageState,
  setActiveEntityType,
  setFiltersOpen,
  setSearchQuery,
  setSortState,
  submitSearch,
  toggleVisibleFilterWidget,
  updateSearchFilter,
} from "@/features/search/store/searchPageSlice";
import {
  initialFilters,
  SEARCH_DEFAULT_PAGE,
  SEARCH_RECENT_SEARCH_LIMIT,
} from "../constants";
import {
  clearSearchHistory,
  defaultSearchSortState,
  deleteSearchHistory,
  getRecentSearches,
  getSearchSummary,
  searchEntities,
  searchWorks,
} from "../services";
import {
  getSearchEntityMetadata,
  normalizeSearchSortState,
  saveSearchHistory,
} from "../services";
import type {
  SaveSearchFeedback,
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
import {
  clearSearchPageRestorePending,
  readSearchPageRestorePending,
} from "../utils/navigationState";
import {
  flattenSearchResultPages,
  getAutoLoadAnchorIndex,
  getNextSearchResultsPage,
  getSearchResponseTime,
} from "./resultHelpers";
import {
  buildSearchPageSnapshot,
  cloneSearchFilters,
  isReloadNavigation,
  persistSearchPageSnapshot,
  readPersistedSearchPageSnapshot,
} from "./stateHelpers";
import type { SearchPageSnapshot } from "./types";
import { useRemoteFilterOptions } from "./useRemoteFilterOptions";

const SEARCH_HISTORY_QUERY_DEBOUNCE_MS = 250;
const SAVE_SEARCH_FEEDBACK_DURATION_MS = 2800;

function getMutationErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

export function useSearchPageState() {
  const { isAuthenticated } = useAuthSession();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigationType = useNavigationType();
  const isSearchHistoryEnabled = isAuthenticated;
  const shouldRestoreSearchPageState =
    navigationType === "POP"
    && readSearchPageRestorePending()
    && !isReloadNavigation();
  const [restoredSnapshot] = useState<SearchPageSnapshot | null>(() =>
    shouldRestoreSearchPageState ? readPersistedSearchPageSnapshot() : null,
  );
  const [debouncedRecentSearchKeyword, setDebouncedRecentSearchKeyword] =
    useState("");
  const [saveSearchFeedback, setSaveSearchFeedback] =
    useState<SaveSearchFeedback | null>(null);
  const [saveSearchSuccessToken, setSaveSearchSuccessToken] = useState(0);
  const hasInitializedRef = useRef(false);
  const shouldRestoreScrollRef = useRef(Boolean(restoredSnapshot));
  const latestSnapshotRef = useRef<SearchPageSnapshot | null>(restoredSnapshot);
  const searchPageState = useAppSelector(selectSearchPageState);
  const {
    activeEntityType,
    filters,
    filtersOpen,
    searchQuery,
    sortState,
    submittedSearch,
    visibleFilterWidgets,
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
    filters,
    filtersOpen && isWorksTab,
    restoredSnapshot?.remoteFilterOptions,
  );
  const searchSummaryQuery = useQuery({
    queryFn: () => getSearchSummary(activeEntityType),
    queryKey: ["searchSummary", activeEntityType],
  });
  const recentSearchesQuery = useQuery({
    enabled: isSearchHistoryEnabled,
    queryFn: () =>
      getRecentSearches(
        debouncedRecentSearchKeyword,
        SEARCH_RECENT_SEARCH_LIMIT,
      ),
    queryKey: [
      "searchHistoryRecent",
      debouncedRecentSearchKeyword,
      SEARCH_RECENT_SEARCH_LIMIT,
    ],
    staleTime: 60 * 1000,
  });
  const saveSearchMutation = useMutation({
    mutationFn: saveSearchHistory,
    onError: (error) => {
      console.error("Cannot save search history:", error);
      setSaveSearchFeedback({
        kind: "error",
        message: getMutationErrorMessage(error, "Could not save search history."),
      });
    },
    onSuccess: () => {
      setSaveSearchFeedback({
        kind: "success",
        message: "Saved successfully.",
      });
      setSaveSearchSuccessToken((currentValue) => currentValue + 1);
      void queryClient.invalidateQueries({
        queryKey: ["searchHistoryRecent"],
      });
    },
  });
  const deleteSearchMutation = useMutation({
    mutationFn: deleteSearchHistory,
    onError: (error) => {
      console.error("Cannot delete search history item:", error);
      setSaveSearchFeedback({
        kind: "error",
        message: getMutationErrorMessage(
          error,
          "Could not delete search history.",
        ),
      });
    },
    onSuccess: () => {
      setSaveSearchFeedback({
        kind: "success",
        message: "Deleted successfully.",
      });
      void queryClient.invalidateQueries({
        queryKey: ["searchHistoryRecent"],
      });
    },
  });
  const clearSearchMutation = useMutation({
    mutationFn: clearSearchHistory,
    onError: (error) => {
      console.error("Cannot clear search history:", error);
      setSaveSearchFeedback({
        kind: "error",
        message: getMutationErrorMessage(error, "Could not clear search history."),
      });
    },
    onSuccess: () => {
      setSaveSearchFeedback({
        kind: "success",
        message: "Cleared successfully.",
      });
      void queryClient.invalidateQueries({
        queryKey: ["searchHistoryRecent"],
      });
    },
  });
  const searchResultsQuery = useInfiniteQuery({
    enabled: submittedSearch !== null,
    getNextPageParam: getNextSearchResultsPage,
    initialPageParam: SEARCH_DEFAULT_PAGE,
    queryFn: ({ pageParam }) => {
      if (!submittedSearch) {
        throw new Error("Search request is missing.");
      }

      if (submittedSearch.entityType === "works") {
        return searchWorks({
          appliedSearchQuery: submittedSearch.appliedSearchQuery,
          filters: submittedSearch.appliedFilters,
          optionValueLookup: submittedSearch.optionValueLookup,
          page: Number(pageParam),
          sortState: submittedSearch.sortState,
        });
      }

      return searchEntities({
        appliedSearchQuery: submittedSearch.appliedSearchQuery,
        entityType: submittedSearch.entityType,
        page: Number(pageParam),
      });
    },
    queryKey: ["searchResults", submittedSearch],
  });

  useEffect(() => {
    if (restoredSnapshot) {
      dispatch(hydrateSearchPageState(restoredSnapshot));
    } else {
      dispatch(resetSearchPageState());
    }

    clearSearchPageRestorePending();

    return () => {
      const latestSnapshot = latestSnapshotRef.current;

      if (latestSnapshot) {
        persistSearchPageSnapshot({
          ...latestSnapshot,
          scrollY: window.scrollY,
        });
      }

      dispatch(resetSearchPageState());
    };
  }, [dispatch, restoredSnapshot]);

  useEffect(() => {
    if (searchSummaryQuery.error) {
      console.error("Cannot load search summary:", searchSummaryQuery.error);
    }
  }, [searchSummaryQuery.error]);

  useEffect(() => {
    const normalizedKeyword = searchQuery.trim();
    const timerId = window.setTimeout(() => {
      setDebouncedRecentSearchKeyword(normalizedKeyword);
    }, SEARCH_HISTORY_QUERY_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (recentSearchesQuery.error) {
      console.error(
        "Cannot load recent search history:",
        recentSearchesQuery.error,
      );
    }
  }, [recentSearchesQuery.error]);

  useEffect(() => {
    if (searchResultsQuery.error) {
      console.error("Search API failed:", searchResultsQuery.error);
    }
  }, [searchResultsQuery.error]);

  useEffect(() => {
    if (!saveSearchFeedback) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSaveSearchFeedback(null);
    }, SAVE_SEARCH_FEEDBACK_DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [saveSearchFeedback]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    const snapshot = buildSearchPageSnapshot(
      searchPageState,
      remoteFilterOptionsSnapshot,
      window.scrollY,
    );

    latestSnapshotRef.current = snapshot;
    persistSearchPageSnapshot(snapshot);
  }, [remoteFilterOptionsSnapshot, searchPageState]);

  const appliedSearchQuery = submittedSearch?.appliedSearchQuery || "";
  const appliedEntityType = submittedSearch?.entityType || activeEntityType;
  const appliedFilters =
    submittedSearch?.entityType === "works"
      ? submittedSearch.appliedFilters
      : initialFilters;
  const visibleResults = flattenSearchResultPages(
    searchResultsQuery.data?.pages || [],
    appliedEntityType,
    submittedSearch?.sortState || sortState,
  );
  const latestResultsPage =
    searchResultsQuery.data?.pages[
      Math.max((searchResultsQuery.data?.pages.length || 1) - 1, 0)
    ];
  const hasSearched = submittedSearch !== null;
  const hasMoreResults = Boolean(searchResultsQuery.hasNextPage);
  const canLoadMoreResults = hasMoreResults && visibleResults.length > 0;
  const matchedResultCount = latestResultsPage?.totalCount || 0;
  const isTotalResultCountExact =
    latestResultsPage?.entityType === "works"
      ? true
      : latestResultsPage?.totalCountExact ?? true;
  const responseTimeSeconds = getSearchResponseTime(
    searchResultsQuery.data?.pages || [],
  );
  const autoLoadAnchorIndex = getAutoLoadAnchorIndex(
    hasSearched,
    hasMoreResults,
    searchResultsQuery.data?.pages.length || 0,
  );
  const showFilters = isWorksTab;
  const activeFilterCount = showFilters ? countActiveFilters(filters) : 0;
  const appliedFilterSummary =
    appliedEntityType === "works" ? buildAppliedFilterSummary(appliedFilters) : [];
  const hasFormError = showFilters
    ? hasInvalidYearRange(filters) || hasInvalidCitationRange(filters)
    : false;
  const recentSearches = recentSearchesQuery.data || [];
  const canSaveSearch = isSearchHistoryEnabled && Boolean(searchQuery.trim());
  const saveSearchNotice =
    !isSearchHistoryEnabled && Boolean(searchQuery.trim())
      ? "Sign in to save search history."
      : null;
  const totalIndexedCount = searchSummaryQuery.data?.totalIndexedCount || 0;
  const isIndexedCountExact = searchSummaryQuery.data?.totalCountExact ?? true;

  useEffect(() => {
    if (!shouldRestoreScrollRef.current) {
      return;
    }

    shouldRestoreScrollRef.current = false;
    const restoredScrollY = restoredSnapshot?.scrollY ?? 0;

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: restoredScrollY,
        behavior: "auto",
      });
    });
  }, [restoredSnapshot, visibleResults.length]);

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

  function shouldClearWorkSearch(nextQuery: string, nextFilters: SearchFilters) {
    return !nextQuery && countActiveFilters(nextFilters) === 0;
  }

  function handleEntityTypeChange(nextEntityType: SearchEntityType) {
    if (nextEntityType === activeEntityType) {
      return;
    }

    setSaveSearchFeedback(null);
    dispatch(setActiveEntityType(nextEntityType));

    if (nextEntityType !== "works") {
      dispatch(setFiltersOpen(false));
    }

    const normalizedQuery = searchQuery.trim();

    if (nextEntityType === "works") {
      if (shouldClearWorkSearch(normalizedQuery, filters)) {
        dispatch(clearSearchResults());
        return;
      }

      submitSearchRequest(
        nextEntityType,
        normalizedQuery,
        filters,
        sortState,
        optionValueLookup,
      );
      return;
    }

    if (!normalizedQuery) {
      dispatch(clearSearchResults());
      return;
    }

    submitSearchRequest(
      nextEntityType,
      normalizedQuery,
      filters,
      defaultSearchSortState,
      optionValueLookup,
    );
  }

  function handleSearchQueryChange(nextQuery: string) {
    setSaveSearchFeedback(null);
    dispatch(setSearchQuery(nextQuery));
  }

  function handleApplyFilters() {
    if (!showFilters || hasFormError) {
      return;
    }

    const normalizedQuery = searchQuery.trim();

    if (shouldClearWorkSearch(normalizedQuery, filters)) {
      dispatch(clearSearchResults());
      return;
    }

    submitSearchRequest(
      "works",
      normalizedQuery,
      filters,
      sortState,
      optionValueLookup,
    );
  }

  function handleSearch() {
    const normalizedQuery = searchQuery.trim();

    if (activeEntityType === "works") {
      if (shouldClearWorkSearch(normalizedQuery, filters)) {
        dispatch(clearSearchResults());
        return;
      }

      submitSearchRequest(
        "works",
        normalizedQuery,
        filters,
        sortState,
        optionValueLookup,
      );
      return;
    }

    if (!normalizedQuery) {
      dispatch(clearSearchResults());
      return;
    }

    submitSearchRequest(
      activeEntityType,
      normalizedQuery,
      filters,
      defaultSearchSortState,
      optionValueLookup,
    );
  }

  function handleSuggestedSearch(query: string) {
    dispatch(setSearchQuery(query));

    if (activeEntityType === "works") {
      submitSearchRequest(
        "works",
        query,
        filters,
        sortState,
        optionValueLookup,
      );
      return;
    }

    submitSearchRequest(
      activeEntityType,
      query,
      filters,
      defaultSearchSortState,
      optionValueLookup,
    );
  }

  function handleSaveSearch() {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery || saveSearchMutation.isPending) {
      return;
    }

    void saveSearchMutation.mutateAsync(normalizedQuery);
  }

  function handleDeleteRecentSearch(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery || deleteSearchMutation.isPending) {
      return;
    }

    void deleteSearchMutation.mutateAsync(normalizedQuery);
  }

  function handleClearRecentSearches() {
    if (clearSearchMutation.isPending) {
      return;
    }

    void clearSearchMutation.mutateAsync();
  }

  function handleToggleFilters() {
    if (!showFilters) {
      return;
    }

    dispatch(setFiltersOpen(!filtersOpen));
  }

  function handleToggleVisibleFilterWidget(widgetKey: SearchFilterWidgetKey) {
    dispatch(toggleVisibleFilterWidget(widgetKey));
  }

  function handleLoadMoreResults() {
    if (!canLoadMoreResults || searchResultsQuery.isFetchingNextPage) {
      return;
    }

    void searchResultsQuery.fetchNextPage();
  }

  function handleSelectSort(nextSort: string) {
    const nextSortState = nextSort
      ? normalizeSearchSortState(nextSort)
      : { ...defaultSearchSortState };

    dispatch(setSortState(nextSortState));

    if (!submittedSearch || submittedSearch.entityType !== "works") {
      return;
    }

    submitSearchRequest(
      "works",
      appliedSearchQuery,
      appliedFilters,
      nextSortState,
      submittedSearch.optionValueLookup,
    );
  }

  function handleClearSorts() {
    dispatch(setSortState({ ...defaultSearchSortState }));

    if (!submittedSearch || submittedSearch.entityType !== "works") {
      return;
    }

    submitSearchRequest(
      "works",
      appliedSearchQuery,
      appliedFilters,
      defaultSearchSortState,
      submittedSearch.optionValueLookup,
    );
  }

  function resetFilters() {
    dispatch(resetSearchFilters());

    if (!hasSearched || appliedEntityType !== "works") {
      return;
    }

    const resetFilterState = cloneSearchFilters(initialFilters);

    if (shouldClearWorkSearch(appliedSearchQuery, resetFilterState)) {
      dispatch(clearSearchResults());
      return;
    }

    submitSearchRequest(
      "works",
      appliedSearchQuery,
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
    canSaveSearch,
    canLoadMoreResults,
    filterOptions,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleClearRecentSearches,
    handleClearSorts,
    handleDeleteRecentSearch,
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
    isClearingRecentSearches: clearSearchMutation.isPending,
    isDeletingRecentSearch: deleteSearchMutation.isPending,
    isIndexedCountExact,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    isLoadingMoreResults: searchResultsQuery.isFetchingNextPage,
    isLoadingResults: submittedSearch !== null && searchResultsQuery.isPending,
    isSavingSearch: saveSearchMutation.isPending,
    isTotalResultCountExact,
    matchedResultCount,
    recentSearches,
    resetFilters,
    responseTimeSeconds,
    saveSearchFeedback,
    saveSearchNotice,
    saveSearchSuccessToken,
    searchPlaceholder: activeEntityMetadata.placeholder,
    searchQuery,
    showFilters,
    sortState,
    totalIndexedCount,
    updateFilter,
    visibleFilterWidgets,
    visibleResults,
  };
}
