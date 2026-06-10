import { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
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
import type {
  SearchOptionValueLookup,
  SearchWorksState,
} from "../services";
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

type SubmittedSearch = {
  appliedFilters: SearchFilters;
  appliedSearchQuery: string;
  optionValueLookup: SearchOptionValueLookup;
  selectedSorts: string[];
};

type SearchPageSnapshot = {
  appliedFilters: SearchFilters;
  appliedSearchQuery: string;
  filterOptions: SearchFilterOptions;
  filters: SearchFilters;
  filtersOpen: boolean;
  optionValueLookup: SearchOptionValueLookup;
  scrollY: number;
  searchQuery: string;
  selectedSorts: string[];
  submittedSearch: SubmittedSearch | null;
  totalIndexedPapers: number;
  visibleFilterWidgets: SearchFilterWidgetKey[];
};

export function useSearchPageState() {
  const navigationType = useNavigationType();
  const shouldRestoreSearchPageState =
    navigationType === "POP" &&
    readSearchPageRestorePending() &&
    !isReloadNavigation();
  const [restoredSnapshot] = useState<SearchPageSnapshot | null>(() =>
    shouldRestoreSearchPageState ? readPersistedSearchPageSnapshot() : null,
  );
  const restoredSubmittedSearch = restoreSubmittedSearch(restoredSnapshot);
  const latestSnapshotRef = useRef<SearchPageSnapshot | null>(restoredSnapshot);
  const shouldRestoreScrollRef = useRef(Boolean(restoredSnapshot));
  const [searchQuery, setSearchQuery] = useState(
    restoredSnapshot?.searchQuery ?? initialSearchQuery,
  );
  const [appliedSearchQuery, setAppliedSearchQuery] = useState(
    restoredSnapshot?.appliedSearchQuery ?? initialSearchQuery,
  );
  const [filters, setFilters] = useState<SearchFilters>(
    restoredSnapshot?.filters
      ? cloneSearchFilters(restoredSnapshot.filters)
      : cloneSearchFilters(initialFilters),
  );
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(
    restoredSnapshot?.appliedFilters
      ? cloneSearchFilters(restoredSnapshot.appliedFilters)
      : cloneSearchFilters(initialFilters),
  );
  const [filterOptions, setFilterOptions] = useState<SearchFilterOptions>(
    restoredSnapshot?.filterOptions ?? emptySearchFilterOptions,
  );
  const [optionValueLookup, setOptionValueLookup] = useState(
    restoredSnapshot?.optionValueLookup ?? emptySearchOptionValueLookup,
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
  const [submittedSearch, setSubmittedSearch] = useState<SubmittedSearch | null>(
    restoredSubmittedSearch,
  );
  const [totalIndexedPapers, setTotalIndexedPapers] = useState(
    restoredSnapshot?.totalIndexedPapers ?? 0,
  );
  const [isLoadingFilterOptions, setIsLoadingFilterOptions] =
    useState<RemoteOptionStateMap>(emptyRemoteOptionState);
  const [isLoadingMoreFilterOptions, setIsLoadingMoreFilterOptions] =
    useState<RemoteOptionStateMap>(emptyRemoteOptionState);
  const [hasMoreFilterOptions, setHasMoreFilterOptions] =
    useState<RemoteOptionStateMap>(emptyRemoteOptionState);
  const remoteOptionSearchTimeoutRef = useRef<
    Record<RemoteOptionFilterKey, number | null>
  >(createRemoteOptionState<number | null>(null));
  const remoteOptionKeywordRef = useRef<Record<RemoteOptionFilterKey, string>>(
    createRemoteOptionState(""),
  );
  const remoteOptionPageRef = useRef<Record<RemoteOptionFilterKey, number>>(
    createRemoteOptionState(1),
  );
  const baseOptionsRef = useRef(restoredSnapshot?.filterOptions ?? emptySearchFilterOptions);
  const baseOptionValueLookupRef = useRef(
    restoredSnapshot?.optionValueLookup ?? emptySearchOptionValueLookup,
  );

  const searchOptionsQuery = useQuery({
    queryFn: () => getSearchFilterOptions(),
    queryKey: ["searchFilterOptions", "base"],
    staleTime: 10 * 60 * 1000,
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
        selectedSorts: submittedSearch?.selectedSorts || [],
      }),
    queryKey: ["searchWorks", submittedSearch],
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (searchOptionsQuery.error) {
      console.error("Cannot load search options:", searchOptionsQuery.error);
    }
  }, [searchOptionsQuery.error]);

  useEffect(() => {
    if (!searchOptionsQuery.data) {
      return;
    }

    const optionsState = searchOptionsQuery.data;

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
  }, [searchOptionsQuery.data]);

  useEffect(() => {
    if (searchResultsQuery.error) {
      console.error("Search API failed:", searchResultsQuery.error);
    }
  }, [searchResultsQuery.error]);

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
      optionValueLookup,
      scrollY: latestSnapshotRef.current?.scrollY ?? 0,
      searchQuery,
      selectedSorts,
      submittedSearch,
      totalIndexedPapers,
      visibleFilterWidgets,
    };

    latestSnapshotRef.current = snapshot;
    persistSearchPageSnapshot(snapshot);
  }, [
    appliedFilters,
    appliedSearchQuery,
    filterOptions,
    filters,
    filtersOpen,
    optionValueLookup,
    searchQuery,
    selectedSorts,
    submittedSearch,
    totalIndexedPapers,
    visibleFilterWidgets,
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

  const visiblePaperResults = flattenSearchResultPages(
    searchResultsQuery.data?.pages || [],
    submittedSearch?.selectedSorts || selectedSorts,
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
    nextSorts = selectedSorts,
    nextOptionValueLookup = optionValueLookup,
  ) {
    setAppliedSearchQuery(nextQuery);
    setAppliedFilters(cloneSearchFilters(nextFilters));
    setSubmittedSearch({
      appliedFilters: cloneSearchFilters(nextFilters),
      appliedSearchQuery: nextQuery,
      optionValueLookup: cloneSearchOptionValueLookup(nextOptionValueLookup),
      selectedSorts: [...nextSorts],
    });
  }

  function clearSearchResults(nextAppliedFilters: SearchFilters) {
    setAppliedSearchQuery("");
    setAppliedFilters(cloneSearchFilters(nextAppliedFilters));
    setSubmittedSearch(null);
  }

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

    submitSearchRequest(
      normalizedQuery,
      filters,
      selectedSorts,
      optionValueLookup,
    );
  }

  function handleSearch() {
    const normalizedQuery = searchQuery.trim();

    submitSearchRequest(
      normalizedQuery,
      filters,
      selectedSorts,
      optionValueLookup,
    );
  }

  function handleSuggestedSearch(query: string) {
    setSearchQuery(query);
    submitSearchRequest(
      query,
      filters,
      selectedSorts,
      optionValueLookup,
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
    if (!canLoadMoreResults) {
      return;
    }

    if (searchResultsQuery.isFetchingNextPage) {
      return;
    }

    void searchResultsQuery.fetchNextPage();
  }

  function handleToggleSort(nextSort: string) {
    const normalizedSorts = normalizeSearchResultSortValues([
      ...selectedSorts,
      nextSort,
    ]);
    const nextSelectedSorts = selectedSorts.includes(nextSort)
      ? selectedSorts.filter((currentSort) => currentSort !== nextSort)
      : normalizedSorts;

    setSelectedSorts(nextSelectedSorts);

    if (!submittedSearch) {
      return;
    }

    submitSearchRequest(
      appliedSearchQuery,
      appliedFilters,
      nextSelectedSorts,
      submittedSearch.optionValueLookup,
    );
  }

  function handleClearSorts() {
    setSelectedSorts([]);

    if (!submittedSearch) {
      return;
    }

    submitSearchRequest(
      appliedSearchQuery,
      appliedFilters,
      [],
      submittedSearch.optionValueLookup,
    );
  }

  function resetFilters() {
    const nextFilters = cloneSearchFilters(initialFilters);

    setFilters(nextFilters);
    setAppliedFilters(nextFilters);

    if (!hasSearched) {
      return;
    }

    submitSearchRequest(
      appliedSearchQuery,
      nextFilters,
      selectedSorts,
      optionValueLookup,
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
    isLoadingResults: searchResultsQuery.isPending,
    isLoadingMoreResults: searchResultsQuery.isFetchingNextPage,
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

function flattenSearchResultPages(
  pages: SearchWorksState[],
  selectedSorts: string[],
) {
  let mergedResults: PaperResult[] = [];

  for (const page of pages) {
    mergedResults = mergeUniquePaperResults(mergedResults, page.works);
  }

  return sortPaperResults(mergedResults, selectedSorts);
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

function getNextSearchResultsPage(
  lastPage: SearchWorksState,
  allPages: SearchWorksState[],
) {
  const loadedResultCount = allPages.reduce(
    (totalCount, page) => totalCount + page.works.length,
    0,
  );

  if (lastPage.works.length === 0) {
    return undefined;
  }

  if (loadedResultCount >= lastPage.totalCount) {
    return undefined;
  }

  return lastPage.page + 1;
}

function getSearchResponseTime(pages: SearchWorksState[]) {
  if (pages.length === 0) {
    return searchSummaryStats.responseTimeSeconds;
  }

  return pages[pages.length - 1].responseTimeSeconds;
}

function getAutoLoadAnchorIndex(
  hasSearched: boolean,
  hasMoreResults: boolean,
  loadedPageCount: number,
) {
  if (!hasSearched || !hasMoreResults || loadedPageCount <= 0) {
    return -1;
  }

  return (
    (loadedPageCount - 1) * SEARCH_WORKS_PER_PAGE
    + SEARCH_NEXT_QUERY_TRIGGER_OFFSET
    - 1
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

function cloneSearchFilters(filters: SearchFilters): SearchFilters {
  return {
    ...filters,
    author: [...filters.author],
    award: [...filters.award],
    country: [...filters.country],
    institution: [...filters.institution],
    source: [...filters.source],
    subField: [...filters.subField],
    type: [...filters.type],
  };
}

function cloneSearchOptionValueLookup(
  optionValueLookup: SearchOptionValueLookup,
): SearchOptionValueLookup {
  return {
    type: {
      ...optionValueLookup.type,
    },
    subField: {
      ...optionValueLookup.subField,
    },
    author: {
      ...optionValueLookup.author,
    },
    institution: {
      ...optionValueLookup.institution,
    },
    country: {
      ...optionValueLookup.country,
    },
    source: {
      ...optionValueLookup.source,
    },
    award: {
      ...optionValueLookup.award,
    },
  };
}

function restoreSubmittedSearch(snapshot: SearchPageSnapshot | null) {
  if (!snapshot) {
    return null;
  }

  if (snapshot.submittedSearch) {
    return {
      appliedFilters: cloneSearchFilters(snapshot.submittedSearch.appliedFilters),
      appliedSearchQuery: snapshot.submittedSearch.appliedSearchQuery,
      optionValueLookup: cloneSearchOptionValueLookup(
        snapshot.submittedSearch.optionValueLookup,
      ),
      selectedSorts: normalizeSearchResultSortValues(
        snapshot.submittedSearch.selectedSorts,
      ),
    };
  }

  if (!snapshot.appliedSearchQuery && countActiveFilters(snapshot.appliedFilters) === 0) {
    return null;
  }

  return {
    appliedFilters: cloneSearchFilters(snapshot.appliedFilters),
    appliedSearchQuery: snapshot.appliedSearchQuery,
    optionValueLookup: cloneSearchOptionValueLookup(snapshot.optionValueLookup),
    selectedSorts: normalizeSearchResultSortValues(snapshot.selectedSorts),
  };
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
      submittedSearch?: SubmittedSearch | null;
    };
    const normalizedVisibleFilterWidgets = normalizeSearchFilterWidgetKeys(
      parsedSnapshot.visibleFilterWidgets || [],
    );
    const normalizedSelectedSorts = normalizeSearchResultSortValues(
      parsedSnapshot.selectedSorts ?? parsedSnapshot.selectedSort,
    );
    const normalizedSubmittedSearch = parsedSnapshot.submittedSearch
      ? {
          appliedFilters: cloneSearchFilters(
            parsedSnapshot.submittedSearch.appliedFilters,
          ),
          appliedSearchQuery: parsedSnapshot.submittedSearch.appliedSearchQuery,
          optionValueLookup: cloneSearchOptionValueLookup(
            parsedSnapshot.submittedSearch.optionValueLookup,
          ),
          selectedSorts: normalizeSearchResultSortValues(
            parsedSnapshot.submittedSearch.selectedSorts,
          ),
        }
      : null;

    return {
      ...parsedSnapshot,
      appliedFilters: cloneSearchFilters(parsedSnapshot.appliedFilters),
      filters: cloneSearchFilters(parsedSnapshot.filters),
      optionValueLookup: cloneSearchOptionValueLookup(
        parsedSnapshot.optionValueLookup,
      ),
      selectedSorts: normalizedSelectedSorts,
      submittedSearch: normalizedSubmittedSearch,
      visibleFilterWidgets: normalizedVisibleFilterWidgets,
    };
  } catch {
    return null;
  }
}
