import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routePaths } from "@/app/router";
import { isAuthenticated } from "@/features/auth/utils/authGuard";
import {
  initialFilters,
  SEARCH_DEFAULT_PAGE,
  SEARCH_FILTER_OPTION_LIMIT,
  SEARCH_NEXT_QUERY_TRIGGER_OFFSET,
  SEARCH_RECENT_SEARCH_LIMIT,
  SEARCH_WORKS_PER_PAGE,
} from "../constants";
import {
  deleteSearchHistory,
  emptySearchFilterOptions,
  emptySearchOptionValueLookup,
  getRemoteFilterOptionsPage,
  getSearchFilterOptions,
  getRecentSearches,
  mockResultSortOptions,
  saveSearchHistory,
  searchSummaryStats,
  searchWorks,
} from "../services";
import type { SearchOptionValueLookup } from "../services";
import type {
  PaperResult,
  RemoteOptionFilterKey,
  RemoteOptionStateMap,
  SavedSearch,
  SearchFilterOptions,
  SearchFilters,
} from "../types";
import {
  buildAppliedFilterSummary,
  countActiveFilters,
  getVisibleSearchSuggestions,
  hasInvalidCitationRange,
  hasInvalidYearRange,
} from "../utils";

const initialSearchQuery = "";

const remoteOptionFilterKeys: RemoteOptionFilterKey[] = [
  "author",
  "institution",
  "country",
  "award",
  "source",
];

const emptyRemoteOptionState: RemoteOptionStateMap = {
  author: false,
  institution: false,
  country: false,
  award: false,
  source: false,
};

type ResultPage = {
  nextPage: number;
  page: number;
  perPage: number;
  responseTimeSeconds: number;
  totalCount: number;
  works: PaperResult[];
};

export function useSearchPageState() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [appliedSearchQuery, setAppliedSearchQuery] =
    useState(initialSearchQuery);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAllSearchSuggestions, setShowAllSearchSuggestions] =
    useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilters>(initialFilters);
  const [filterOptions, setFilterOptions] = useState<SearchFilterOptions>(
    emptySearchFilterOptions,
  );
  const [optionValueLookup, setOptionValueLookup] = useState(
    emptySearchOptionValueLookup,
  );
  const [visiblePaperResults, setVisiblePaperResults] = useState<PaperResult[]>(
    [],
  );
  const [responseTimeSeconds, setResponseTimeSeconds] = useState(
    searchSummaryStats.responseTimeSeconds,
  );
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingMoreResults, setIsLoadingMoreResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoadingFilterOptions, setIsLoadingFilterOptions] = useState<
    RemoteOptionStateMap
  >(emptyRemoteOptionState);
  const [isLoadingMoreFilterOptions, setIsLoadingMoreFilterOptions] = useState<
    RemoteOptionStateMap
  >(emptyRemoteOptionState);
  const [hasMoreFilterOptions, setHasMoreFilterOptions] = useState<
    RemoteOptionStateMap
  >(emptyRemoteOptionState);
  const [matchedPaperCount, setMatchedPaperCount] = useState(0);
  const [totalIndexedPapers, setTotalIndexedPapers] = useState(0);
  const [nextResultPage, setNextResultPage] = useState(1);
  const [nextQueryTriggerIndex, setNextQueryTriggerIndex] = useState(-1);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState(mockResultSortOptions[0]);
  const remoteOptionSearchTimeoutRef = useRef<
    Record<RemoteOptionFilterKey, number | null>
  >({
    author: null,
    institution: null,
    country: null,
    award: null,
    source: null,
  });
  const remoteOptionKeywordRef = useRef<Record<RemoteOptionFilterKey, string>>({
    author: "",
    institution: "",
    country: "",
    award: "",
    source: "",
  });
  const remoteOptionPageRef = useRef<Record<RemoteOptionFilterKey, number>>({
    author: 1,
    institution: 1,
    country: 1,
    award: 1,
    source: 1,
  });
  const baseOptionsRef = useRef(emptySearchFilterOptions);
  const baseOptionValueLookupRef = useRef(emptySearchOptionValueLookup);

  async function loadResultPage(
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSort: string,
    nextOptionValueLookup: SearchOptionValueLookup,
    page: number,
  ): Promise<ResultPage> {
    const result = await searchWorks({
      appliedSearchQuery: nextQuery,
      filters: nextFilters,
      optionValueLookup: nextOptionValueLookup,
      page,
      selectedSort: nextSort,
    });

    return {
      nextPage: result.page + 1,
      page: result.page,
      perPage: result.perPage,
      responseTimeSeconds: result.responseTimeSeconds,
      totalCount: result.totalCount,
      works: result.works,
    };
  }

  async function runSearch(
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSort: string,
    nextOptionValueLookup: typeof optionValueLookup,
    startPage: number,
    appendResults: boolean,
    isMounted = true,
    captureIndexedCount = false,
  ) {
    if (!appendResults) {
      setIsLoadingResults(true);
    }

    try {
      const result = await loadResultPage(
        nextQuery,
        nextFilters,
        nextSort,
        nextOptionValueLookup,
        startPage,
      );

      if (!isMounted) {
        return;
      }

      if (appendResults) {
        setVisiblePaperResults((currentResults) =>
          mergeUniquePaperResults(currentResults, result.works),
        );
      } else {
        setVisiblePaperResults(result.works);
      }

      setHasSearched(true);
      setNextResultPage(result.nextPage);
      setNextQueryTriggerIndex(getNextQueryTriggerIndex(startPage));
      setResponseTimeSeconds(result.responseTimeSeconds);
      setMatchedPaperCount(result.totalCount);

      if (captureIndexedCount) {
        setTotalIndexedPapers(result.totalCount);
      }

      const loadedResultCount = (result.nextPage - 1) * result.perPage;
      const hasNextPage =
        result.works.length > 0 && loadedResultCount < result.totalCount;
      setHasMoreResults(hasNextPage);
    } catch (error) {
      if (!isMounted) {
        return;
      }

      console.error("Search API failed:", error);
      if (!appendResults) {
        setVisiblePaperResults([]);
        setNextResultPage(1);
        setNextQueryTriggerIndex(-1);
      }
      setMatchedPaperCount(0);
      setHasMoreResults(false);
      setResponseTimeSeconds(searchSummaryStats.responseTimeSeconds);
    } finally {
      if (isMounted && !appendResults) {
        setIsLoadingResults(false);
      }
    }
  }

  const activeFilterCount = countActiveFilters(filters);
  const appliedFilterSummary = buildAppliedFilterSummary(appliedFilters);
  const visibleSearchSuggestions = getVisibleSearchSuggestions(
    savedSearches,
    searchQuery,
    showAllSearchSuggestions,
  );
  const matchedSavedSearchCount = getVisibleSearchSuggestions(
    savedSearches,
    searchQuery,
    true,
  ).length;
  const canLoadMoreResults = hasMoreResults && visiblePaperResults.length > 0;
  const autoLoadAnchorIndex = getAutoLoadAnchorIndex(
    hasSearched,
    hasMoreResults,
    nextQueryTriggerIndex,
  );
  const hasFormError =
    hasInvalidYearRange(filters) || hasInvalidCitationRange(filters);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const optionsState = await getSearchFilterOptions();
        const recentSearches = isAuthenticated()
          ? await getRecentSearches(SEARCH_RECENT_SEARCH_LIMIT)
          : [];

        if (!mounted) {
          return;
        }

        setSavedSearches(recentSearches);
        setFilterOptions(optionsState.filterOptions);
        setOptionValueLookup(optionsState.optionValueLookup);
        baseOptionsRef.current = optionsState.filterOptions;
        baseOptionValueLookupRef.current = optionsState.optionValueLookup;
        setIsLoadingResults(false);
      } catch (error) {
        console.error("Cannot load search options:", error);
        if (mounted) {
          setIsLoadingResults(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timeoutLookup = remoteOptionSearchTimeoutRef.current;

    return () => {
      for (const filterKey of remoteOptionFilterKeys) {
        const timeoutId = timeoutLookup[filterKey];
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }
      }
    };
  }, []);

  function updateFilter(
    key: keyof SearchFilters,
    value: SearchFilters[keyof SearchFilters],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  }

  function handleSearchQueryChange(nextQuery: string) {
    setSearchQuery(nextQuery);
    setShowAllSearchSuggestions(false);
  }

  async function handleSearchFocus() {
    setIsSearchFocused(true);
    if (!isAuthenticated()) {
      setSavedSearches([]);
      return;
    }

    try {
      const recentSearches = await getRecentSearches(SEARCH_RECENT_SEARCH_LIMIT);
      setSavedSearches(recentSearches);
    } catch (error) {
      console.error("Cannot load recent searches:", error);
    }
  }

  function handleSearchBlur() {
    setIsSearchFocused(false);
  }

  function handleApplyFilters() {
    if (hasFormError) {
      return;
    }

    const normalizedQuery = searchQuery.trim();

    setAppliedFilters(filters);
    setAppliedSearchQuery(normalizedQuery);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearch(
      normalizedQuery,
      filters,
      selectedSort,
      optionValueLookup,
      1,
      false,
    );
  }

  async function handleSaveSearch() {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      return;
    }

    if (!ensureAuthenticatedForSearchHistory()) {
      return;
    }

    setShowAllSearchSuggestions(false);
    setIsSearchFocused(true);

    try {
      await saveSearchHistory(normalizedQuery);
      const recentSearches = await getRecentSearches(SEARCH_RECENT_SEARCH_LIMIT);
      setSavedSearches(recentSearches);
    } catch (error) {
      console.error("Cannot save search history:", error);
    }
  }

  function handleSelectSavedSearch(query: string) {
    if (!ensureAuthenticatedForSearchHistory()) {
      return;
    }

    setSearchQuery(query);
    setAppliedSearchQuery(query);
    setShowAllSearchSuggestions(false);
    setIsSearchFocused(false);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearch(query, appliedFilters, selectedSort, optionValueLookup, 1, false);
  }

  async function handleDeleteSavedSearch(query: string) {
    if (!ensureAuthenticatedForSearchHistory()) {
      return;
    }

    setShowAllSearchSuggestions(false);
    setIsSearchFocused(true);

    try {
      await deleteSearchHistory(query);
      const recentSearches = await getRecentSearches(SEARCH_RECENT_SEARCH_LIMIT);
      setSavedSearches(recentSearches);
    } catch (error) {
      console.error("Cannot delete search history:", error);
    }
  }

  function handleSearch() {
    const normalizedQuery = searchQuery.trim();

    setAppliedSearchQuery(normalizedQuery);
    setAppliedFilters(filters);
    setIsSearchFocused(false);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearch(
      normalizedQuery,
      filters,
      selectedSort,
      optionValueLookup,
      1,
      false,
    );
  }

  function ensureAuthenticatedForSearchHistory() {
    if (isAuthenticated()) {
      return true;
    }

    navigate(routePaths.login());
    return false;
  }

  function handleSuggestedSearch(query: string) {
    setSearchQuery(query);
    setAppliedSearchQuery(query);
    setIsSearchFocused(false);
    setShowAllSearchSuggestions(false);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearch(query, appliedFilters, selectedSort, optionValueLookup, 1, false);
  }

  function handleToggleFilters() {
    setFiltersOpen((isOpen) => !isOpen);
  }

  function handleToggleMoreFilters() {
    setShowAllFilters((isShown) => !isShown);
  }

  function handleToggleSearchSuggestions() {
    setShowAllSearchSuggestions((isShown) => !isShown);
  }

  function handleFilterOptionSearch(
    filterKey: RemoteOptionFilterKey,
    keyword: string,
  ) {
    const currentTimeoutId = remoteOptionSearchTimeoutRef.current[filterKey];
    if (currentTimeoutId !== null) {
      window.clearTimeout(currentTimeoutId);
    }

    const normalizedKeyword = keyword.trim();
    remoteOptionKeywordRef.current[filterKey] = normalizedKeyword;
    remoteOptionPageRef.current[filterKey] = 1;

    if (!normalizedKeyword) {
      setIsLoadingFilterOptions((currentState) => ({
        ...currentState,
        [filterKey]: false,
      }));
      setIsLoadingMoreFilterOptions((currentState) => ({
        ...currentState,
        [filterKey]: false,
      }));
      setHasMoreFilterOptions((currentState) => ({
        ...currentState,
        [filterKey]: false,
      }));
      setFilterOptions((currentOptions) => ({
        ...currentOptions,
        [filterKey]: baseOptionsRef.current[filterKey],
      }));
      setOptionValueLookup((currentLookup) => ({
        ...currentLookup,
        [filterKey]: baseOptionValueLookupRef.current[filterKey],
      }));
      return;
    }

    setIsLoadingFilterOptions((currentState) => ({
      ...currentState,
      [filterKey]: true,
    }));

    remoteOptionSearchTimeoutRef.current[filterKey] = window.setTimeout(async () => {
      try {
        const optionsPage = await getRemoteFilterOptionsPage(
          filterKey,
          normalizedKeyword,
          SEARCH_DEFAULT_PAGE,
          SEARCH_FILTER_OPTION_LIMIT,
        );

        if (remoteOptionKeywordRef.current[filterKey] !== normalizedKeyword) {
          return;
        }

        setFilterOptions((currentOptions) => ({
          ...currentOptions,
          [filterKey]: optionsPage.options,
        }));
        setOptionValueLookup((currentLookup) => ({
          ...currentLookup,
          [filterKey]: optionsPage.valueLookup,
        }));
        setHasMoreFilterOptions((currentState) => ({
          ...currentState,
          [filterKey]: optionsPage.hasMore,
        }));
      } catch (error) {
        console.error("Cannot search filter options:", error);
      } finally {
        setIsLoadingFilterOptions((currentState) => ({
          ...currentState,
          [filterKey]: false,
        }));
      }
    }, 300);
  }

  async function handleLoadMoreFilterOptions(filterKey: RemoteOptionFilterKey) {
    const keyword = remoteOptionKeywordRef.current[filterKey];
    const nextPage = remoteOptionPageRef.current[filterKey] + 1;

    if (!keyword) {
      return;
    }

    if (!hasMoreFilterOptions[filterKey]) {
      return;
    }

    if (isLoadingFilterOptions[filterKey] || isLoadingMoreFilterOptions[filterKey]) {
      return;
    }

    setIsLoadingMoreFilterOptions((currentState) => ({
      ...currentState,
      [filterKey]: true,
    }));

    try {
      const optionsPage = await getRemoteFilterOptionsPage(
        filterKey,
        keyword,
        nextPage,
        SEARCH_FILTER_OPTION_LIMIT,
      );

      if (remoteOptionKeywordRef.current[filterKey] !== keyword) {
        return;
      }

      setFilterOptions((currentOptions) => ({
        ...currentOptions,
        [filterKey]: mergeUniqueStrings(
          currentOptions[filterKey],
          optionsPage.options,
        ),
      }));
      setOptionValueLookup((currentLookup) => ({
        ...currentLookup,
        [filterKey]: {
          ...currentLookup[filterKey],
          ...optionsPage.valueLookup,
        },
      }));
      setHasMoreFilterOptions((currentState) => ({
        ...currentState,
        [filterKey]: optionsPage.hasMore,
      }));
      remoteOptionPageRef.current[filterKey] = nextPage;
    } catch (error) {
      console.error("Cannot load more filter options:", error);
    } finally {
      setIsLoadingMoreFilterOptions((currentState) => ({
        ...currentState,
        [filterKey]: false,
      }));
    }
  }

  function handleLoadMoreResults() {
    if (!canLoadMoreResults || isLoadingMoreResults) {
      return;
    }

    setIsLoadingMoreResults(true);
    void runSearch(
      appliedSearchQuery,
      appliedFilters,
      selectedSort,
      optionValueLookup,
      nextResultPage,
      true,
    ).finally(() => {
      setIsLoadingMoreResults(false);
    });
  }

  function handleSelectSort(nextSort: string) {
    setSelectedSort(nextSort);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearch(
      appliedSearchQuery,
      appliedFilters,
      nextSort,
      optionValueLookup,
      1,
      false,
    );
  }

  function resetFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearch(
      appliedSearchQuery,
      initialFilters,
      selectedSort,
      optionValueLookup,
      1,
      false,
    );
  }

  return {
    activeFilterCount,
    appliedFilterSummary,
    appliedSearchQuery,
    autoLoadAnchorIndex,
    canLoadMoreResults,
    filterOptions,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    handleLoadMoreResults,
    handleSaveSearch,
    handleSearch,
    handleSearchBlur,
    handleDeleteSavedSearch,
    handleSearchFocus,
    handleSearchQueryChange,
    handleSelectSavedSearch,
    handleSelectSort,
    handleSuggestedSearch,
    handleToggleFilters,
    handleToggleMoreFilters,
    handleToggleSearchSuggestions,
    hasFormError,
    hasSearched,
    hasMoreFilterOptions,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    isLoadingResults,
    isSearchFocused,
    isLoadingMoreResults,
    matchedPaperCount,
    matchedSavedSearchCount,
    resetFilters,
    responseTimeSeconds,
    searchQuery,
    selectedSort,
    showAllFilters,
    showAllSearchSuggestions,
    totalIndexedPapers,
    updateFilter,
    visiblePaperResults,
    visibleSearchSuggestions,
  };
}

function mergeUniqueStrings(existing: string[], incoming: string[]) {
  const seen = new Set(existing);
  const merged = [...existing];

  for (const value of incoming) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    merged.push(value);
  }

  return merged;
}

function mergeUniquePaperResults(
  existing: PaperResult[],
  incoming: PaperResult[],
) {
  const seenIds = new Set<string>();
  const merged: PaperResult[] = [];

  for (const paper of existing) {
    seenIds.add(paper.id);
    merged.push(paper);
  }

  for (const paper of incoming) {
    if (!seenIds.has(paper.id)) {
      seenIds.add(paper.id);
      merged.push(paper);
    }
  }

  return merged;
}

function getAutoLoadAnchorIndex(
  hasSearched: boolean,
  hasMoreResults: boolean,
  triggerIndex: number,
) {
  if (!hasSearched || !hasMoreResults || triggerIndex < 0) {
    return -1;
  }

  return triggerIndex;
}

function getNextQueryTriggerIndex(page: number) {
  return (page - 1) * SEARCH_WORKS_PER_PAGE + SEARCH_NEXT_QUERY_TRIGGER_OFFSET - 1;
}

