import { ArrowRight, Search } from "lucide-react";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

import { searchTabs, mockSuggestedSearches } from "@/features/search/services";
import type {
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
  matchedPaperCount,
  searchQuery,
  totalIndexedPapers,
  visibleFilterWidgets,
  onApplyFilters,
  onFilterOptionSearch,
  onLoadMoreFilterOptions,
  onResetFilters,
  onSearch,
  onSearchQueryChange,
  onSuggestedSearchSelect,
  onToggleFilters,
  onToggleVisibleFilterWidget,
  updateFilter,
}: SearchPanelProps) {
  // This component composes the top search area and the advanced filters.
  return (
    <div className="overflow-visible rounded-2xl border border-black bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <SearchTabsHeader totalIndexedPapers={totalIndexedPapers} />

      <div className="p-5">
        <div className="rounded-2xl border border-black bg-slate-50/60 p-3 shadow-inner">
          <SearchInputRow
            isLoadingResults={isLoadingResults}
            searchQuery={searchQuery}
            onSearch={onSearch}
            onSearchQueryChange={onSearchQueryChange}
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

type SearchTabsHeaderProps = {
  totalIndexedPapers: number;
};

function SearchTabsHeader(props: SearchTabsHeaderProps) {
  const { totalIndexedPapers } = props;

  // Format display text before JSX so the markup stays simple.
  const indexedPaperLabel =
    totalIndexedPapers > 0
      ? `${formatCompactNumber(totalIndexedPapers)} works indexed`
      : "Loading total works...";

  return (
    <div className="rounded-t-2xl border-b border-black px-5 py-0">
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
  searchQuery,
  onSearch,
  onSearchQueryChange,
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
    <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#2f8551] md:flex-row md:items-center">
      <div className="relative flex min-w-0 flex-1 items-center gap-3">
        <Search className="h-5 w-5 shrink-0  font-extrabold" />

        <input
          type="search"
          value={searchQuery}
          disabled={isLoadingResults}
          onChange={handleSearchInputChange}
          onKeyDown={handleSearchInputKeyDown}
          aria-label="Search papers"
          className="min-w-0 flex-1 bg-transparent text-base font-medium text-black outline-none placeholder:text-black disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Search by title or abstract."
        />
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
          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black ring-1 ring-black transition hover:text-[#15803D] hover:ring-[#16A34A]"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
