import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";

import type {
  AppliedFilterSummaryProps,
  FilterActionsProps,
  FilterVisibilityToggleProps,
  SearchFilterGridProps,
  SearchFiltersHeaderProps,
  SearchFiltersPanelProps,
  SearchFilterWidgetKey,
} from "@/features/search/types";
import { normalizeSearchFilterWidgetKey } from "@/features/search/utils";
import {
  AuthorFilterWidget,
  AwardFilterWidget,
  CitationFilterWidget,
  CountryFilterWidget,
  InstitutionFilterWidget,
  OpenAccessFilterWidget,
  OrcidFilterWidget,
  PdfFilterWidget,
  SearchFilterAddMenu,
  SourceFilterWidget,
  SubFieldFilterWidget,
  TypeFilterWidget,
  YearFilterWidget,
} from "@/layout/components/Filters";

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
  visibleFilterWidgets,
  onApplyFilters,
  onFilterOptionSearch,
  onLoadMoreFilterOptions,
  onResetFilters,
  onToggleFilters,
  onToggleVisibleFilterWidget,
  updateFilter,
}: SearchFiltersPanelProps) {
  return (
    <div className="rounded-b-2xl border-t border-slate-400 bg-slate-50/80">
      <SearchFiltersHeader
        activeFilterCount={activeFilterCount}
        filtersOpen={filtersOpen}
        matchedPaperCount={matchedPaperCount}
        onToggleFilters={onToggleFilters}
      />

      {filtersOpen ? (
        <>
          <FilterVisibilityToggle
            visibleFilterWidgets={visibleFilterWidgets}
            onToggleVisibleFilterWidget={onToggleVisibleFilterWidget}
          />

          <SearchFilterGrid
            filterOptions={filterOptions}
            filters={filters}
            hasMoreFilterOptions={hasMoreFilterOptions}
            isLoadingFilterOptions={isLoadingFilterOptions}
            isLoadingMoreFilterOptions={isLoadingMoreFilterOptions}
            visibleFilterWidgets={visibleFilterWidgets}
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
      ) : null}
    </div>
  );
}

function SearchFiltersHeader({
  activeFilterCount,
  filtersOpen,
  onToggleFilters,
}: SearchFiltersHeaderProps) {
  const chevronClassName = filtersOpen ? "rotate-180" : "";
  const toggleLabel = filtersOpen ? "Collapse filters" : "Expand filters";
  const headerClassName = [
    "flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between",
    filtersOpen ? "border-b border-slate-400" : "rounded-b-2xl",
  ].join(" ");

  return (
    <div className={headerClassName}>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-black" />
        <span className="text-sm font-bold text-black">Advanced filters</span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#14532D] px-1.5 text-[10px] font-bold text-white">
          {activeFilterCount}
        </span>

        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-label={toggleLabel}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-400 bg-white text-black transition hover:border-[#15803D] hover:text-[#15803D]"
        >
          <ChevronDown className={`h-4 w-4 transition ${chevronClassName}`} />
        </button>
      </div>
    </div>
  );
}

function FilterVisibilityToggle({
  visibleFilterWidgets,
  onToggleVisibleFilterWidget,
}: FilterVisibilityToggleProps) {
  return (
    <div className="flex justify-end border-b border-slate-200 px-5 py-4">
      <SearchFilterAddMenu
        onToggleWidget={onToggleVisibleFilterWidget}
        visibleFilterWidgets={visibleFilterWidgets}
      />
    </div>
  );
}

function SearchFilterGrid({
  filterOptions,
  filters,
  hasMoreFilterOptions,
  isLoadingFilterOptions,
  isLoadingMoreFilterOptions,
  visibleFilterWidgets,
  onFilterOptionSearch,
  onLoadMoreFilterOptions,
  updateFilter,
}: SearchFilterGridProps) {
  const resultItems = visibleFilterWidgets.map((widgetKey) =>
    renderFilterWidget(widgetKey, {
      filterOptions,
      filters,
      hasMoreFilterOptions,
      isLoadingFilterOptions,
      isLoadingMoreFilterOptions,
      onFilterOptionSearch,
      onLoadMoreFilterOptions,
      updateFilter,
    }),
  );

  if (resultItems.length === 0) {
    return (
      <div className="px-5 py-8">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#14532D]">
            No Filter Widgets Yet
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Use `Add filter` to choose which filters should appear in this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 px-5 py-5 lg:grid-cols-2 2xl:grid-cols-3">
      {resultItems}
    </div>
  );
}

type RenderFilterWidgetParams = Omit<
  SearchFilterGridProps,
  "visibleFilterWidgets"
>;

function renderFilterWidget(
  widgetKey: SearchFilterWidgetKey,
  {
    filterOptions,
    filters,
    hasMoreFilterOptions,
    isLoadingFilterOptions,
    isLoadingMoreFilterOptions,
    onFilterOptionSearch,
    onLoadMoreFilterOptions,
    updateFilter,
  }: RenderFilterWidgetParams,
) {
  const normalizedWidgetKey = normalizeSearchFilterWidgetKey(widgetKey);

  switch (normalizedWidgetKey) {
    case "year":
      return (
        <YearFilterWidget
          key={widgetKey}
          filters={filters}
          updateFilter={updateFilter}
        />
      );
    case "type":
      return (
        <TypeFilterWidget
          key={widgetKey}
          filterKey="type"
          options={filterOptions.type}
          selected={filters.type}
          onChange={(nextSelected) => updateFilter("type", nextSelected)}
        />
      );
    case "openAccess":
      return (
        <OpenAccessFilterWidget
          key={widgetKey}
          checked={filters.openAccess}
          onChange={(checked) => updateFilter("openAccess", checked)}
        />
      );
    case "subField":
      return (
        <SubFieldFilterWidget
          key={widgetKey}
          filterKey="subField"
          options={filterOptions.subField}
          selected={filters.subField}
          onChange={(nextSelected) => updateFilter("subField", nextSelected)}
        />
      );
    case "author":
      return (
        <AuthorFilterWidget
          key={widgetKey}
          filterKey="author"
          hasMoreOptions={hasMoreFilterOptions.author}
          isLoadingOptions={isLoadingFilterOptions.author}
          isLoadingMoreOptions={isLoadingMoreFilterOptions.author}
          options={filterOptions.author}
          selected={filters.author}
          onChange={(nextSelected) => updateFilter("author", nextSelected)}
          onLoadMoreOptions={() => onLoadMoreFilterOptions("author")}
          onSearchKeywordChange={(keyword) => onFilterOptionSearch("author", keyword)}
        />
      );
    case "institution":
      return (
        <InstitutionFilterWidget
          key={widgetKey}
          filterKey="institution"
          hasMoreOptions={hasMoreFilterOptions.institution}
          isLoadingOptions={isLoadingFilterOptions.institution}
          isLoadingMoreOptions={isLoadingMoreFilterOptions.institution}
          options={filterOptions.institution}
          selected={filters.institution}
          onChange={(nextSelected) =>
            updateFilter("institution", nextSelected)
          }
          onLoadMoreOptions={() => onLoadMoreFilterOptions("institution")}
          onSearchKeywordChange={(keyword) =>
            onFilterOptionSearch("institution", keyword)
          }
        />
      );
    case "pdf":
      return (
        <PdfFilterWidget
          key={widgetKey}
          checked={filters.pdf}
          onChange={(checked) => updateFilter("pdf", checked)}
        />
      );
    case "country":
      return (
        <CountryFilterWidget
          key={widgetKey}
          filterKey="country"
          hasMoreOptions={hasMoreFilterOptions.country}
          isLoadingOptions={isLoadingFilterOptions.country}
          isLoadingMoreOptions={isLoadingMoreFilterOptions.country}
          options={filterOptions.country}
          selected={filters.country}
          onChange={(nextSelected) => updateFilter("country", nextSelected)}
          onLoadMoreOptions={() => onLoadMoreFilterOptions("country")}
          onSearchKeywordChange={(keyword) => onFilterOptionSearch("country", keyword)}
        />
      );
    case "citation":
      return (
        <CitationFilterWidget
          key={widgetKey}
          filters={filters}
          updateFilter={updateFilter}
        />
      );
    case "source":
      return (
        <SourceFilterWidget
          key={widgetKey}
          filterKey="source"
          hasMoreOptions={hasMoreFilterOptions.source}
          isLoadingOptions={isLoadingFilterOptions.source}
          isLoadingMoreOptions={isLoadingMoreFilterOptions.source}
          options={filterOptions.source}
          selected={filters.source}
          onChange={(nextSelected) => updateFilter("source", nextSelected)}
          onLoadMoreOptions={() => onLoadMoreFilterOptions("source")}
          onSearchKeywordChange={(keyword) => onFilterOptionSearch("source", keyword)}
        />
      );
    case "award":
      return (
        <AwardFilterWidget
          key={widgetKey}
          filterKey="award"
          hasMoreOptions={hasMoreFilterOptions.award}
          isLoadingOptions={isLoadingFilterOptions.award}
          isLoadingMoreOptions={isLoadingMoreFilterOptions.award}
          options={filterOptions.award}
          selected={filters.award}
          onChange={(nextSelected) => updateFilter("award", nextSelected)}
          onLoadMoreOptions={() => onLoadMoreFilterOptions("award")}
          onSearchKeywordChange={(keyword) => onFilterOptionSearch("award", keyword)}
        />
      );
    case "indexedByOrcid":
      return (
        <OrcidFilterWidget
          key={widgetKey}
          value={filters.indexedByOrcid}
          updateFilter={updateFilter}
        />
      );
    default:
      return null;
  }
}

function AppliedFilterSummary({ summary }: AppliedFilterSummaryProps) {
  if (summary.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-400 px-5 py-4">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-black">
        Applied filters
      </p>

      <div className="flex flex-wrap gap-2">
        {summary.map((item) => (
          <span
            key={item}
            className="rounded-full bg-[#A3E635]/20 px-3 py-1 text-xs font-bold text-[#14532D] ring-1 ring-[#059669]"
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
  const selectedFilterLabel =
    activeFilterCount === 1 ? "selected filter" : "selected filters";

  return (
    <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onApplyFilters}
          disabled={hasFormError || isLoadingResults}
          className="inline-flex items-center gap-2 rounded-lg bg-[#14532D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Filter className="h-4 w-4" />
          {isLoadingResults ? "Applying..." : "Apply filters"}
        </button>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-sm font-bold text-black transition hover:text-black"
        >
          Reset all
        </button>
      </div>

      <p className="text-xs font-bold text-black">
        {activeFilterCount} {selectedFilterLabel}
      </p>
    </div>
  );
}
