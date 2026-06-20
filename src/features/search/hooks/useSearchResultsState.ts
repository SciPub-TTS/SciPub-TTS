import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { initialFilters, SEARCH_DEFAULT_PAGE } from "../constants";
import { getSearchSummary, searchEntities, searchWorks } from "../services";
import type { SearchEntityType, SearchSortState } from "../types";
import {
  flattenSearchResultPages,
  getAutoLoadAnchorIndex,
  getNextSearchResultsPage,
  getSearchResponseTime,
} from "./resultHelpers";
import type { SubmittedSearch } from "./types";

type UseSearchResultsStateParams = {
  activeEntityType: SearchEntityType;
  currentSortState: SearchSortState;
  submittedSearch: SubmittedSearch | null;
};

// Query-heavy logic lives here so the page hook can focus on user intent:
// which search should run, when to clear, and which handlers the UI needs.
export function useSearchResultsState(params: UseSearchResultsStateParams) {
  const { activeEntityType, currentSortState, submittedSearch } = params;
  const searchSummaryQuery = useQuery({
    queryFn: () => getSearchSummary(activeEntityType),
    queryKey: ["searchSummary", activeEntityType],
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
        filters: submittedSearch.appliedFilters,
        entityType: submittedSearch.entityType,
        optionValueLookup: submittedSearch.optionValueLookup,
        page: Number(pageParam),
        sortState: submittedSearch.sortState,
      });
    },
    queryKey: ["searchResults", submittedSearch],
  });

  useEffect(() => {
    if (searchSummaryQuery.error) {
      console.error("Cannot load search summary:", searchSummaryQuery.error);
    }
  }, [searchSummaryQuery.error]);

  useEffect(() => {
    if (searchResultsQuery.error) {
      console.error("Search API failed:", searchResultsQuery.error);
    }
  }, [searchResultsQuery.error]);

  const appliedSearchQuery = submittedSearch?.appliedSearchQuery || "";
  const appliedEntityType = submittedSearch?.entityType || activeEntityType;
  const appliedFilters = submittedSearch?.appliedFilters || initialFilters;
  const appliedSortState = submittedSearch?.sortState || currentSortState;
  const visibleResults = flattenSearchResultPages(
    searchResultsQuery.data?.pages || [],
    appliedEntityType,
    appliedSortState,
  );
  const latestResultsPage =
    searchResultsQuery.data?.pages[
      Math.max((searchResultsQuery.data?.pages.length || 1) - 1, 0)
    ];
  const hasSearched = submittedSearch !== null;
  const hasMoreResults = Boolean(searchResultsQuery.hasNextPage);

  return {
    appliedEntityType,
    appliedFilters,
    appliedSearchQuery,
    appliedSortState,
    autoLoadAnchorIndex: getAutoLoadAnchorIndex(
      hasSearched,
      hasMoreResults,
      searchResultsQuery.data?.pages.length || 0,
    ),
    canLoadMoreResults: hasMoreResults && visibleResults.length > 0,
    handleLoadMoreResults() {
      if (!hasMoreResults || searchResultsQuery.isFetchingNextPage) {
        return;
      }

      void searchResultsQuery.fetchNextPage();
    },
    hasSearched,
    isIndexedCountExact: searchSummaryQuery.data?.totalCountExact ?? true,
    isLoadingMoreResults: searchResultsQuery.isFetchingNextPage,
    isLoadingResults: submittedSearch !== null && searchResultsQuery.isPending,
    isTotalResultCountExact:
      latestResultsPage?.entityType === "works"
        ? true
        : latestResultsPage?.totalCountExact ?? true,
    matchedResultCount: latestResultsPage?.totalCount || 0,
    responseTimeSeconds: getSearchResponseTime(
      searchResultsQuery.data?.pages || [],
    ),
    totalIndexedCount: searchSummaryQuery.data?.totalIndexedCount || 0,
    visibleResults,
  };
}

