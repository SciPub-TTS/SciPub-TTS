import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";

import type {
  AppliedFilterSummaryProps,
  FilterActionsProps,
  FilterVisibilityToggleProps,
  SearchFilterGridProps,
  SearchFiltersHeaderProps,
  SearchFiltersPanelProps,
} from "@/features/search/types";
import { formatFullNumber } from "@/features/search/utils";

import {
  CheckboxFilter,
  CitationFilter,
  MultiSelectFilter,
  OrcidFilter,
  YearFilter,
} from "./FilterControls";

export function SearchFiltersPanel({
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
  showAllFilters,
  onApplyFilters,
  onFilterOptionSearch,
  onLoadMoreFilterOptions,
  onResetFilters,
  onToggleFilters,
  onToggleMoreFilters,
  updateFilter,
}: SearchFiltersPanelProps) {
  // The filter panel is split into header, grid, summary, and actions.
  return (
    <div className="border-t border-slate-200 bg-slate-50/80">
      <SearchFiltersHeader
        activeFilterCount={activeFilterCount}
        filtersOpen={filtersOpen}
        matchedPaperCount={matchedPaperCount}
        onToggleFilters={onToggleFilters}
      />

      {filtersOpen && (
        <>
          <FilterVisibilityToggle
            showAllFilters={showAllFilters}
            onToggleMoreFilters={onToggleMoreFilters}
          />

          <SearchFilterGrid
            filterOptions={filterOptions}
            filters={filters}
            hasMoreFilterOptions={hasMoreFilterOptions}
            isLoadingFilterOptions={isLoadingFilterOptions}
            isLoadingMoreFilterOptions={isLoadingMoreFilterOptions}
            showAllFilters={showAllFilters}
            onFilterOptionSearch={onFilterOptionSearch}
            onLoadMoreFilterOptions={onLoadMoreFilterOptions}
            updateFilter={updateFilter}
          />

          <AppliedFilterSummary summary={appliedFilterSummary} />

          <FilterActions
            activeFilterCount={activeFilterCount}
            hasFormError={hasFormError}
            isLoadingResults={isLoadingResults}
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
          />
        </>
      )}
    </div>
  );
}

function SearchFiltersHeader({
  activeFilterCount,
  filtersOpen,
  matchedPaperCount,
  onToggleFilters,
}: SearchFiltersHeaderProps) {
  // These class names are separated so the open/closed state is readable.
  const expandedChevronClassName = "rotate-180";
  const collapsedChevronClassName = "";
  const chevronClassName = filtersOpen
    ? expandedChevronClassName
    : collapsedChevronClassName;
  const toggleLabel = filtersOpen ? "Collapse filters" : "Expand filters";

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-slate-700" />
        <span className="text-sm font-bold text-slate-800">
          Advanced filters
        </span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-900 px-1.5 text-[10px] font-bold text-white">
          {activeFilterCount}
        </span>

        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-label={toggleLabel}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-emerald-700 hover:text-emerald-900"
        >
          <ChevronDown className={`h-4 w-4 transition ${chevronClassName}`} />
        </button>
      </div>

      <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-slate-600">
        Match:{" "}
        <span className="text-slate-900">
          {formatFullNumber(matchedPaperCount)} papers
        </span>
      </p>
    </div>
  );
}

function FilterVisibilityToggle({
  showAllFilters,
  onToggleMoreFilters,
}: FilterVisibilityToggleProps) {
  const visibleFilterCount = showAllFilters ? 12 : 8;
  const toggleButtonLabel = showAllFilters ? "Show less" : "Show more";

  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <p className="text-xs font-bold text-slate-700">
        Showing {visibleFilterCount} of 12 filters
      </p>
      <button
        type="button"
        onClick={onToggleMoreFilters}
        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 transition hover:border-emerald-700 hover:bg-emerald-50"
      >
        {toggleButtonLabel}
      </button>
    </div>
  );
}

function SearchFilterGrid({
  filterOptions,
  filters,
  hasMoreFilterOptions,
  isLoadingFilterOptions,
  isLoadingMoreFilterOptions,
  showAllFilters,
  onFilterOptionSearch,
  onLoadMoreFilterOptions,
  updateFilter,
}: SearchFilterGridProps) {
  // Each handler updates one specific field in SearchFilters.
  function handleTypeChange(nextSelected: string[]) {
    updateFilter("type", nextSelected);
  }

  function handleOpenAccessChange(checked: boolean) {
    updateFilter("openAccess", checked);
  }

  function handleSubFieldChange(nextSelected: string[]) {
    updateFilter("subField", nextSelected);
  }

  function handleAuthorChange(nextSelected: string[]) {
    updateFilter("author", nextSelected);
  }

  function handleInstitutionChange(nextSelected: string[]) {
    updateFilter("institution", nextSelected);
  }

  function handlePdfChange(checked: boolean) {
    updateFilter("pdf", checked);
  }

  function handleCountryChange(nextSelected: string[]) {
    updateFilter("country", nextSelected);
  }

  function handleSourceChange(nextSelected: string[]) {
    updateFilter("source", nextSelected);
  }

  function handleAwardChange(nextSelected: string[]) {
    updateFilter("award", nextSelected);
  }

  return (
    <div className="grid gap-5 px-5 py-5 lg:grid-cols-4">
      <YearFilter filters={filters} updateFilter={updateFilter} />

      <MultiSelectFilter
        filterKey="type"
        label="Type"
        options={filterOptions.type}
        selected={filters.type}
        onChange={handleTypeChange}
      />

      <CheckboxFilter
        label="Open Access"
        checked={filters.openAccess}
        onChange={handleOpenAccessChange}
      />

      <MultiSelectFilter
        filterKey="subField"
        label="SubField"
        options={filterOptions.subField}
        selected={filters.subField}
        onChange={handleSubFieldChange}
      />

      <MultiSelectFilter
        filterKey="author"
        label="Author"
        hasMoreOptions={hasMoreFilterOptions.author}
        isLoadingOptions={isLoadingFilterOptions.author}
        isLoadingMoreOptions={isLoadingMoreFilterOptions.author}
        options={filterOptions.author}
        selected={filters.author}
        onChange={handleAuthorChange}
        onLoadMoreOptions={() => onLoadMoreFilterOptions("author")}
        onSearchKeywordChange={(keyword) =>
          onFilterOptionSearch("author", keyword)
        }
      />

      <MultiSelectFilter
        filterKey="institution"
        label="Institution"
        hasMoreOptions={hasMoreFilterOptions.institution}
        isLoadingOptions={isLoadingFilterOptions.institution}
        isLoadingMoreOptions={isLoadingMoreFilterOptions.institution}
        options={filterOptions.institution}
        selected={filters.institution}
        onChange={handleInstitutionChange}
        onLoadMoreOptions={() => onLoadMoreFilterOptions("institution")}
        onSearchKeywordChange={(keyword) =>
          onFilterOptionSearch("institution", keyword)
        }
      />

      <CheckboxFilter
        label="PDF"
        checked={filters.pdf}
        onChange={handlePdfChange}
      />

      <MultiSelectFilter
        filterKey="country"
        label="Country"
        options={filterOptions.country}
        selected={filters.country}
        onChange={handleCountryChange}
      />

      {showAllFilters && (
        <>
          <CitationFilter filters={filters} updateFilter={updateFilter} />

          <MultiSelectFilter
            filterKey="source"
            label="Source"
            hasMoreOptions={hasMoreFilterOptions.source}
            isLoadingOptions={isLoadingFilterOptions.source}
            isLoadingMoreOptions={isLoadingMoreFilterOptions.source}
            options={filterOptions.source}
            selected={filters.source}
            onChange={handleSourceChange}
            onLoadMoreOptions={() => onLoadMoreFilterOptions("source")}
            onSearchKeywordChange={(keyword) =>
              onFilterOptionSearch("source", keyword)
            }
          />

          <MultiSelectFilter
            filterKey="award"
            label="Award"
            hasMoreOptions={hasMoreFilterOptions.award}
            isLoadingOptions={isLoadingFilterOptions.award}
            isLoadingMoreOptions={isLoadingMoreFilterOptions.award}
            options={filterOptions.award}
            selected={filters.award}
            onChange={handleAwardChange}
            onLoadMoreOptions={() => onLoadMoreFilterOptions("award")}
            onSearchKeywordChange={(keyword) =>
              onFilterOptionSearch("award", keyword)
            }
          />

          <OrcidFilter
            value={filters.indexedByOrcid}
            updateFilter={updateFilter}
          />
        </>
      )}
    </div>
  );
}

function AppliedFilterSummary({ summary }: AppliedFilterSummaryProps) {
  const hasAppliedFilters = summary.length > 0;

  // Returning null means React renders nothing for this component.
  if (!hasAppliedFilters) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 px-5 py-4">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-slate-600">
        Applied filters
      </p>

      <div className="flex flex-wrap gap-2">
        {summary.map((item) => (
          <span
            key={item}
            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-950 ring-1 ring-emerald-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FilterActions({
  activeFilterCount,
  hasFormError,
  isLoadingResults,
  onApplyFilters,
  onResetFilters,
}: FilterActionsProps) {
  // Build the label before JSX to avoid inline plural logic.
  const selectedFilterLabel =
    activeFilterCount === 1 ? "selected filter" : "selected filters";

  return (
    <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onApplyFilters}
          disabled={hasFormError || isLoadingResults}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Filter className="h-4 w-4" />
          {isLoadingResults ? "Applying..." : "Apply filters"}
        </button>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-sm font-bold text-slate-700 transition hover:text-slate-950"
        >
          Reset all
        </button>
      </div>

      <p className="text-xs font-bold text-slate-700">
        {activeFilterCount} {selectedFilterLabel}
      </p>
    </div>
  );
}

/*
SEARCH_FILE_NOTE
Syntax su dung:
- Component composition + typed props.
File nay lam gi:
- Render 12 filter + actions Apply/Reset + summary filter.
Flow chay:
- Nhan state/handlers tu hook -> doi filter -> callback update state.
*/

