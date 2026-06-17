import { useSearchPageState } from "@/features/search/hooks";

import { SearchPageHeader } from "./SearchPageHeader";
import { SearchPanel } from "../panel";
import { SearchResults } from "../results";

export default function SearchPageContent() {
  // Đây là nơi nối state trung tâm với 3 khối lớn của màn hình:
  // header, vùng nhập/filter và danh sách kết quả.
  const {
    activeEntityType,
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
    handleClearSorts,
    handleDeleteRecentSearch,
    handleEntityTypeChange,
    handleSaveSearch,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    handleLoadMoreResults,
    handleSearch,
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
    isIndexedCountExact,
    isLoadingResults,
    isLoadingMoreResults,
    isSavingSearch,
    isTotalResultCountExact,
    matchedResultCount,
    recentSearches,
    resetFilters,
    responseTimeSeconds,
    saveSearchFeedback,
    saveSearchNotice,
    saveSearchSuccessToken,
    searchPlaceholder,
    searchQuery,
    showFilters,
    showFilterAddMenu,
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
        showFilters={showFilters}
        showFilterAddMenu={showFilterAddMenu}
        totalIndexedCount={totalIndexedCount}
        isIndexedCountExact={isIndexedCountExact}
        visibleFilterWidgets={visibleFilterWidgets}
        onApplyFilters={handleApplyFilters}
        onClearRecentSearches={handleClearRecentSearches}
        onDeleteRecentSearch={handleDeleteRecentSearch}
        onEntityTypeChange={handleEntityTypeChange}
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
        activeEntityType={activeEntityType}
        appliedSearchQuery={appliedSearchQuery}
        autoLoadAnchorIndex={autoLoadAnchorIndex}
        canLoadMoreResults={canLoadMoreResults}
        hasSearched={hasSearched}
        isTotalResultCountExact={isTotalResultCountExact}
        isLoadingResults={isLoadingResults}
        isLoadingMoreResults={isLoadingMoreResults}
        responseTimeSeconds={responseTimeSeconds}
        sortState={sortState}
        totalResultCount={matchedResultCount}
        visibleResults={visibleResults}
        onLoadMoreResults={handleLoadMoreResults}
        onClearSorts={handleClearSorts}
        onSelectSort={handleSelectSort}
      />
    </section>
  );
}

