import { ArrowRight, Search, X } from "lucide-react";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

import { searchTabs, mockSuggestedSearches } from "@/features/search/services";
import { SEARCH_VISIBLE_SAVED_SEARCH_LIMIT } from "@/features/search/constants";
import type {
  SavedSearchButtonProps,
  SavedSearchDropdownProps,
  SearchInputRowProps,
  SearchPanelProps,
  SuggestedSearchListProps,
} from "@/features/search/types";
import { formatCompactNumber } from "@/features/search/utils";

import { SearchFiltersPanel } from "./SearchFiltersPanel";

export function SearchPanel({
  activeFilterCount,
  appliedFilterSummary,
  filterOptions,
  filters,
  filtersOpen,
  hasMoreFilterOptions,
  hasFormError,
  isLoadingFilterOptions,
  isLoadingMoreFilterOptions,
  isLoadingResults,
  isSearchFocused,
  matchedPaperCount,
  matchedSavedSearchCount,
  searchQuery,
  showAllSearchSuggestions,
  totalIndexedPapers,
  visibleFilterWidgets,
  visibleSearchSuggestions,
  onApplyFilters,
  onFilterOptionSearch,
  onLoadMoreFilterOptions,
  onResetFilters,
  onSavedSearchDelete,
  onSavedSearchSelect,
  onSearch,
  onSearchBlur,
  onSearchFocus,
  onSearchQueryChange,
  onSuggestedSearchSelect,
  onToggleFilters,
  onToggleSearchSuggestions,
  onToggleVisibleFilterWidget,
  updateFilter,
}: SearchPanelProps) {
  // This component composes the top search area and the advanced filters.
  return (
    <div className="overflow-visible rounded-2xl border border-slate-400 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <SearchTabsHeader totalIndexedPapers={totalIndexedPapers} />

      <div className="p-5">
        <div className="rounded-2xl border border-slate-400 bg-slate-50/60 p-3 shadow-inner">
          <SearchInputRow
            isLoadingResults={isLoadingResults}
            isSearchFocused={isSearchFocused}
            matchedSavedSearchCount={matchedSavedSearchCount}
            searchQuery={searchQuery}
            showAllSearchSuggestions={showAllSearchSuggestions}
            visibleSearchSuggestions={visibleSearchSuggestions}
            onSavedSearchDelete={onSavedSearchDelete}
            onSavedSearchSelect={onSavedSearchSelect}
            onSearch={onSearch}
            onSearchBlur={onSearchBlur}
            onSearchFocus={onSearchFocus}
            onSearchQueryChange={onSearchQueryChange}
            onToggleSearchSuggestions={onToggleSearchSuggestions}
          />

          <SuggestedSearchList onSelect={onSuggestedSearchSelect} />
        </div>
      </div>

      <SearchFiltersPanel
        activeFilterCount={activeFilterCount}
        appliedFilterSummary={appliedFilterSummary}
        filterOptions={filterOptions}
        filters={filters}
        filtersOpen={filtersOpen}
        hasMoreFilterOptions={hasMoreFilterOptions}
        hasFormError={hasFormError}
        isLoadingFilterOptions={isLoadingFilterOptions}
        isLoadingMoreFilterOptions={isLoadingMoreFilterOptions}
        isLoadingResults={isLoadingResults}
        matchedPaperCount={matchedPaperCount}
        visibleFilterWidgets={visibleFilterWidgets}
        onApplyFilters={onApplyFilters}
        onFilterOptionSearch={onFilterOptionSearch}
        onLoadMoreFilterOptions={onLoadMoreFilterOptions}
        onResetFilters={onResetFilters}
        onToggleFilters={onToggleFilters}
        onToggleVisibleFilterWidget={onToggleVisibleFilterWidget}
        updateFilter={updateFilter}
      />
    </div>
  );
}

function SearchTabsHeader({
  totalIndexedPapers,
}: {
  totalIndexedPapers: number;
}) {
  // Format display text before JSX so the markup stays simple.
  const indexedPaperLabel =
    totalIndexedPapers > 0
      ? `${formatCompactNumber(totalIndexedPapers)} works indexed`
      : "Loading total works...";

  return (
    <div className="rounded-t-2xl border-b border-slate-400 px-5 py-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 py-3">
          {searchTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className="rounded-md bg-[#14532D] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition"
            >
              {tab}
            </button>
          ))}
        </div>

        <p className="pb-4 text-[11px] font-extrabold uppercase tracking-[0.32em] text-black sm:pb-0">
          {indexedPaperLabel}
        </p>
      </div>
    </div>
  );
}

function SearchInputRow({
  isLoadingResults,
  isSearchFocused,
  matchedSavedSearchCount,
  searchQuery,
  showAllSearchSuggestions,
  visibleSearchSuggestions,
  onSavedSearchDelete,
  onSavedSearchSelect,
  onSearch,
  onSearchBlur,
  onSearchFocus,
  onSearchQueryChange,
  onToggleSearchSuggestions,
}: SearchInputRowProps) {
  // Controlled input: React state is the source of truth for the search value.
  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextSearchQuery = event.target.value;

    onSearchQueryChange(nextSearchQuery);
  }

  function handleSearchInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const enterKeyWasPressed = event.key === "Enter";

    // Pressing Enter triggers the same search action as the button.
    if (enterKeyWasPressed) {
      onSearch();
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-400 focus-within:ring-[#15803D] md:flex-row md:items-center">
      <div className="relative flex min-w-0 flex-1 items-center gap-3">
        <Search className="h-5 w-5 shrink-0 text-[#14532D]" />

        <input
          type="search"
          value={searchQuery}
          disabled={isLoadingResults}
          onChange={handleSearchInputChange}
          onKeyDown={handleSearchInputKeyDown}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
          aria-label="Search papers"
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-black outline-none placeholder:text-black disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Search by title or abstract."
        />

        {isSearchFocused && (
          <SavedSearchDropdown
            matchedSavedSearchCount={matchedSavedSearchCount}
            searchQuery={searchQuery}
            showAllSearchSuggestions={showAllSearchSuggestions}
            visibleSearchSuggestions={visibleSearchSuggestions}
            onSavedSearchSelect={onSavedSearchSelect}
            onSavedSearchDelete={onSavedSearchDelete}
            onToggleSearchSuggestions={onToggleSearchSuggestions}
          />
        )}
      </div>

      <button
        type="button"
        onClick={onSearch}
        disabled={isLoadingResults}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoadingResults ? "Searching..." : "Search"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function SavedSearchDropdown({
  matchedSavedSearchCount,
  searchQuery,
  showAllSearchSuggestions,
  visibleSearchSuggestions,
  onSavedSearchDelete,
  onSavedSearchSelect,
  onToggleSearchSuggestions,
}: SavedSearchDropdownProps) {
  const hasMoreThanFiveSuggestions =
    matchedSavedSearchCount > SEARCH_VISIBLE_SAVED_SEARCH_LIMIT;
  const hasVisibleSearchSuggestions = visibleSearchSuggestions.length > 0;
  const emptySuggestionMessage = `No saved searches match "${searchQuery}".`;

  // Prevent blur before click so selecting a suggestion still works.
  function keepSearchInputFocused(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  return (
    <div className="absolute left-0 right-0 top-10 z-50 rounded-2xl border border-slate-400 bg-white p-2 shadow-2xl">
      <div className="flex items-center justify-between px-2 py-1.5">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black">
          Hot search
        </p>
        <span className="text-xs font-bold text-black">
          {matchedSavedSearchCount} saved
        </span>
      </div>

      {hasVisibleSearchSuggestions ? (
        <div className="max-h-72 overflow-y-auto">
          {visibleSearchSuggestions.map((savedSearch) => (
            <SavedSearchButton
              key={savedSearch.query}
              query={savedSearch.query}
              onDelete={onSavedSearchDelete}
              onSelect={onSavedSearchSelect}
            />
          ))}
        </div>
      ) : (
        <p className="px-3 py-4 text-sm font-semibold text-black">
          {emptySuggestionMessage}
        </p>
      )}

      {hasMoreThanFiveSuggestions && (
        <button
          type="button"
          onMouseDown={keepSearchInputFocused}
          onClick={onToggleSearchSuggestions}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-[#14532D] transition hover:border-[#16A34A] hover:bg-[#A3E635]/20"
        >
          {showAllSearchSuggestions ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function SavedSearchButton({
  query,
  onDelete,
  onSelect,
}: SavedSearchButtonProps) {
  // Prevent blur before click so the dropdown does not close too early.
  function keepSearchInputFocused(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function handleSavedSearchClick() {
    onSelect(query);
  }

  function handleDeleteSavedSearchClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onDelete(query);
  }

  return (
    <div className="flex items-center rounded-xl transition hover:bg-[#A3E635]/20">
      <button
        type="button"
        onMouseDown={keepSearchInputFocused}
        onClick={handleSavedSearchClick}
        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold text-black transition hover:text-[#14532D]"
      >
        <Search className="h-4 w-4 shrink-0 text-black" />
        <span className="min-w-0 flex-1 truncate">{query}</span>
      </button>

      <button
        type="button"
        aria-label={`Delete ${query}`}
        onMouseDown={keepSearchInputFocused}
        onClick={handleDeleteSavedSearchClick}
        className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-black transition hover:bg-red-50 hover:text-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function SuggestedSearchList({ onSelect }: SuggestedSearchListProps) {
  function handleSuggestionClick(event: MouseEvent<HTMLButtonElement>) {
    // The button value carries the suggestion text without creating closures.
    const suggestion = event.currentTarget.value;

    onSelect(suggestion);
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-black">
        Try:
      </span>

      {mockSuggestedSearches.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          value={suggestion}
          onClick={handleSuggestionClick}
          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black ring-1 ring-slate-400 transition hover:text-[#15803D] hover:ring-[#16A34A]"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
