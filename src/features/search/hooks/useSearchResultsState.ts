import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  initialFilters,
  SEARCH_DEFAULT_PAGE,
  SEARCH_NEXT_QUERY_TRIGGER_OFFSET,
  SEARCH_WORKS_PER_PAGE,
} from "../constants";
import {
  getSearchSummary,
  searchEntities,
  searchWorks,
  sortPaperResults,
  type SearchResultsPage,
} from "../services";
import type { SearchEntityType, SearchSortState } from "../types";
import type { SubmittedSearch } from "./stateHelpers";
import type { PaperResult, SearchResultItem } from "../types";

type UseSearchResultsStateParams = {
  activeEntityType: SearchEntityType;
  currentSortState: SearchSortState;
  submittedSearch: SubmittedSearch | null;
};

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

function flattenSearchResultPages(
  pages: SearchResultsPage[],
  entityType: SearchEntityType,
  sortState: SearchSortState,
) {
  let mergedResults: SearchResultItem[] = [];

  for (const page of pages) {
    const pageItems = getPageItems(page);
    mergedResults = mergeUniqueSearchResults(mergedResults, pageItems);
  }

  if (entityType !== "works") {
    return mergedResults;
  }

  return sortPaperResults(mergedResults as PaperResult[], sortState);
}

function getNextSearchResultsPage(
  lastPage: SearchResultsPage,
  allPages: SearchResultsPage[],
) {
  if (!isWorksResultsPage(lastPage)) {
    return lastPage.hasMore ? lastPage.page + 1 : undefined;
  }

  const loadedResultCount = allPages.reduce((totalCount, page) => {
    const pageItems = getPageItems(page);
    return totalCount + pageItems.length;
  }, 0);
  const lastPageItems = getPageItems(lastPage);

  if (lastPageItems.length === 0) {
    return undefined;
  }

  if (loadedResultCount >= lastPage.totalCount) {
    return undefined;
  }

  return lastPage.page + 1;
}

function getSearchResponseTime(pages: SearchResultsPage[]) {
  if (pages.length === 0) {
    return 0;
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

function mergeUniqueSearchResults(
  existing: SearchResultItem[],
  incoming: SearchResultItem[],
) {
  const seenIds = new Set<string>();
  const merged: SearchResultItem[] = [];

  for (const item of existing) {
    seenIds.add(`${item.entityType}:${item.id}`);
    merged.push(item);
  }

  for (const item of incoming) {
    const itemKey = `${item.entityType}:${item.id}`;

    if (!seenIds.has(itemKey)) {
      seenIds.add(itemKey);
      merged.push(item);
    }
  }

  return merged;
}

function getPageItems(page: SearchResultsPage): SearchResultItem[] {
  if ("works" in page && Array.isArray(page.works)) {
    return page.works;
  }

  if ("items" in page && Array.isArray(page.items)) {
    return page.items;
  }

  return [];
}

function isWorksResultsPage(
  page: SearchResultsPage,
): page is Extract<SearchResultsPage, { entityType: "works" }> {
  return page.entityType === "works" && "works" in page && Array.isArray(page.works);
}
