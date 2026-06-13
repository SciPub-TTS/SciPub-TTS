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
    canSaveSearch,
    canLoadMoreResults,
    filterOptions,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleClearRecentSearches,
    handleDeleteRecentSearch,
    handleSaveSearch,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    handleLoadMoreResults,
    handleSearch,
    handleClearSorts,
    handleSearchQueryChange,
    handleSelectSort,
    handleSuggestedSearch,
    handleToggleFilters,
    handleToggleVisibleFilterWidget,
    hasFormError,
    hasSearched,
    hasMoreFilterOptions,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    isClearingRecentSearches,
    isDeletingRecentSearch,
    isLoadingResults,
    isLoadingMoreResults,
    isSavingSearch,
    matchedPaperCount,
    recentSearches,
    resetFilters,
    responseTimeSeconds,
    saveSearchFeedback,
    saveSearchNotice,
    saveSearchSuccessToken,
    searchQuery,
    sortState,
    totalIndexedPapers,
    updateFilter,
    visibleFilterWidgets,
    visiblePaperResults,
  } = useSearchPageState();

  return (
    <section className="space-y-7">
      <SearchPageHeader />

      <SearchPanel
        activeFilterCount={activeFilterCount}
        appliedFilterSummary={appliedFilterSummary}
        canSaveSearch={canSaveSearch}
        filterOptions={filterOptions}
        filters={filters}
        filtersOpen={filtersOpen}
        hasFormError={hasFormError}
        hasMoreFilterOptions={hasMoreFilterOptions}
        isClearingRecentSearches={isClearingRecentSearches}
        isDeletingRecentSearch={isDeletingRecentSearch}
        isLoadingFilterOptions={isLoadingFilterOptions}
        isLoadingMoreFilterOptions={isLoadingMoreFilterOptions}
        isLoadingResults={isLoadingResults}
        isSavingSearch={isSavingSearch}
        matchedPaperCount={matchedPaperCount}
        recentSearches={recentSearches}
        saveSearchFeedback={saveSearchFeedback}
        saveSearchNotice={saveSearchNotice}
        saveSearchSuccessToken={saveSearchSuccessToken}
        searchQuery={searchQuery}
        totalIndexedPapers={totalIndexedPapers}
        visibleFilterWidgets={visibleFilterWidgets}
        onApplyFilters={handleApplyFilters}
        onClearRecentSearches={handleClearRecentSearches}
        onDeleteRecentSearch={handleDeleteRecentSearch}
        onFilterOptionSearch={handleFilterOptionSearch}
        onLoadMoreFilterOptions={handleLoadMoreFilterOptions}
        onResetFilters={resetFilters}
        onSearch={handleSearch}
        onSearchQueryChange={handleSearchQueryChange}
        onSaveSearch={handleSaveSearch}
        onSuggestedSearchSelect={handleSuggestedSearch}
        onToggleFilters={handleToggleFilters}
        onToggleVisibleFilterWidget={handleToggleVisibleFilterWidget}
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
        sortState={sortState}
        totalResultCount={matchedPaperCount}
        visiblePaperResults={visiblePaperResults}
        onLoadMoreResults={handleLoadMoreResults}
        onClearSorts={handleClearSorts}
        onSelectSort={handleSelectSort}
      />
    </section>
  );
}

