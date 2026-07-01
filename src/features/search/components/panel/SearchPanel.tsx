import { ArrowRight, History, Save, Search, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import {
  getSearchEntityMetadata,
  searchTabs,
} from "@/features/search/services";
import type {
  SearchInputRowProps,
  SearchPanelProps,
} from "@/features/search/types";
import { formatFullNumber } from "@/features/search/utils";
import { SafeActionDialog } from "@/layout/global/SafeActionDialog";

import { SearchFiltersPanel } from "./SearchFiltersPanel";

export function SearchPanel({
  activeEntityType,
  activeFilterCount,
  appliedFilterSummary,
  canSaveSearch,
  filterOptions,
  filters,
  filtersOpen,
  hasLoadedTrendSnapshot,
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
  topicHotSearches,
  searchPlaceholder,
  searchQuery,
  showFilters,
  showFilterAddMenu,
  totalIndexedCount,
  isIndexedCountExact,
  visibleFilterWidgets,
  onApplyFilters,
  onClearRecentSearches,
  onDeleteRecentSearch,
  onEntityTypeChange,
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
  // Khối này quản lý phần tương tác đầu vào của search:
  // tabs entity, ô search, lịch sử tìm kiếm và panel filter.
  return (
    <div className="overflow-visible rounded-2xl border border-black bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <SearchTabsHeader
        activeEntityType={activeEntityType}
        canSaveSearch={canSaveSearch}
        isSavingSearch={isSavingSearch}
        saveSearchFeedback={saveSearchFeedback}
        saveSearchNotice={saveSearchNotice}
        totalIndexedCount={totalIndexedCount}
        isIndexedCountExact={isIndexedCountExact}
        onEntityTypeChange={onEntityTypeChange}
        onSaveSearch={onSaveSearch}
      />

      <div className="p-5">
        <div className="rounded-2xl border border-black bg-slate-50/60 px-3 py-4 shadow-inner">
          <SearchInputRow
            activeEntityType={activeEntityType}
            isLoadingResults={isLoadingResults}
            recentSearches={recentSearches}
            saveSearchSuccessToken={saveSearchSuccessToken}
            searchPlaceholder={searchPlaceholder}
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

        {activeEntityType === "topics" && hasLoadedTrendSnapshot ? (
          <div className="mt-4 rounded-xl border border-black bg-[#FFF7ED] px-4 py-3">
            {topicHotSearches.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#C2410C]">
                  Try:
                </span>
                {topicHotSearches.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => onSuggestedSearchSelect(topic)}
                    className="rounded-full border border-[#F97316]/40 bg-white px-3 py-1.5 text-sm font-semibold text-[#C2410C] transition hover:-translate-y-0.5 hover:border-[#EA580C] hover:bg-[#FED7AA]"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-[#C2410C]">
                No trending topics this week.
              </p>
            )}
          </div>
        ) : null}
      </div>

      {showFilters ? (
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
          showFilterAddMenu={showFilterAddMenu}
          visibleFilterWidgets={visibleFilterWidgets}
          onApplyFilters={onApplyFilters}
          onFilterOptionSearch={onFilterOptionSearch}
          onLoadMoreFilterOptions={onLoadMoreFilterOptions}
          onResetFilters={onResetFilters}
          onToggleFilters={onToggleFilters}
          onToggleVisibleFilterWidget={onToggleVisibleFilterWidget}
          updateFilter={updateFilter}
        />
      ) : null}
    </div>
  );
}

type SearchTabsHeaderProps = {
  activeEntityType: SearchPanelProps["activeEntityType"];
  canSaveSearch: boolean;
  isSavingSearch: boolean;
  saveSearchFeedback: SearchPanelProps["saveSearchFeedback"];
  saveSearchNotice: string | null;
  totalIndexedCount: number;
  isIndexedCountExact: boolean;
  onEntityTypeChange: (entityType: SearchPanelProps["activeEntityType"]) => void;
  onSaveSearch: () => void;
};

function SearchTabsHeader(props: SearchTabsHeaderProps) {
  const {
    activeEntityType,
    canSaveSearch,
    isSavingSearch,
    saveSearchFeedback,
    saveSearchNotice,
    totalIndexedCount,
    isIndexedCountExact,
    onEntityTypeChange,
    onSaveSearch,
  } = props;
  const activeEntityMetadata = getSearchEntityMetadata(activeEntityType);
  const indexedLabel =
    !isIndexedCountExact
      ? `Scoped ${activeEntityMetadata.resultLabelPlural}`
      : totalIndexedCount > 0
      ? `${formatFullNumber(totalIndexedCount)} ${activeEntityMetadata.indexedLabel}`
      : `Loading ${activeEntityMetadata.resultLabelPlural}...`;

  return (
    <div className="rounded-t-2xl border-b border-black px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3.5">
          {searchTabs.map((tab) => {
            const isActive = tab.entityType === activeEntityType;

            return (
              <button
                key={tab.entityType}
                type="button"
                onClick={() => onEntityTypeChange(tab.entityType)}
                className={[
                  "rounded-md border border-black px-5 py-2.5 text-sm font-bold shadow-sm transition",
                  isActive
                    ? "bg-[#14532D] text-white"
                    : "bg-slate-200 text-black hover:bg-slate-300",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-2 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-black">
              {indexedLabel}
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
  activeEntityType,
  isLoadingResults,
  recentSearches,
  saveSearchSuccessToken,
  searchPlaceholder,
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
  const [isClearHistoryDialogOpen, setIsClearHistoryDialogOpen] = useState(false);
  const [dismissedSaveToken, setDismissedSaveToken] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchAriaLabel = getSearchEntityMetadata(activeEntityType).searchAriaLabel;

  useEffect(() => {
    // Đóng popup gợi ý khi user click ra ngoài vùng search box.
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
      setDismissedSaveToken(saveSearchSuccessToken);
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [isSuggestionOpen, saveSearchSuccessToken]);

  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextSearchQuery = event.target.value;

    onSearchQueryChange(nextSearchQuery);
    setIsSuggestionOpen(true);
  }

  function handleSearchInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      setIsSuggestionOpen(false);
      onSearch();
    }
  }

  function handleInputFocus() {
    setIsSuggestionOpen(true);
  }

  function handleSearchClick() {
    setIsSuggestionOpen(false);
    setDismissedSaveToken(saveSearchSuccessToken);
    onSearch();
  }

  function handleSuggestionClick(event: MouseEvent<HTMLButtonElement>) {
    const suggestion = event.currentTarget.value;

    setIsSuggestionOpen(false);
    setDismissedSaveToken(saveSearchSuccessToken);
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
    setDismissedSaveToken(saveSearchSuccessToken);
    setIsClearHistoryDialogOpen(true);
  }

  function handleConfirmClearSuggestions() {
    setIsClearHistoryDialogOpen(false);
    onClearSuggestions();
  }

  const shouldShowSuggestions =
    recentSearches.length > 0
    && (isSuggestionOpen || saveSearchSuccessToken > dismissedSaveToken);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col gap-3"
    >
      <SafeActionDialog
        open={isClearHistoryDialogOpen}
        onClose={() => {
          if (!isClearingRecentSearches) {
            setIsClearHistoryDialogOpen(false);
          }
        }}
        onConfirm={handleConfirmClearSuggestions}
        title="Clear all recent searches?"
        confirmLabel="Clear all"
        pendingLabel="Clearing..."
        isPending={isClearingRecentSearches}
        variant="danger"
      />

      <div className="flex w-full flex-col gap-3 md:flex-row md:items-stretch">
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
              aria-label={searchAriaLabel}
              className="min-w-0 w-full bg-transparent text-base font-medium text-black outline-none placeholder:text-black disabled:cursor-not-allowed disabled:opacity-60"
              placeholder={searchPlaceholder}
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
          Search
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
