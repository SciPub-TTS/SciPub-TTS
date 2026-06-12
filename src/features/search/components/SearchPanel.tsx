import { ArrowRight, History, Save, Search } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { searchTabs } from "@/features/search/services";
import type {
  SearchInputRowProps,
  SearchPanelProps,
} from "@/features/search/types";
import { formatCompactNumber } from "@/features/search/utils";

import { SearchFiltersPanel } from "./SearchFiltersPanel";

export function SearchPanel({
  activeFilterCount,
  appliedFilterSummary,
  canSaveSearch,
  filterOptions,
  filters,
  filtersOpen,
  hasMoreFilterOptions,
  hasFormError,
  isLoadingFilterOptions,
  isLoadingMoreFilterOptions,
  isLoadingResults,
  isSavingSearch,
  matchedPaperCount,
  recentSearches,
  searchQuery,
  totalIndexedPapers,
  visibleFilterWidgets,
  onApplyFilters,
  onFilterOptionSearch,
  onLoadMoreFilterOptions,
  onResetFilters,
  onSearch,
  onSearchQueryChange,
  onSaveSearch,
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
            canSaveSearch={canSaveSearch}
            isLoadingResults={isLoadingResults}
            isSavingSearch={isSavingSearch}
            recentSearches={recentSearches}
            searchQuery={searchQuery}
            onSearch={onSearch}
            onSearchQueryChange={onSearchQueryChange}
            onSaveSearch={onSaveSearch}
            onSelectSuggestion={onSuggestedSearchSelect}
          />
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
  canSaveSearch,
  isLoadingResults,
  isSavingSearch,
  recentSearches,
  searchQuery,
  onSearch,
  onSearchQueryChange,
  onSaveSearch,
  onSelectSuggestion,
}: SearchInputRowProps) {
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSuggestionOpen) {
      return;
    }

    function handleDocumentMouseDown(event: MouseEvent | globalThis.MouseEvent) {
      if (!containerRef.current) {
        return;
      }

      if (containerRef.current.contains(event.target as Node)) {
        return;
      }

      setIsSuggestionOpen(false);
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [isSuggestionOpen]);

  // Controlled input: React state is the source of truth for the search value.
  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextSearchQuery = event.target.value;

    onSearchQueryChange(nextSearchQuery);
    setIsSuggestionOpen(true);
  }

  function handleSearchInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const enterKeyWasPressed = event.key === "Enter";

    // Pressing Enter triggers the same search action as the button.
    if (enterKeyWasPressed) {
      setIsSuggestionOpen(false);
      onSearch();
    }
  }

  function handleInputFocus() {
    setIsSuggestionOpen(true);
  }

  function handleSearchClick() {
    setIsSuggestionOpen(false);
    onSearch();
  }

  function handleSaveClick() {
    onSaveSearch();
  }

  function handleSuggestionClick(event: MouseEvent<HTMLButtonElement>) {
    const suggestion = event.currentTarget.value;

    setIsSuggestionOpen(false);
    onSelectSuggestion(suggestion);
  }

  function handleSuggestionMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  const shouldShowSuggestions = isSuggestionOpen && recentSearches.length > 0;

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#2f8551] md:flex-row md:items-start"
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-3">
        <Search className="h-5 w-5 shrink-0 font-extrabold" />

        <div className="min-w-0 flex-1">
          <input
            type="search"
            value={searchQuery}
            disabled={isLoadingResults}
            onChange={handleSearchInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleSearchInputKeyDown}
            aria-label="Search papers"
            className="min-w-0 w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-black disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Search by title or abstract."
          />

          {shouldShowSuggestions ? (
            <div className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-2xl border border-black bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <History className="h-4 w-4 text-[#14532D]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-black">
                  Recent searches
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {recentSearches.map((savedSearch) => (
                  <button
                    key={`${savedSearch.query}-${savedSearch.savedAt}`}
                    type="button"
                    value={savedSearch.query}
                    onMouseDown={handleSuggestionMouseDown}
                    onClick={handleSuggestionClick}
                    className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-semibold text-black transition hover:bg-[#A3E635]/20 hover:text-[#15803D]"
                  >
                    <Search className="mr-3 h-4 w-4 shrink-0" />
                    <span className="truncate">{savedSearch.query}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 md:shrink-0">
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={!canSaveSearch || isSavingSearch}
          className={[
            "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition",
            canSaveSearch
              ? "border-black bg-white text-black hover:bg-[#FEF3C7]"
              : "border-slate-300 bg-slate-100 text-slate-400",
          ].join(" ")}
        >
          <Save className="h-4 w-4" />
          {isSavingSearch ? "Saving..." : "Save your search"}
        </button>

        <button
          type="button"
          onClick={handleSearchClick}
          disabled={isLoadingResults}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoadingResults ? "Searching..." : "Search"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
