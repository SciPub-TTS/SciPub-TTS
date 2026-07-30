import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  initialFilters,
  SEARCH_DEFAULT_PAGE,
  SEARCH_WORKS_PER_PAGE,
} from "../constants";
import {
  getSearchSummary,
  searchEntities,
  searchWorks,
  SearchWorksResponseContractError,
  type SearchResultsPage,
} from "../services";
import type {
  SearchEntityType,
  SearchSortState,
} from "../types";
import type { SubmittedSearch } from "./stateHelpers";
import type { SearchResultItem } from "../types";

type UseSearchResultsStateParams = {
  activeEntityType: SearchEntityType;
  currentSortState: SearchSortState;
  submittedSearch: SubmittedSearch | null;
};

export function useSearchResultsState(params: UseSearchResultsStateParams) {
  const {
    activeEntityType,
    currentSortState,
    submittedSearch,
  } = params;
  const [currentResultPage, setCurrentResultPage] =
    useState(SEARCH_DEFAULT_PAGE);
  const searchSummaryQuery = useQuery({
    queryFn: () => getSearchSummary(activeEntityType),
    queryKey: ["searchSummary", activeEntityType],
  });

  const searchResultsQuery = useQuery<SearchResultsPage>({
    enabled: submittedSearch !== null,
    queryFn: () => {
      if (!submittedSearch) {
        throw new Error("Search request is missing.");
      }

      if (submittedSearch.entityType === "works") {
        return searchWorks({
          appliedSearchQuery: submittedSearch.appliedSearchQuery,
          filters: submittedSearch.appliedFilters,
          optionValueLookup: submittedSearch.optionValueLookup,
          page: currentResultPage,
          sortState: submittedSearch.sortState,
        });
      }

      return searchEntities({
        appliedSearchQuery: submittedSearch.appliedSearchQuery,
        filters: submittedSearch.appliedFilters,
        entityType: submittedSearch.entityType,
        optionValueLookup: submittedSearch.optionValueLookup,
        page: currentResultPage,
        sortState: submittedSearch.sortState,
      });
    },
    queryKey: ["searchResults", submittedSearch, currentResultPage],
    retry(failureCount, error) {
      if (error instanceof SearchWorksResponseContractError) {
        return false;
      }

      return failureCount < 2;
    },
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
  const appliedSortState =
    submittedSearch?.sortState || currentSortState;
  const resultsPage = searchResultsQuery.data;
  const visibleResults = resultsPage ? getPageItems(resultsPage) : [];
  const hasSearched = submittedSearch !== null;

  return {
    appliedEntityType,
    appliedFilters,
    appliedSearchQuery,
    appliedSortState,
    currentResultPage,
    handleResultPageChange: setCurrentResultPage,
    hasSearched,
    isIndexedCountExact: searchSummaryQuery.data?.totalCountExact ?? true,
    isLoadingResults: submittedSearch !== null && searchResultsQuery.isPending,
    isTotalResultCountExact:
      resultsPage?.entityType === "works"
        ? true
        : resultsPage?.totalCountExact ?? true,
    matchedResultCount: resultsPage?.totalCount || 0,
    resultPageSize: resultsPage?.perPage || SEARCH_WORKS_PER_PAGE,
    resultErrorMessage: getSearchResultErrorMessage(searchResultsQuery.error),
    totalIndexedCount: searchSummaryQuery.data?.totalIndexedCount || 0,
    visibleResults,
  };
}

function getSearchResultErrorMessage(error: unknown) {
  if (!error) {
    return "";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Cannot load search results right now.";
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

