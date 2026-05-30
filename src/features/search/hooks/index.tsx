import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routePaths } from "@/app/router";
import { isAuthenticated } from "@/features/auth/utils/authGuard";
import { initialFilters } from "../constants";
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
  "award",
  "source",
];

// This hook owns all state and handlers for the search page.
// Components receive simple values/callbacks instead of managing page logic.
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
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [isLoadingMoreResults, setIsLoadingMoreResults] = useState(false);
  const [isLoadingFilterOptions, setIsLoadingFilterOptions] = useState<
    RemoteOptionStateMap
  >({
    author: false,
    institution: false,
    award: false,
    source: false,
  });
  const [isLoadingMoreFilterOptions, setIsLoadingMoreFilterOptions] = useState<
    RemoteOptionStateMap
  >({
    author: false,
    institution: false,
    award: false,
    source: false,
  });
  const [hasMoreFilterOptions, setHasMoreFilterOptions] = useState<
    RemoteOptionStateMap
  >({
    author: false,
    institution: false,
    award: false,
    source: false,
  });
  const [matchedPaperCount, setMatchedPaperCount] = useState(0);
  const [totalIndexedPapers, setTotalIndexedPapers] = useState(0);
  const [currentResultPage, setCurrentResultPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState(mockResultSortOptions[0]);
  const remoteOptionSearchTimeoutRef = useRef<
    Record<RemoteOptionFilterKey, number | null>
  >({
    author: null,
    institution: null,
    award: null,
    source: null,
  });
  const remoteOptionSearchRequestVersionRef = useRef<
    Record<RemoteOptionFilterKey, number>
  >({
    author: 0,
    institution: 0,
    award: 0,
    source: 0,
  });
  const remoteOptionKeywordRef = useRef<Record<RemoteOptionFilterKey, string>>({
    author: "",
    institution: "",
    award: "",
    source: "",
  });
  const remoteOptionPageRef = useRef<Record<RemoteOptionFilterKey, number>>({
    author: 1,
    institution: 1,
    award: 1,
    source: 1,
  });
  const baseOptionsRef = useRef(emptySearchFilterOptions);
  const baseOptionValueLookupRef = useRef(emptySearchOptionValueLookup);

  const runSearch = useCallback(
    async (
      nextQuery: string,
      nextFilters: SearchFilters,
      nextSort: string,
      nextOptionValueLookup: typeof optionValueLookup,
      page: number,
      appendResults: boolean,
      isMounted = true,
      captureIndexedCount = false,
    ) => {
      if (!appendResults) {
        setIsLoadingResults(true);
      }

      try {
        const result = await searchWorks({
          appliedSearchQuery: nextQuery,
          filters: nextFilters,
          optionValueLookup: nextOptionValueLookup,
          page,
          selectedSort: nextSort,
        });

        if (!isMounted) {
          return;
        }

        setVisiblePaperResults((currentResults) => {
          if (!appendResults) {
            return result.works;
          }

          const knownResultIds = new Set(currentResults.map((paper) => paper.id));
          const uniqueNextResults = result.works.filter(
            (paper) => !knownResultIds.has(paper.id),
          );

          return [...currentResults, ...uniqueNextResults];
        });
        setCurrentResultPage(result.page);
        setResponseTimeSeconds(result.responseTimeSeconds);
        setMatchedPaperCount(result.totalCount);
        if (captureIndexedCount) {
          setTotalIndexedPapers(result.totalCount);
        }
        setHasMoreResults(
          result.works.length > 0 &&
            result.page * result.perPage < result.totalCount,
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Search API failed:", error);
        if (!appendResults) {
          setVisiblePaperResults([]);
          setCurrentResultPage(1);
        }
        setMatchedPaperCount(0);
        setHasMoreResults(false);
        setResponseTimeSeconds(searchSummaryStats.responseTimeSeconds);
      } finally {
        if (isMounted && !appendResults) {
          setIsLoadingResults(false);
        }
      }
    },
    [],
  );

  // useMemo keeps derived values stable unless their dependencies change.
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);
  const appliedFilterSummary = useMemo(
    () => buildAppliedFilterSummary(appliedFilters),
    [appliedFilters],
  );
  const visibleSearchSuggestions = useMemo(
    () =>
      getVisibleSearchSuggestions(
        savedSearches,
        searchQuery,
        showAllSearchSuggestions,
      ),
    [savedSearches, searchQuery, showAllSearchSuggestions],
  );
  const matchedSavedSearchCount = useMemo(
    () => getVisibleSearchSuggestions(savedSearches, searchQuery, true).length,
    [savedSearches, searchQuery],
  );

  const canLoadMoreResults = hasMoreResults && visiblePaperResults.length > 0;
  const hasFormError =
    hasInvalidYearRange(filters) || hasInvalidCitationRange(filters);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const optionsState = await getSearchFilterOptions();
        const recentSearches = isAuthenticated()
          ? await getRecentSearches(5)
          : [];

        if (!mounted) {
          return;
        }

        setSavedSearches(recentSearches);
        setFilterOptions(optionsState.filterOptions);
        setOptionValueLookup(optionsState.optionValueLookup);
        baseOptionsRef.current = optionsState.filterOptions;
        baseOptionValueLookupRef.current = optionsState.optionValueLookup;

        await runSearch(
          initialSearchQuery,
          initialFilters,
          mockResultSortOptions[0],
          optionsState.optionValueLookup,
          1,
          false,
          mounted,
          true,
        );
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
  }, [runSearch]);

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
      // Computed property name updates only the selected field.
      [key]: value,
    }));
  }

  function handleSearchQueryChange(nextQuery: string) {
    setSearchQuery(nextQuery);
    setShowAllSearchSuggestions(false);
  }

  function handleSearchFocus() {
    setIsSearchFocused(true);
    if (!isAuthenticated()) {
      setSavedSearches([]);
      return;
    }

    void getRecentSearches(5)
      .then((recentSearches) => {
        setSavedSearches(recentSearches);
      })
      .catch((error) => {
        console.error("Cannot load recent searches:", error);
      });
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
    setCurrentResultPage(1);
    void runSearch(
      normalizedQuery,
      filters,
      selectedSort,
      optionValueLookup,
      1,
      false,
    );
  }

  function handleSaveSearch() {
    const normalizedQuery = searchQuery.trim();

    // Empty searches should not be saved.
    if (!normalizedQuery) {
      return;
    }

    if (!ensureAuthenticatedForSearchHistory()) {
      return;
    }

    setShowAllSearchSuggestions(false);
    setIsSearchFocused(true);

    void saveSearchHistory(normalizedQuery)
      .then(async () => {
        const recentSearches = await getRecentSearches(5);
        setSavedSearches(recentSearches);
      })
      .catch((error) => {
        console.error("Cannot save search history:", error);
      });
  }

  function handleSelectSavedSearch(query: string) {
    if (!ensureAuthenticatedForSearchHistory()) {
      return;
    }

    setSearchQuery(query);
    setAppliedSearchQuery(query);
    setShowAllSearchSuggestions(false);
    setIsSearchFocused(false);
    setCurrentResultPage(1);
    void runSearch(query, appliedFilters, selectedSort, optionValueLookup, 1, false);
  }

  function handleDeleteSavedSearch(query: string) {
    if (!ensureAuthenticatedForSearchHistory()) {
      return;
    }

    setShowAllSearchSuggestions(false);
    setIsSearchFocused(true);

    void deleteSearchHistory(query)
      .then(async () => {
        const recentSearches = await getRecentSearches(5);
        setSavedSearches(recentSearches);
      })
      .catch((error) => {
        console.error("Cannot delete search history:", error);
      });
  }

  function handleSearch() {
    const normalizedQuery = searchQuery.trim();

    setAppliedSearchQuery(normalizedQuery);
    setAppliedFilters(filters);
    setIsSearchFocused(false);
    setCurrentResultPage(1);
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
    setCurrentResultPage(1);
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

    const requestVersion =
      remoteOptionSearchRequestVersionRef.current[filterKey] + 1;
    remoteOptionSearchRequestVersionRef.current[filterKey] = requestVersion;

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
          1,
          100,
        );
        const latestRequestVersion =
          remoteOptionSearchRequestVersionRef.current[filterKey];

        // Ignore stale responses from older requests to prevent UI from "jumping".
        if (requestVersion !== latestRequestVersion) {
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
        const latestRequestVersion =
          remoteOptionSearchRequestVersionRef.current[filterKey];

        if (requestVersion === latestRequestVersion) {
          setIsLoadingFilterOptions((currentState) => ({
            ...currentState,
            [filterKey]: false,
          }));
        }
      }
    }, 300);
  }

  function handleLoadMoreFilterOptions(filterKey: RemoteOptionFilterKey) {
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

    const requestVersion =
      remoteOptionSearchRequestVersionRef.current[filterKey] + 1;
    remoteOptionSearchRequestVersionRef.current[filterKey] = requestVersion;

    setIsLoadingMoreFilterOptions((currentState) => ({
      ...currentState,
      [filterKey]: true,
    }));

    void getRemoteFilterOptionsPage(filterKey, keyword, nextPage, 100)
      .then((optionsPage) => {
        const latestRequestVersion =
          remoteOptionSearchRequestVersionRef.current[filterKey];

        if (requestVersion !== latestRequestVersion) {
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
      })
      .catch((error) => {
        console.error("Cannot load more filter options:", error);
      })
      .finally(() => {
        const latestRequestVersion =
          remoteOptionSearchRequestVersionRef.current[filterKey];

        if (requestVersion === latestRequestVersion) {
          setIsLoadingMoreFilterOptions((currentState) => ({
            ...currentState,
            [filterKey]: false,
          }));
        }
      });
  }

  function handleLoadMoreResults() {
    if (!canLoadMoreResults || isLoadingMoreResults) {
      return;
    }

    const nextPage = currentResultPage + 1;

    setIsLoadingMoreResults(true);
    void runSearch(
      appliedSearchQuery,
      appliedFilters,
      selectedSort,
      optionValueLookup,
      nextPage,
      true,
    ).finally(() => {
      setIsLoadingMoreResults(false);
    });
  }

  function handleSelectSort(nextSort: string) {
    setSelectedSort(nextSort);
    setCurrentResultPage(1);
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
    setCurrentResultPage(1);
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

/*
SEARCH_FILE_NOTE
Syntax su dung:
- Barrel export (re-export).
File nay lam gi:
- Export component/search module tu mot diem duy nhat.
Flow chay:
- Noi khac import component tu file nay thay vi import tung file le.
*/

