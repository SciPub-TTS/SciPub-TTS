import { useMemo, useState } from "react";

import { initialFilters, resultSortOptions } from "../constants";
import { mockPaperResults, mockSavedSearches } from "../services";
import type { SavedSearch, SearchFilters } from "../types";
import {
  buildAppliedFilterSummary,
  countActiveFilters,
  filterPaperResults,
  getVisibleSearchSuggestions,
  hasInvalidCitationRange,
  hasInvalidYearRange,
} from "../utils";

export function useSearchPageState() {
  const [searchQuery, setSearchQuery] = useState("diffusion 2024");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("diffusion 2024");
  const [savedSearches, setSavedSearches] =
    useState<SavedSearch[]>(mockSavedSearches);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAllSearchSuggestions, setShowAllSearchSuggestions] =
    useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilters>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState(resultSortOptions[0]);
  const [visibleResultCount, setVisibleResultCount] = useState(3);

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
  const filteredPaperResults = useMemo(
    () => filterPaperResults(mockPaperResults, appliedSearchQuery),
    [appliedSearchQuery],
  );
  const visiblePaperResults = filteredPaperResults.slice(0, visibleResultCount);
  const canLoadMoreResults = visibleResultCount < filteredPaperResults.length;
  const hasFormError =
    hasInvalidYearRange(filters) || hasInvalidCitationRange(filters);

  function updateFilter<Key extends keyof SearchFilters>(
    key: Key,
    value: SearchFilters[Key],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  }

  function handleApplyFilters() {
    if (hasFormError) return;

    // TODO: Send this payload to the search API when backend integration is ready.
    setAppliedFilters(filters);
  }

  function handleSaveSearch() {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) return;

    // TODO: Replace this mock state update with a save-search API request.
    setSavedSearches((currentSearches) => [
      {
        id: `search-${Date.now()}`,
        query: normalizedQuery,
        savedAt: new Date().toISOString(),
      },
      ...currentSearches.filter(
        (savedSearch) =>
          savedSearch.query.toLowerCase() !== normalizedQuery.toLowerCase(),
      ),
    ]);
    setShowAllSearchSuggestions(false);
    setIsSearchFocused(true);
  }

  function handleSelectSavedSearch(query: string) {
    setSearchQuery(query);
    setAppliedSearchQuery(query);
    setVisibleResultCount(3);
    setShowAllSearchSuggestions(false);
    setIsSearchFocused(false);
  }

  function handleSearch() {
    setAppliedSearchQuery(searchQuery.trim());
    setVisibleResultCount(3);
    setIsSearchFocused(false);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }

  return {
    activeFilterCount,
    appliedFilterSummary,
    appliedSearchQuery,
    canLoadMoreResults,
    filteredPaperResults,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleSaveSearch,
    handleSearch,
    handleSelectSavedSearch,
    hasFormError,
    isSearchFocused,
    matchedSavedSearchCount,
    resetFilters,
    searchQuery,
    selectedSort,
    setFiltersOpen,
    setAppliedSearchQuery,
    setIsSearchFocused,
    setSearchQuery,
    setSelectedSort,
    setShowAllFilters,
    setShowAllSearchSuggestions,
    setVisibleResultCount,
    showAllFilters,
    showAllSearchSuggestions,
    updateFilter,
    visiblePaperResults,
    visibleSearchSuggestions,
  };
}
