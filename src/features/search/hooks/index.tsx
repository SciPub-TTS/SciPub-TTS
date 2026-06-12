import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigationType } from "react-router-dom";
import {
  defaultVisibleFilterWidgets,
  initialFilters,
  SEARCH_DEFAULT_PAGE,
  SEARCH_FILTER_OPTION_LIMIT,
  SEARCH_NEXT_QUERY_TRIGGER_OFFSET,
  SEARCH_WORKS_PER_PAGE,
} from "../constants";
import {
  emptySearchFilterOptions,
  emptySearchOptionValueLookup,
  getRemoteFilterOptionsPage,
  getSearchFilterOptions,
  normalizeSearchResultSortValues,
  searchSummaryStats,
  sortPaperResults,
  searchWorks,
} from "../services";
import type { SearchOptionValueLookup } from "../services";
import type {
  PaperResult,
  RemoteOptionFilterKey,
  RemoteOptionStateMap,
  SearchFilterOptions,
  SearchFilters,
  SearchFilterWidgetKey,
} from "../types";
import {
  buildAppliedFilterSummary,
  countActiveFilters,
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

const emptyRemoteOptionState = createRemoteOptionState(false);

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
  >(createRemoteOptionState<number | null>(null));
  const remoteOptionKeywordRef = useRef<Record<RemoteOptionFilterKey, string>>(
    createRemoteOptionState(""),
  );
  const remoteOptionPageRef = useRef<Record<RemoteOptionFilterKey, number>>(
    createRemoteOptionState(1),
  );
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
  const canLoadMoreResults = hasMoreResults && visiblePaperResults.length > 0;
  const autoLoadAnchorIndex = getAutoLoadAnchorIndex(
    hasSearched,
    hasMoreResults,
    nextQueryTriggerIndex,
  );
  const hasFormError =
    hasInvalidYearRange(filters) || hasInvalidCitationRange(filters);

  function resetResultPagination() {
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
  }

  function clearSearchResults(nextAppliedFilters: SearchFilters) {
    setAppliedSearchQuery("");
    setAppliedFilters(nextAppliedFilters);
    setVisiblePaperResults([]);
    setHasSearched(false);
    setMatchedPaperCount(0);
    setHasMoreResults(false);
    setNextResultPage(1);
    setNextQueryTriggerIndex(-1);
    setResponseTimeSeconds(searchSummaryStats.responseTimeSeconds);
  }

  function startFreshSearch(
    nextQuery: string,
    nextFilters: SearchFilters,
    nextSorts = selectedSorts,
    nextOptionValueLookup = optionValueLookup,
  ) {
    resetResultPagination();
    void runSearch(
      nextQuery,
      nextFilters,
      nextSorts,
      nextOptionValueLookup,
      1,
      false,
    );
  }

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const optionsState = await getSearchFilterOptions();

        if (!mounted) {
          return;
        }

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
  }

  function handleApplyFilters() {
    if (hasFormError) {
      return;
    }

    const normalizedQuery = searchQuery.trim();
    const nextActiveFilterCount = countActiveFilters(filters);

    if (!normalizedQuery && nextActiveFilterCount === 0) {
      clearSearchResults(filters);
      return;
    }

    setAppliedFilters(filters);
    setAppliedSearchQuery(normalizedQuery);
    startFreshSearch(
      normalizedQuery,
      filters,
      selectedSorts,
      optionValueLookup,
    );
  }

  function handleSearch() {
    const normalizedQuery = searchQuery.trim();

    setAppliedSearchQuery(normalizedQuery);
    setAppliedFilters(filters);
    startFreshSearch(
      normalizedQuery,
      filters,
      selectedSorts,
      optionValueLookup,
    );
  }

  function handleSuggestedSearch(query: string) {
    setSearchQuery(query);
    setAppliedSearchQuery(query);
    startFreshSearch(query, filters, selectedSorts, optionValueLookup);
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
    resetResultPagination();
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
    resetResultPagination();
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
    resetResultPagination();

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
    handleSearch,
    handleSearchQueryChange,
    handleClearSorts,
    handleToggleSort,
    handleSuggestedSearch,
    handleToggleFilters,
    handleToggleVisibleFilterWidget,
    hasFormError,
    hasSearched,
    hasMoreFilterOptions,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    isLoadingResults,
    isLoadingMoreResults,
    matchedPaperCount,
    resetFilters,
    responseTimeSeconds,
    searchQuery,
    selectedSorts,
    totalIndexedPapers,
    updateFilter,
    visibleFilterWidgets,
    visiblePaperResults,
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

function createRemoteOptionState<T>(value: T): Record<RemoteOptionFilterKey, T> {
  return {
    author: value,
    institution: value,
    country: value,
    award: value,
    source: value,
  };
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
