import { ArrowRight, History, Save, Search, X } from "lucide-react";
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
  isClearingRecentSearches,
  isDeletingRecentSearch,
  isLoadingFilterOptions,
  isLoadingMoreFilterOptions,
  isLoadingResults,
  isSavingSearch,
  matchedPaperCount,
  recentSearches,
  saveSearchFeedback,
  saveSearchNotice,
  saveSearchSuccessToken,
  searchQuery,
  totalIndexedPapers,
  visibleFilterWidgets,
  onApplyFilters,
  onClearRecentSearches,
  onDeleteRecentSearch,
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
      <SearchTabsHeader
        canSaveSearch={canSaveSearch}
        isSavingSearch={isSavingSearch}
        saveSearchFeedback={saveSearchFeedback}
        saveSearchNotice={saveSearchNotice}
        totalIndexedPapers={totalIndexedPapers}
        onSaveSearch={onSaveSearch}
      />

      <div className="p-5">
        <div className="rounded-2xl border border-black bg-slate-50/60 px-3 py-4 shadow-inner">
          <SearchInputRow
            isLoadingResults={isLoadingResults}
            recentSearches={recentSearches}
            saveSearchSuccessToken={saveSearchSuccessToken}
            searchQuery={searchQuery}
            isClearingRecentSearches={isClearingRecentSearches}
            isDeletingRecentSearch={isDeletingRecentSearch}
            onClearSuggestions={onClearRecentSearches}
            onDeleteSuggestion={onDeleteRecentSearch}
            onSearch={onSearch}
            onSearchQueryChange={onSearchQueryChange}
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
  canSaveSearch: boolean;
  isSavingSearch: boolean;
  saveSearchFeedback: SearchPanelProps["saveSearchFeedback"];
  saveSearchNotice: string | null;
  totalIndexedPapers: number;
  onSaveSearch: () => void;
};

function SearchTabsHeader(props: SearchTabsHeaderProps) {
  const {
    canSaveSearch,
    isSavingSearch,
    saveSearchFeedback,
    saveSearchNotice,
    totalIndexedPapers,
    onSaveSearch,
  } = props;

  // Format display text before JSX so the markup stays simple.
  const indexedPaperLabel =
    totalIndexedPapers > 0
      ? `${formatCompactNumber(totalIndexedPapers)} works indexed`
      : "Loading total works...";

  return (
    <div className="rounded-t-2xl border-b border-black px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1">
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

        <div className="flex flex-col items-start gap-2 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-black">
              {indexedPaperLabel}
            </p>

            <button
              type="button"
              title={saveSearchNotice || undefined}
              onClick={onSaveSearch}
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
          </div>

          {saveSearchFeedback ? (
            <p
              className={[
                "text-xs font-semibold lg:text-right",
                saveSearchFeedback.kind === "success"
                  ? "text-[#166534]"
                  : "text-[#B91C1C]",
              ].join(" ")}
            >
              {saveSearchFeedback.message}
            </p>
          ) : null}

          {!saveSearchFeedback && saveSearchNotice ? (
            <p className="text-xs font-semibold text-[#92400E] lg:text-right">
              {saveSearchNotice}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SearchInputRow({
  isLoadingResults,
  recentSearches,
  saveSearchSuccessToken,
  searchQuery,
  isClearingRecentSearches,
  isDeletingRecentSearch,
  onClearSuggestions,
  onDeleteSuggestion,
  onSearch,
  onSearchQueryChange,
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

  useEffect(() => {
    if (!saveSearchSuccessToken || !searchQuery.trim()) {
      return;
    }

    setIsSuggestionOpen(true);
  }, [saveSearchSuccessToken, searchQuery]);

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

  function handleSuggestionClick(event: MouseEvent<HTMLButtonElement>) {
    const suggestion = event.currentTarget.value;

    setIsSuggestionOpen(false);
    onSelectSuggestion(suggestion);
  }

  function handleSuggestionMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function handleDeleteSuggestionMouseDown(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
  }

  function handleDeleteSuggestionClick(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    const suggestion = event.currentTarget.value;

    onDeleteSuggestion(suggestion);
  }

  function handleClearSuggestionsClick() {
    onClearSuggestions();
  }

  const shouldShowSuggestions = isSuggestionOpen && recentSearches.length > 0;

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col gap-3 md:flex-row md:items-stretch"
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-[#2f8551]">
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
            <div className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-md border border-black bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between gap-3 border-b border-black bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-[#14532D]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-black">
                    Recent searches
                  </span>
                </div>

                <button
                  type="button"
                  onMouseDown={handleSuggestionMouseDown}
                  onClick={handleClearSuggestionsClick}
                  disabled={isClearingRecentSearches}
                  className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-black transition hover:text-[#14532D] disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {isClearingRecentSearches ? "Clearing..." : "Clear all"}
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-black">
                {recentSearches.map((savedSearch) => (
                  <div
                    key={savedSearch.id}
                    className="flex items-center gap-2 pr-2 transition hover:bg-[#A3E635]/20"
                  >
                    <button
                      type="button"
                      value={savedSearch.query}
                      onMouseDown={handleSuggestionMouseDown}
                      onClick={handleSuggestionClick}
                      className="flex min-w-0 flex-1 items-center px-4 py-3 text-left text-sm font-semibold text-black transition hover:text-[#15803D]"
                    >
                      <Search className="mr-3 h-4 w-4 shrink-0" />
                      <span className="truncate">{savedSearch.query}</span>
                    </button>

                    <button
                      type="button"
                      value={savedSearch.query}
                      onMouseDown={handleDeleteSuggestionMouseDown}
                      onClick={handleDeleteSuggestionClick}
                      disabled={isDeletingRecentSearch}
                      aria-label={`Delete ${savedSearch.query}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSearchClick}
        disabled={isLoadingResults}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto md:shrink-0"
      >
        {isLoadingResults ? "Searching..." : "Search"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
