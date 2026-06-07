import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useNavigationType } from "react-router-dom";

import { routePaths } from "@/app/router";
import { isAuthenticated } from "@/features/auth/utils/authGuard";
import {
  defaultVisibleFilterWidgets,
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
  normalizeSearchResultSortValues,
  saveSearchHistory,
  searchSummaryStats,
  sortPaperResults,
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
  SearchFilterWidgetKey,
} from "../types";
import {
  buildAppliedFilterSummary,
  countActiveFilters,
  getVisibleSearchSuggestions,
  hasInvalidCitationRange,
  hasInvalidYearRange,
  normalizeSearchFilterWidgetKeys,
} from "../utils";
import {
  clearSearchPageRestorePending,
  readSearchPageRestorePending,
  searchPageStateStorageKey,
} from "../utils/navigationState";

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

type SearchPageSnapshot = {
  appliedFilters: SearchFilters;
  appliedSearchQuery: string;
  filterOptions: SearchFilterOptions;
  filters: SearchFilters;
  filtersOpen: boolean;
  hasMoreResults: boolean;
  hasSearched: boolean;
  matchedPaperCount: number;
  nextQueryTriggerIndex: number;
  nextResultPage: number;
  optionValueLookup: SearchOptionValueLookup;
  responseTimeSeconds: number;
  searchQuery: string;
  selectedSorts: string[];
  totalIndexedPapers: number;
  visibleFilterWidgets: SearchFilterWidgetKey[];
  visiblePaperResults: PaperResult[];
  scrollY: number;
};

type RunSearch = (
  nextQuery: string,
  nextFilters: SearchFilters,
  nextSorts: string[],
  nextOptionValueLookup: SearchOptionValueLookup,
  startPage: number,
  appendResults: boolean,
  isMounted?: boolean,
) => Promise<void>;

export function useSearchPageState() {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const shouldRestoreSearchPageState =
    navigationType === "POP" &&
    readSearchPageRestorePending() &&
    !isReloadNavigation();
  const [restoredSnapshot] = useState<SearchPageSnapshot | null>(() =>
    shouldRestoreSearchPageState ? readPersistedSearchPageSnapshot() : null,
  );
  const latestSnapshotRef = useRef<SearchPageSnapshot | null>(restoredSnapshot);
  const shouldRestoreScrollRef = useRef(Boolean(restoredSnapshot));
  const [searchQuery, setSearchQuery] = useState(
    restoredSnapshot?.searchQuery ?? initialSearchQuery,
  );
  const [appliedSearchQuery, setAppliedSearchQuery] =
    useState(restoredSnapshot?.appliedSearchQuery ?? initialSearchQuery);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAllSearchSuggestions, setShowAllSearchSuggestions] =
    useState(false);
  const [filters, setFilters] = useState<SearchFilters>(
    restoredSnapshot?.filters ?? initialFilters,
  );
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilters>(restoredSnapshot?.appliedFilters ?? initialFilters);
  const [filterOptions, setFilterOptions] = useState<SearchFilterOptions>(
    restoredSnapshot?.filterOptions ?? emptySearchFilterOptions,
  );
  const [optionValueLookup, setOptionValueLookup] = useState(
    restoredSnapshot?.optionValueLookup ?? emptySearchOptionValueLookup,
  );
  const [visiblePaperResults, setVisiblePaperResults] = useState<PaperResult[]>(
    restoredSnapshot?.visiblePaperResults ?? [],
  );
  const [responseTimeSeconds, setResponseTimeSeconds] = useState(
    restoredSnapshot?.responseTimeSeconds ??
      searchSummaryStats.responseTimeSeconds,
  );
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingMoreResults, setIsLoadingMoreResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(
    restoredSnapshot?.hasSearched ?? false,
  );
  const [isLoadingFilterOptions, setIsLoadingFilterOptions] =
    useState<RemoteOptionStateMap>(emptyRemoteOptionState);
  const [isLoadingMoreFilterOptions, setIsLoadingMoreFilterOptions] =
    useState<RemoteOptionStateMap>(emptyRemoteOptionState);
  const [hasMoreFilterOptions, setHasMoreFilterOptions] =
    useState<RemoteOptionStateMap>(emptyRemoteOptionState);
  const [matchedPaperCount, setMatchedPaperCount] = useState(
    restoredSnapshot?.matchedPaperCount ?? 0,
  );
  const [totalIndexedPapers, setTotalIndexedPapers] = useState(
    restoredSnapshot?.totalIndexedPapers ?? 0,
  );
  const [nextResultPage, setNextResultPage] = useState(
    restoredSnapshot?.nextResultPage ?? 1,
  );
  const [nextQueryTriggerIndex, setNextQueryTriggerIndex] = useState(
    restoredSnapshot?.nextQueryTriggerIndex ?? -1,
  );
  const [hasMoreResults, setHasMoreResults] = useState(
    restoredSnapshot?.hasMoreResults ?? false,
  );
  const [filtersOpen, setFiltersOpen] = useState(
    restoredSnapshot?.filtersOpen ?? false,
  );
  const [visibleFilterWidgets, setVisibleFilterWidgets] = useState<
    SearchFilterWidgetKey[]
  >(
    normalizeSearchFilterWidgetKeys(
      restoredSnapshot?.visibleFilterWidgets ?? defaultVisibleFilterWidgets,
    ),
  );
  const [selectedSorts, setSelectedSorts] = useState(
    restoredSnapshot
      ? normalizeSearchResultSortValues(restoredSnapshot.selectedSorts)
      : [],
  );
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
  const runSearchRef = useRef<RunSearch | null>(null);
  const latestSortRequestRef = useRef({
    appliedFilters: restoredSnapshot?.appliedFilters ?? initialFilters,
    appliedSearchQuery: restoredSnapshot?.appliedSearchQuery ?? initialSearchQuery,
    optionValueLookup:
      restoredSnapshot?.optionValueLookup ?? emptySearchOptionValueLookup,
    selectedSorts: restoredSnapshot?.selectedSorts ?? [],
  });

  async function loadResultPage(
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSorts: string[],
    nextOptionValueLookup: SearchOptionValueLookup,
    page: number,
  ): Promise<ResultPage> {
    const result = await searchWorks({
      appliedSearchQuery: nextQuery,
      filters: nextFilters,
      optionValueLookup: nextOptionValueLookup,
      page,
      selectedSorts: nextSorts,
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
    nextSorts: string[],
    nextOptionValueLookup: typeof optionValueLookup,
    startPage: number,
    appendResults: boolean,
    isMounted = true,
  ) {
    if (!appendResults) {
      setIsLoadingResults(true);
    }

    try {
      const result = await loadResultPage(
        nextQuery,
        nextFilters,
        nextSorts,
        nextOptionValueLookup,
        startPage,
      );

      if (!isMounted) {
        return;
      }

      if (appendResults) {
        setVisiblePaperResults((currentResults) =>
          sortPaperResults(
            mergeUniquePaperResults(currentResults, result.works),
            nextSorts,
          ),
        );
      } else {
        setVisiblePaperResults(sortPaperResults(result.works, nextSorts));
      }

      setHasSearched(true);
      setNextResultPage(result.nextPage);
      setNextQueryTriggerIndex(getNextQueryTriggerIndex(startPage));
      setResponseTimeSeconds(result.responseTimeSeconds);
      setMatchedPaperCount(result.totalCount);

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

  runSearchRef.current = runSearch;
  latestSortRequestRef.current = {
    appliedFilters,
    appliedSearchQuery,
    optionValueLookup,
    selectedSorts,
  };

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
        setFilterOptions((currentOptions) =>
          mergeSearchFilterOptions(currentOptions, optionsState.filterOptions),
        );
        setOptionValueLookup((currentLookup) =>
          mergeSearchOptionValueLookup(
            currentLookup,
            optionsState.optionValueLookup,
          ),
        );
        setTotalIndexedPapers(optionsState.totalIndexedPapers);
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

  useEffect(() => {
    clearSearchPageRestorePending();
  }, []);

  useEffect(() => {
    const snapshot: SearchPageSnapshot = {
      appliedFilters,
      appliedSearchQuery,
      filterOptions,
      filters,
      filtersOpen,
      hasMoreResults,
      hasSearched,
      matchedPaperCount,
      nextQueryTriggerIndex,
      nextResultPage,
      optionValueLookup,
      responseTimeSeconds,
      searchQuery,
      selectedSorts,
      totalIndexedPapers,
      visibleFilterWidgets,
      visiblePaperResults,
      scrollY: latestSnapshotRef.current?.scrollY ?? 0,
    };

    latestSnapshotRef.current = snapshot;
    persistSearchPageSnapshot(snapshot);
  }, [
    appliedFilters,
    appliedSearchQuery,
    filterOptions,
    filters,
    filtersOpen,
    hasMoreResults,
    hasSearched,
    matchedPaperCount,
    nextQueryTriggerIndex,
    nextResultPage,
    optionValueLookup,
    responseTimeSeconds,
    searchQuery,
    selectedSorts,
    totalIndexedPapers,
    visibleFilterWidgets,
    visiblePaperResults,
  ]);

  useEffect(() => {
    return () => {
      const latestSnapshot = latestSnapshotRef.current;
      if (!latestSnapshot) {
        return;
      }

      persistSearchPageSnapshot({
        ...latestSnapshot,
        scrollY: window.scrollY,
      });
    };
  }, []);

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
      const recentSearches = await getRecentSearches(
        SEARCH_RECENT_SEARCH_LIMIT,
      );
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

    if (!normalizedQuery) {
      setAppliedSearchQuery("");
      setAppliedFilters(filters);
      setVisiblePaperResults([]);
      setHasSearched(false);
      setMatchedPaperCount(0);
      setHasMoreResults(false);
      setNextResultPage(1);
      setNextQueryTriggerIndex(-1);
      setResponseTimeSeconds(searchSummaryStats.responseTimeSeconds);
      return;
    }

    setAppliedFilters(filters);
    setAppliedSearchQuery(normalizedQuery);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearch(
      normalizedQuery,
      filters,
      selectedSorts,
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
      const recentSearches = await getRecentSearches(
        SEARCH_RECENT_SEARCH_LIMIT,
      );
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
    void runSearch(
      query,
      appliedFilters,
      selectedSorts,
      optionValueLookup,
      1,
      false,
    );
  }

  async function handleDeleteSavedSearch(query: string) {
    if (!ensureAuthenticatedForSearchHistory()) {
      return;
    }

    setShowAllSearchSuggestions(false);
    setIsSearchFocused(true);

    try {
      await deleteSearchHistory(query);
      const recentSearches = await getRecentSearches(
        SEARCH_RECENT_SEARCH_LIMIT,
      );
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
      selectedSorts,
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
    void runSearch(
      query,
      appliedFilters,
      selectedSorts,
      optionValueLookup,
      1,
      false,
    );
  }

  function handleToggleFilters() {
    setFiltersOpen((isOpen) => !isOpen);
  }

  function handleToggleVisibleFilterWidget(widgetKey: SearchFilterWidgetKey) {
    setVisibleFilterWidgets((currentWidgets) => {
      if (currentWidgets.includes(widgetKey)) {
        return currentWidgets.filter((currentWidget) => currentWidget !== widgetKey);
      }

      return normalizeSearchFilterWidgetKeys([...currentWidgets, widgetKey]);
    });
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

    remoteOptionSearchTimeoutRef.current[filterKey] = window.setTimeout(
      async () => {
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
      },
      300,
    );
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

    if (
      isLoadingFilterOptions[filterKey] ||
      isLoadingMoreFilterOptions[filterKey]
    ) {
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
      selectedSorts,
      optionValueLookup,
      nextResultPage,
      true,
    ).finally(() => {
      setIsLoadingMoreResults(false);
    });
  }

  const handleToggleSort = useCallback((nextSort: string) => {
    const {
      appliedFilters: currentAppliedFilters,
      appliedSearchQuery: currentAppliedSearchQuery,
      optionValueLookup: currentOptionValueLookup,
      selectedSorts: currentSelectedSorts,
    } = latestSortRequestRef.current;
    const normalizedSorts = normalizeSearchResultSortValues([
      ...currentSelectedSorts,
      nextSort,
    ]);
    const nextSelectedSorts = currentSelectedSorts.includes(nextSort)
      ? currentSelectedSorts.filter((currentSort) => currentSort !== nextSort)
      : normalizedSorts;

    setSelectedSorts(nextSelectedSorts);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearchRef.current?.(
      currentAppliedSearchQuery,
      currentAppliedFilters,
      nextSelectedSorts,
      currentOptionValueLookup,
      1,
      false,
    );
  }, []);

  const handleClearSorts = useCallback(() => {
    const {
      appliedFilters: currentAppliedFilters,
      appliedSearchQuery: currentAppliedSearchQuery,
      optionValueLookup: currentOptionValueLookup,
    } = latestSortRequestRef.current;

    setSelectedSorts([]);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    void runSearchRef.current?.(
      currentAppliedSearchQuery,
      currentAppliedFilters,
      [],
      currentOptionValueLookup,
      1,
      false,
    );
  }, []);

  function resetFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);

    if (!hasSearched) {
      return;
    }

    void runSearch(
      appliedSearchQuery,
      initialFilters,
      selectedSorts,
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
    handleClearSorts,
    handleToggleSort,
    handleSuggestedSearch,
    handleToggleFilters,
    handleToggleSearchSuggestions,
    handleToggleVisibleFilterWidget,
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
    selectedSorts,
    showAllSearchSuggestions,
    totalIndexedPapers,
    updateFilter,
    visibleFilterWidgets,
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

function mergeSearchFilterOptions(
  existing: SearchFilterOptions,
  incoming: SearchFilterOptions,
): SearchFilterOptions {
  return {
    type: mergeUniqueStrings(existing.type, incoming.type),
    subField: mergeUniqueStrings(existing.subField, incoming.subField),
    author: mergeUniqueStrings(existing.author, incoming.author),
    institution: mergeUniqueStrings(
      existing.institution,
      incoming.institution,
    ),
    country: mergeUniqueStrings(existing.country, incoming.country),
    source: mergeUniqueStrings(existing.source, incoming.source),
    award: mergeUniqueStrings(existing.award, incoming.award),
  };
}

function mergeSearchOptionValueLookup(
  existing: SearchOptionValueLookup,
  incoming: SearchOptionValueLookup,
): SearchOptionValueLookup {
  return {
    type: {
      ...existing.type,
      ...incoming.type,
    },
    subField: {
      ...existing.subField,
      ...incoming.subField,
    },
    author: {
      ...existing.author,
      ...incoming.author,
    },
    institution: {
      ...existing.institution,
      ...incoming.institution,
    },
    country: {
      ...existing.country,
      ...incoming.country,
    },
    source: {
      ...existing.source,
      ...incoming.source,
    },
    award: {
      ...existing.award,
      ...incoming.award,
    },
  };
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
  return (
    (page - 1) * SEARCH_WORKS_PER_PAGE + SEARCH_NEXT_QUERY_TRIGGER_OFFSET - 1
  );
}

function isReloadNavigation() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigationEntries = window.performance.getEntriesByType("navigation");
  const navigationEntry = navigationEntries[0] as
    | PerformanceNavigationTiming
    | undefined;

  return navigationEntry?.type === "reload";
}

function persistSearchPageSnapshot(snapshot: SearchPageSnapshot) {
  try {
    window.sessionStorage.setItem(
      searchPageStateStorageKey,
      JSON.stringify(snapshot),
    );
  } catch {
    // Ignore storage failures so search still works in restricted browsers.
  }
}

function readPersistedSearchPageSnapshot(): SearchPageSnapshot | null {
  try {
    const storedSnapshot = window.sessionStorage.getItem(
      searchPageStateStorageKey,
    );

    if (!storedSnapshot) {
      return null;
    }

    const parsedSnapshot = JSON.parse(storedSnapshot) as SearchPageSnapshot & {
      selectedSort?: string;
      selectedSorts?: string[];
    };
    const normalizedVisibleFilterWidgets = normalizeSearchFilterWidgetKeys(
      parsedSnapshot.visibleFilterWidgets || [],
    );
    const normalizedSelectedSorts = normalizeSearchResultSortValues(
      parsedSnapshot.selectedSorts ?? parsedSnapshot.selectedSort,
    );

    return {
      ...parsedSnapshot,
      selectedSorts: normalizedSelectedSorts,
      visibleFilterWidgets: normalizedVisibleFilterWidgets,
    };
  } catch {
    return null;
  }
}
