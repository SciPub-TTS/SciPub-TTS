import { useSearchPageState } from "@/features/search/hooks";

import { SearchPageHeader } from "./SearchPageHeader";
import { SearchPanel } from "./SearchPanel";
import { SearchResults } from "./SearchResults";

export default function SearchPageContent() {
  // Pull values out of the hook once so the JSX below reads like wiring.
  const {
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
  } = useSearchPageState();

  // Disable saving until the user types a non-empty query.
  const canSaveSearch = searchQuery.trim().length > 0;

  return (
    <section className="space-y-7">
      <SearchPageHeader
        canSaveSearch={canSaveSearch}
        onSaveSearch={handleSaveSearch}
      />

      <SearchPanel
        activeFilterCount={activeFilterCount}
        appliedFilterSummary={appliedFilterSummary}
        filterOptions={filterOptions}
        filters={filters}
        filtersOpen={filtersOpen}
        hasFormError={hasFormError}
        hasMoreFilterOptions={hasMoreFilterOptions}
        isLoadingFilterOptions={isLoadingFilterOptions}
        isLoadingMoreFilterOptions={isLoadingMoreFilterOptions}
        isLoadingResults={isLoadingResults}
        isSearchFocused={isSearchFocused}
        matchedPaperCount={matchedPaperCount}
        matchedSavedSearchCount={matchedSavedSearchCount}
        searchQuery={searchQuery}
        showAllFilters={showAllFilters}
        showAllSearchSuggestions={showAllSearchSuggestions}
        totalIndexedPapers={totalIndexedPapers}
        visibleSearchSuggestions={visibleSearchSuggestions}
        onApplyFilters={handleApplyFilters}
        onFilterOptionSearch={handleFilterOptionSearch}
        onLoadMoreFilterOptions={handleLoadMoreFilterOptions}
        onResetFilters={resetFilters}
        onSavedSearchDelete={handleDeleteSavedSearch}
        onSavedSearchSelect={handleSelectSavedSearch}
        onSearch={handleSearch}
        onSearchBlur={handleSearchBlur}
        onSearchFocus={handleSearchFocus}
        onSearchQueryChange={handleSearchQueryChange}
        onSuggestedSearchSelect={handleSuggestedSearch}
        onToggleFilters={handleToggleFilters}
        onToggleMoreFilters={handleToggleMoreFilters}
        onToggleSearchSuggestions={handleToggleSearchSuggestions}
        updateFilter={updateFilter}
      />

      <SearchResults
        appliedSearchQuery={appliedSearchQuery}
        autoLoadAnchorIndex={autoLoadAnchorIndex}
        canLoadMoreResults={canLoadMoreResults}
        hasSearched={hasSearched}
        isLoadingResults={isLoadingResults}
        isLoadingMoreResults={isLoadingMoreResults}
        responseTimeSeconds={responseTimeSeconds}
        selectedSort={selectedSort}
        totalResultCount={matchedPaperCount}
        visiblePaperResults={visiblePaperResults}
        onLoadMoreResults={handleLoadMoreResults}
        onSelectSort={handleSelectSort}
      />
    </section>
  );
}

