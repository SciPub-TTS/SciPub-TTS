import { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigationType } from "react-router-dom";
import { isAuthenticated } from "@/features/auth/utils/authStorage";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearSearchResults,
  hydrateSearchPageState,
  resetSearchFilters,
  resetSearchPageState,
  selectSearchPageState,
  setFiltersOpen,
  setSearchQuery,
  setSortState,
  submitSearch,
  toggleVisibleFilterWidget,
  updateSearchFilter,
} from "@/store/slices/searchPageSlice";
import {
  initialFilters,
  SEARCH_DEFAULT_PAGE,
  SEARCH_RECENT_SEARCH_LIMIT,
} from "../constants";
import {
  defaultSearchSortState,
  emptySearchOptionValueLookup,
  getRecentSearches,
  getSearchSummary,
  normalizeSearchSortState,
  saveSearchHistory,
  searchWorks,
} from "../services";
import type { SearchFilters, SearchFilterWidgetKey } from "../types";
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

export function useSearchPageState() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigationType = useNavigationType();
  const isSearchHistoryEnabled = isAuthenticated();
  const shouldRestoreSearchPageState =
    navigationType === "POP"
    && readSearchPageRestorePending()
    && !isReloadNavigation();
  const [restoredSnapshot] = useState<SearchPageSnapshot | null>(() =>
    shouldRestoreSearchPageState ? readPersistedSearchPageSnapshot() : null,
  );
  const hasInitializedRef = useRef(false);
  const shouldRestoreScrollRef = useRef(Boolean(restoredSnapshot));
  const latestSnapshotRef = useRef<SearchPageSnapshot | null>(restoredSnapshot);
  const searchPageState = useAppSelector(selectSearchPageState);
  const {
    filters,
    filtersOpen,
    searchQuery,
    sortState,
    submittedSearch,
    visibleFilterWidgets,
  } = searchPageState;
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
    filtersOpen,
    restoredSnapshot?.remoteFilterOptions,
  );
  const searchSummaryQuery = useQuery({
    queryFn: () => getSearchSummary(),
    queryKey: ["searchSummary"],
    staleTime: 10 * 60 * 1000,
  });
  const normalizedSearchHistoryKeyword = searchQuery.trim();
  const recentSearchesQuery = useQuery({
    enabled: isSearchHistoryEnabled,
    queryFn: () =>
      getRecentSearches(
        normalizedSearchHistoryKeyword,
        SEARCH_RECENT_SEARCH_LIMIT,
      ),
    queryKey: [
      "searchHistoryRecent",
      normalizedSearchHistoryKeyword,
      SEARCH_RECENT_SEARCH_LIMIT,
    ],
    staleTime: 60 * 1000,
  });
  const saveSearchMutation = useMutation({
    mutationFn: saveSearchHistory,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["searchHistoryRecent"],
      });
    },
  });
  const searchResultsQuery = useInfiniteQuery({
    enabled: submittedSearch !== null,
    getNextPageParam: getNextSearchResultsPage,
    initialPageParam: SEARCH_DEFAULT_PAGE,
    queryFn: ({ pageParam }) =>
      searchWorks({
        appliedSearchQuery: submittedSearch?.appliedSearchQuery || "",
        filters: submittedSearch?.appliedFilters || initialFilters,
        optionValueLookup:
          submittedSearch?.optionValueLookup || emptySearchOptionValueLookup,
        page: Number(pageParam),
        sortState: submittedSearch?.sortState || defaultSearchSortState,
      }),
    queryKey: ["searchWorks", submittedSearch],
    staleTime: 30 * 1000,
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
    if (saveSearchMutation.error) {
      console.error("Cannot save search history:", saveSearchMutation.error);
    }
  }, [saveSearchMutation.error]);

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
  const appliedFilters = submittedSearch
    ? submittedSearch.appliedFilters
    : initialFilters;
  const visiblePaperResults = flattenSearchResultPages(
    searchResultsQuery.data?.pages || [],
    submittedSearch?.sortState || sortState,
  );
  const hasSearched = submittedSearch !== null;
  const hasMoreResults = Boolean(searchResultsQuery.hasNextPage);
  const canLoadMoreResults = hasMoreResults && visiblePaperResults.length > 0;
  const matchedPaperCount = searchResultsQuery.data?.pages[0]?.totalCount || 0;
  const responseTimeSeconds = getSearchResponseTime(
    searchResultsQuery.data?.pages || [],
  );
  const autoLoadAnchorIndex = getAutoLoadAnchorIndex(
    hasSearched,
    hasMoreResults,
    searchResultsQuery.data?.pages.length || 0,
  );
  const activeFilterCount = countActiveFilters(filters);
  const appliedFilterSummary = buildAppliedFilterSummary(appliedFilters);
  const hasFormError =
    hasInvalidYearRange(filters) || hasInvalidCitationRange(filters);
  const recentSearches = recentSearchesQuery.data || [];
  const canSaveSearch = isSearchHistoryEnabled && Boolean(searchQuery.trim());
  const totalIndexedPapers = searchSummaryQuery.data?.totalIndexedPapers || 0;

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
  }, [restoredSnapshot, visiblePaperResults.length]);

  function submitSearchRequest(
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSortState = sortState,
    nextOptionValueLookup = optionValueLookup,
  ) {
    dispatch(submitSearch({
      appliedFilters: nextFilters,
      appliedSearchQuery: nextQuery,
      optionValueLookup: nextOptionValueLookup,
      sortState: nextSortState,
    }));
  }

  function handleSearchQueryChange(nextQuery: string) {
    dispatch(setSearchQuery(nextQuery));
  }

  function handleApplyFilters() {
    if (hasFormError) {
      return;
    }

    const normalizedQuery = searchQuery.trim();
    const nextActiveFilterCount = countActiveFilters(filters);

    if (!normalizedQuery && nextActiveFilterCount === 0) {
      dispatch(clearSearchResults());
      return;
    }

    submitSearchRequest(normalizedQuery, filters, sortState, optionValueLookup);
  }

  function handleSearch() {
    submitSearchRequest(
      searchQuery.trim(),
      filters,
      sortState,
      optionValueLookup,
    );
  }

  function handleSuggestedSearch(query: string) {
    dispatch(setSearchQuery(query));
    submitSearchRequest(query, filters, sortState, optionValueLookup);
  }

  function handleSaveSearch() {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery || saveSearchMutation.isPending) {
      return;
    }

    void saveSearchMutation.mutateAsync(normalizedQuery);
  }

  function handleToggleFilters() {
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

    if (!submittedSearch) {
      return;
    }

    submitSearchRequest(
      appliedSearchQuery,
      appliedFilters,
      nextSortState,
      submittedSearch.optionValueLookup,
    );
  }

  function handleClearSorts() {
    dispatch(setSortState({ ...defaultSearchSortState }));

    if (!submittedSearch) {
      return;
    }

    submitSearchRequest(
      appliedSearchQuery,
      appliedFilters,
      defaultSearchSortState,
      submittedSearch.optionValueLookup,
    );
  }

  function resetFilters() {
    dispatch(resetSearchFilters());

    if (!hasSearched) {
      return;
    }

    submitSearchRequest(
      appliedSearchQuery,
      cloneSearchFilters(initialFilters),
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
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    handleLoadMoreResults,
    handleSearch,
    handleSearchQueryChange,
    handleClearSorts,
    handleSaveSearch,
    handleSelectSort,
    handleSuggestedSearch,
    handleToggleFilters,
    handleToggleVisibleFilterWidget,
    hasFormError,
    hasSearched,
    hasMoreFilterOptions,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    isLoadingResults: submittedSearch !== null && searchResultsQuery.isPending,
    isLoadingMoreResults: searchResultsQuery.isFetchingNextPage,
    isSavingSearch: saveSearchMutation.isPending,
    matchedPaperCount,
    recentSearches,
    resetFilters,
    responseTimeSeconds,
    searchQuery,
    sortState,
    totalIndexedPapers,
    updateFilter,
    visibleFilterWidgets,
    visiblePaperResults,
  };
}
