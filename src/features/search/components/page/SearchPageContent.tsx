import { useSearchPageState } from "@/features/search/hooks";

import { SearchPageHeader } from "./SearchPageHeader";
import { SearchPanel } from "../panel/SearchPanel";
import { SearchResults } from "../results/SearchResults";

export default function SearchPageContent() {
  // Keep the page itself thin: the hook owns state and handlers, and this
  // component only passes that data into the main UI blocks.
  const {
    activeEntityType,
    activeFilterCount,
    appliedFilterSummary,
    appliedSearchQuery,
    canSaveSearch,
    currentResultPage,
    filterOptions,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleApplySort,
    handleClearRecentSearches,
    handleClearSorts,
    handleDeleteRecentSearch,
    handleEntityTypeChange,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    handleResultPageChange,
    handleSaveSearch,
    handleSearch,
    handleSearchQueryChange,
    handleSelectSort,
    handleSuggestedSearch,
    handleToggleFilters,
    handleToggleVisibleFilterWidget,
    hasFormError,
    hasMoreFilterOptions,
    hasSearched,
    isClearingRecentSearches,
    isDeletingRecentSearch,
    isIndexedCountExact,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    isLoadingResults,
    isSavingSearch,
    isTotalResultCountExact,
    matchedResultCount,
    recentSearches,
    resetFilters,
    resultErrorMessage,
    resultPageSize,
    saveSearchFeedback,
    saveSearchNotice,
    saveSearchSuccessToken,
    searchPlaceholder,
    searchQuery,
    showFilterAddMenu,
    showFilters,
    sortState,
    totalIndexedCount,
    updateFilter,
    visibleFilterWidgets,
    visibleResults,
  } = useSearchPageState();

  return (
    <section className="space-y-7">
      <SearchPageHeader />

      <SearchPanel
        activeEntityType={activeEntityType}
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
        isIndexedCountExact={isIndexedCountExact}
        isLoadingFilterOptions={isLoadingFilterOptions}
        isLoadingMoreFilterOptions={isLoadingMoreFilterOptions}
        isLoadingResults={isLoadingResults}
        isSavingSearch={isSavingSearch}
        matchedPaperCount={matchedResultCount}
        recentSearches={recentSearches}
        saveSearchFeedback={saveSearchFeedback}
        saveSearchNotice={saveSearchNotice}
        saveSearchSuccessToken={saveSearchSuccessToken}
        searchPlaceholder={searchPlaceholder}
        searchQuery={searchQuery}
        showFilterAddMenu={showFilterAddMenu}
        showFilters={showFilters}
        totalIndexedCount={totalIndexedCount}
        visibleFilterWidgets={visibleFilterWidgets}
        onApplyFilters={handleApplyFilters}
        onClearRecentSearches={handleClearRecentSearches}
        onDeleteRecentSearch={handleDeleteRecentSearch}
        onEntityTypeChange={handleEntityTypeChange}
        onFilterOptionSearch={handleFilterOptionSearch}
        onLoadMoreFilterOptions={handleLoadMoreFilterOptions}
        onResetFilters={resetFilters}
        onSaveSearch={handleSaveSearch}
        onSearch={handleSearch}
        onSearchQueryChange={handleSearchQueryChange}
        onSuggestedSearchSelect={handleSuggestedSearch}
        onToggleFilters={handleToggleFilters}
        onToggleVisibleFilterWidget={handleToggleVisibleFilterWidget}
        updateFilter={updateFilter}
      />

      <SearchResults
        activeEntityType={activeEntityType}
        appliedSearchQuery={appliedSearchQuery}
        currentPage={currentResultPage}
        hasSearched={hasSearched}
        isLoadingResults={isLoadingResults}
        isTotalResultCountExact={isTotalResultCountExact}
        pageSize={resultPageSize}
        resultErrorMessage={resultErrorMessage}
        sortState={sortState}
        totalResultCount={matchedResultCount}
        visibleResults={visibleResults}
        onApplySort={handleApplySort}
        onClearSorts={handleClearSorts}
        onPageChange={handleResultPageChange}
        onSelectSort={handleSelectSort}
      />
    </section>
  );
}
