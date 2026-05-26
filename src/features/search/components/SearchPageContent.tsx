import {
  ArrowRight,
  Bookmark,
  BookmarkPlus,
  Check,
  ChevronDown,
  ExternalLink,
  Filter,
  Eye,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router";
import {
  currentYear,
  minimumYear,
  multiFilterOptions,
  resultSortOptions,
  searchTabs,
  suggestedSearches,
} from "../constants";
import { useSearchPageState } from "../hooks";
import { searchSummaryStats } from "../services";
import type { PaperResult } from "../types";
import {
  formatCompactNumber,
  formatFullNumber,
  formatLatestUpdate,
  formatResponseTime,
  hasInvalidCitationRange,
  hasInvalidYearRange,
} from "../utils";

type PaperResultCardProps = {
  paper: PaperResult;
};

function PaperResultCard({ paper }: PaperResultCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-900 ring-1 ring-emerald-100">
            {paper.field}
          </span>
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase",
              paper.isTrendTopic
                ? "bg-emerald-950 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100",
            ].join(" ")}
          >
            {paper.topic}
            <button
              type="button"
              aria-label={`Follow ${paper.topic}`}
              className={[
                "inline-flex h-4 w-4 items-center justify-center rounded-full",
                paper.isTrendTopic
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-emerald-100 text-emerald-950 hover:bg-emerald-200",
              ].join(" ")}
            >
              <Plus className="h-3 w-3" />
            </button>
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-900 ring-1 ring-emerald-100">
            {paper.subField}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-900 ring-1 ring-emerald-100">
            {paper.growthPercent}% growth
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-extrabold tracking-[0.24em] text-slate-400">
          {paper.year}
        </span>
      </div>

      <h3 className="text-xl font-semibold leading-snug text-slate-950">
        {paper.title}
      </h3>
      <p className="mt-2 text-sm font-semibold text-slate-700">
        {paper.authors}
        <span className="mx-2 text-slate-400">-</span>
        <span className="text-blue-700">{paper.venue}</span>
        <span className="mx-2 text-slate-400">-</span>
        {formatFullNumber(paper.citations)} citations
      </p>
      <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
        {paper.abstract}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`https://${paper.doi}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className="truncate">{paper.doi}</span>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={[
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition",
              paper.saved
                ? "bg-emerald-950 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            <Bookmark className="h-4 w-4" />
            {paper.saved ? "Saved" : "Bookmark"}
          </button>
          <Link
            to={routePaths.paperDetail(paper.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
          <button
            type="button"
            aria-label="Share paper"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

type MultiSelectFilterProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
};

function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
}: MultiSelectFilterProps) {
  const [optionKeyword, setOptionKeyword] = useState("");
  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(optionKeyword.trim().toLowerCase()),
  );

  function toggleOption(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  }

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-600">
        {label}
      </span>
      <details className="group relative">
        <summary className="flex h-10 cursor-pointer list-none items-center justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition hover:border-emerald-700">
          <span className="truncate">
            {selected.length > 0 ? `${selected.length} selected` : "Any"}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-600 transition group-open:rotate-180" />
        </summary>

        <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-max min-w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="sticky top-0 z-10 bg-white pb-2">
            <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-300 px-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="search"
                value={optionKeyword}
                onChange={(event) => setOptionKeyword(event.target.value)}
                placeholder={`Search ${label.toLowerCase()}`}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {visibleOptions.length > 0 ? (
            visibleOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="h-4 w-4 rounded border-slate-300 accent-emerald-900"
                />
                <span>{option}</span>
              </label>
            ))
          ) : (
            <p className="px-2 py-3 text-sm font-semibold text-slate-500">
              No options match "{optionKeyword}"
            </p>
          )}
        </div>
      </details>
    </div>
  );
}

type CheckboxFilterProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function CheckboxFilter({ label, checked, onChange }: CheckboxFilterProps) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-600">
        {label}
      </span>
      <span className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 accent-emerald-900"
        />
        {checked ? "True" : "False"}
      </span>
    </label>
  );
}

export default function SearchPage() {
  const {
    activeFilterCount,
    appliedFilterSummary,
    appliedSearchQuery,
    canLoadMoreResults,
    filteredPaperResults,
    filters,
    filtersOpen,
    handleApplyFilters,
    handleSaveSearch,
    handleSearch,
    handleSelectSavedSearch,
    hasFormError,
    isSearchFocused,
    matchedSavedSearchCount,
    resetFilters,
    searchQuery,
    selectedSort,
    setAppliedSearchQuery,
    setFiltersOpen,
    setIsSearchFocused,
    setSearchQuery,
    setSelectedSort,
    setShowAllFilters,
    setShowAllSearchSuggestions,
    setVisibleResultCount,
    showAllFilters,
    showAllSearchSuggestions,
    updateFilter,
    visiblePaperResults,
    visibleSearchSuggestions,
  } = useSearchPageState();

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-emerald-950">
            Explore - Search + Trend Analysis
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
            Search papers. See the field move.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-700">
            Every search returns matching papers and a live trend snapshot of
            the topic - growth, related sub-fields, and venues. Not a search
            engine, an analyst.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSearch}
          disabled={!searchQuery.trim()}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          <BookmarkPlus className="h-4 w-4" />
          Save this search
        </button>
      </div>

      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="rounded-t-2xl border-b border-slate-200 px-5 py-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 py-3">
            {searchTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className="rounded-md bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition"
              >
                {tab}
              </button>
            ))}
          </div>

          <p className="pb-4 text-[11px] font-extrabold uppercase tracking-[0.32em] text-slate-600 sm:pb-0">
            {formatCompactNumber(searchSummaryStats.totalIndexedPapers)} papers
            indexed
          </p>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 shadow-inner">
            <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 focus-within:ring-emerald-700 md:flex-row md:items-center">
              <div className="relative flex min-w-0 flex-1 items-center gap-3">
                <Search className="h-5 w-5 shrink-0 text-emerald-900" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setShowAllSearchSuggestions(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  aria-label="Search papers"
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-800 outline-none placeholder:text-slate-500"
                  placeholder="Search by title, abstract & full text"
                />

                {isSearchFocused && (
                  <div className="absolute left-0 right-0 top-10 z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-600">
                        Hot search
                      </p>
                      <span className="text-xs font-bold text-slate-500">
                        {matchedSavedSearchCount} saved
                      </span>
                    </div>

                    {visibleSearchSuggestions.length > 0 ? (
                      <div className="max-h-72 overflow-y-auto">
                        {visibleSearchSuggestions.map((savedSearch) => (
                          <button
                            key={savedSearch.id}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() =>
                              handleSelectSavedSearch(savedSearch.query)
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-950"
                          >
                            <Search className="h-4 w-4 shrink-0 text-slate-500" />
                            <span className="min-w-0 flex-1 truncate">
                              {savedSearch.query}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-3 py-4 text-sm font-semibold text-slate-500">
                        No saved searches match "{searchQuery}".
                      </p>
                    )}

                    {matchedSavedSearchCount > 5 && (
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                          setShowAllSearchSuggestions((isShown) => !isShown)
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
                      >
                        {showAllSearchSuggestions
                          ? "Show less"
                          : "Show more"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-slate-600">
                Try:
              </span>
              {suggestedSearches.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setAppliedSearchQuery(suggestion);
                    setVisibleResultCount(3);
                    setIsSearchFocused(true);
                    setShowAllSearchSuggestions(false);
                  }}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:text-emerald-900 hover:ring-emerald-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/80">
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
                onClick={() => setFiltersOpen((isOpen) => !isOpen)}
                aria-expanded={filtersOpen}
                aria-label={filtersOpen ? "Collapse filters" : "Expand filters"}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-emerald-700 hover:text-emerald-900"
              >
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-slate-600">
              Match:{" "}
              <span className="text-slate-900">
                {formatFullNumber(searchSummaryStats.matchedPapers)} papers
              </span>{" "}
              - Latest:{" "}
              <span className="text-slate-900">
                {formatLatestUpdate(searchSummaryStats.latestUpdatedMinutesAgo)}
              </span>
            </p>
          </div>

          {filtersOpen && (
            <>
          <div className="flex items-center justify-between px-5 pt-5">
              <p className="text-xs font-bold text-slate-700">
                Showing {showAllFilters ? 12 : 8} of 12 filters
              </p>
              <button
                type="button"
                onClick={() => setShowAllFilters((isShown) => !isShown)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 transition hover:border-emerald-700 hover:bg-emerald-50"
              >
                {showAllFilters ? "Show less" : "Show more"}
              </button>
            </div>

            <div className="grid gap-5 px-5 py-5 lg:grid-cols-4">
            <label className="space-y-2">
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-600">
                Year
              </span>
              <div className="rounded-lg border border-slate-300 bg-white p-2">
                <div className="mb-2 grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1">
                  {(["range", "exact"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => updateFilter("yearMode", mode)}
                      className={[
                        "rounded px-2 py-1.5 text-xs font-bold capitalize transition",
                        filters.yearMode === mode
                          ? "bg-white text-emerald-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-950",
                      ].join(" ")}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {filters.yearMode === "range" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={minimumYear}
                      max={currentYear}
                      value={filters.yearFrom}
                      onChange={(event) =>
                        updateFilter("yearFrom", event.target.value)
                      }
                      placeholder="From"
                      aria-label="Year from"
                      className={[
                        "h-9 rounded-md border bg-white px-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-800",
                        hasInvalidYearRange(filters)
                          ? "border-red-400"
                          : "border-slate-300",
                      ].join(" ")}
                    />
                    <input
                      type="number"
                      min={minimumYear}
                      max={currentYear}
                      value={filters.yearTo}
                      onChange={(event) =>
                        updateFilter("yearTo", event.target.value)
                      }
                      placeholder="To"
                      aria-label="Year to"
                      className={[
                        "h-9 rounded-md border bg-white px-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-800",
                        hasInvalidYearRange(filters)
                          ? "border-red-400"
                          : "border-slate-300",
                      ].join(" ")}
                    />
                  </div>
                ) : (
                  <input
                    type="number"
                    min={minimumYear}
                    max={currentYear}
                    value={filters.yearExact}
                    onChange={(event) =>
                      updateFilter("yearExact", event.target.value)
                    }
                    placeholder="Exact year"
                    aria-label="Exact publication year"
                    className={[
                      "h-9 w-full rounded-md border bg-white px-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-800",
                      hasInvalidYearRange(filters)
                        ? "border-red-400"
                        : "border-slate-300",
                    ].join(" ")}
                  />
                )}
              </div>
              {hasInvalidYearRange(filters) && (
                <p className="text-xs font-semibold text-red-600">
                  Year must be {minimumYear}-{currentYear}
                  {filters.yearMode === "range" ? " and From cannot be greater than To." : "."}
                </p>
              )}
            </label>

            <MultiSelectFilter
              label="Type"
              options={multiFilterOptions.type}
              selected={filters.type}
              onChange={(nextSelected) => updateFilter("type", nextSelected)}
            />

            <CheckboxFilter
              label="Open Access"
              checked={filters.openAccess}
              onChange={(checked) => updateFilter("openAccess", checked)}
            />

            <MultiSelectFilter
              label="SubField"
              options={multiFilterOptions.subField}
              selected={filters.subField}
              onChange={(nextSelected) => updateFilter("subField", nextSelected)}
            />

            <MultiSelectFilter
              label="Author"
              options={multiFilterOptions.author}
              selected={filters.author}
              onChange={(nextSelected) => updateFilter("author", nextSelected)}
            />

            <MultiSelectFilter
              label="Institution"
              options={multiFilterOptions.institution}
              selected={filters.institution}
              onChange={(nextSelected) =>
                updateFilter("institution", nextSelected)
              }
            />

            <CheckboxFilter
              label="PDF"
              checked={filters.pdf}
              onChange={(checked) => updateFilter("pdf", checked)}
            />

            <MultiSelectFilter
              label="Country"
              options={multiFilterOptions.country}
              selected={filters.country}
              onChange={(nextSelected) => updateFilter("country", nextSelected)}
            />

            {showAllFilters && (
              <>
                <div className="space-y-2">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-600">
                    Citation Count
                  </span>
                  <div className="rounded-lg border border-slate-300 bg-white p-2">
                    <div className="mb-2 grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1">
                      {(["range", "exact"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => updateFilter("citationMode", mode)}
                          className={[
                            "rounded px-2 py-1.5 text-xs font-bold capitalize transition",
                            filters.citationMode === mode
                              ? "bg-white text-emerald-900 shadow-sm"
                              : "text-slate-600 hover:text-slate-950",
                          ].join(" ")}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    {filters.citationMode === "range" ? (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            min="0"
                            value={filters.citationMin}
                            onChange={(event) =>
                              updateFilter("citationMin", event.target.value)
                            }
                            placeholder="Min"
                            aria-label="Minimum citation count"
                            className={[
                              "h-9 rounded-md border px-2 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-800",
                              hasInvalidCitationRange(filters)
                                ? "border-red-400"
                                : "border-slate-300",
                            ].join(" ")}
                          />
                          <input
                            type="number"
                            min="0"
                            value={filters.citationMax}
                            onChange={(event) =>
                              updateFilter("citationMax", event.target.value)
                            }
                            placeholder="Max"
                            aria-label="Maximum citation count"
                            className={[
                              "h-9 rounded-md border px-2 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-800",
                              hasInvalidCitationRange(filters)
                                ? "border-red-400"
                                : "border-slate-300",
                            ].join(" ")}
                          />
                        </div>
                        {hasInvalidCitationRange(filters) && (
                          <p className="mt-2 text-xs font-semibold text-red-600">
                            Min citations cannot be greater than max citations.
                          </p>
                        )}
                      </>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        value={filters.citationExact}
                        onChange={(event) =>
                          updateFilter("citationExact", event.target.value)
                        }
                        placeholder="Exact count"
                        aria-label="Exact citation count"
                        className="h-9 w-full rounded-md border border-slate-300 px-2 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-800"
                      />
                    )}
                  </div>
                </div>

                <MultiSelectFilter
                  label="Source"
                  options={multiFilterOptions.source}
                  selected={filters.source}
                  onChange={(nextSelected) =>
                    updateFilter("source", nextSelected)
                  }
                />

                <MultiSelectFilter
                  label="Award"
                  options={multiFilterOptions.award}
                  selected={filters.award}
                  onChange={(nextSelected) =>
                    updateFilter("award", nextSelected)
                  }
                />

                <div className="space-y-2">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-slate-600">
                    Indexed by ORCID
                  </span>
                  <div className="flex h-10 items-center overflow-visible rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800">
                    <div className="flex h-full items-center gap-2 border-r border-slate-200 px-3">
                      <Tag className="h-4 w-4 text-slate-600" />
                      Work
                    </div>
                    <details className="group relative h-full">
                      <summary className="flex h-full min-w-20 cursor-pointer list-none items-center justify-center gap-1 bg-slate-100 px-3 text-slate-900 shadow-sm">
                        {filters.indexedByOrcid || "is"}
                        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                      </summary>
                      <div className="absolute left-0 z-30 mt-1 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                        {(["is", "is not"] as const).map((condition) => (
                          <button
                            key={condition}
                            type="button"
                            onClick={() =>
                              updateFilter("indexedByOrcid", condition)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
                          >
                            <span className="h-4 w-4">
                              {filters.indexedByOrcid === condition && (
                                <Check className="h-4 w-4" />
                              )}
                            </span>
                            {condition}
                          </button>
                        ))}
                      </div>
                    </details>
                    <div className="flex-1 px-3">Has an ORCID</div>
                  </div>
                </div>
              </>
            )}
            </div>

            {appliedFilterSummary.length > 0 && (
              <div className="border-t border-slate-200 px-5 py-4">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-slate-600">
                  Applied filters
                </p>
                <div className="flex flex-wrap gap-2">
                  {appliedFilterSummary.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-950 ring-1 ring-emerald-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  disabled={hasFormError}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <Filter className="h-4 w-4" />
                  Apply filters
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-bold text-slate-700 transition hover:text-slate-950"
                >
                  Reset all
                </button>
              </div>

              <p className="text-xs font-bold text-slate-700">
                {activeFilterCount} selected filter
                {activeFilterCount === 1 ? "" : "s"}
              </p>
            </div>
            </>
          )}
        </div>
      </div>

      <section>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                Results for{" "}
                <span className="italic text-emerald-950">
                  "{appliedSearchQuery || "all papers"}"
                </span>
              </h2>
              <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">
                {formatFullNumber(searchSummaryStats.resultCount)} papers -
                {formatResponseTime(searchSummaryStats.responseTimeSeconds)} -
                matched title, abstract, full text
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
                Sort:
              </span>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                {resultSortOptions.map((sortOption) => (
                  <button
                    key={sortOption}
                    type="button"
                    onClick={() => setSelectedSort(sortOption)}
                    className={[
                      "px-4 py-2 text-xs font-bold transition",
                      selectedSort === sortOption
                        ? "bg-emerald-950 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                    ].join(" ")}
                  >
                    {sortOption}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {visiblePaperResults.length > 0 ? (
              visiblePaperResults.map((paper) => (
                <PaperResultCard key={paper.id} paper={paper} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-lg font-bold text-slate-900">
                  No mock papers matched this search.
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Try keywords like "diffusion", "ORCID", "attention", or
                  "OpenAlex".
                </p>
              </div>
            )}
          </div>

          {canLoadMoreResults && (
            <button
              type="button"
              onClick={() =>
                setVisibleResultCount((currentCount) =>
                  Math.min(currentCount + 3, filteredPaperResults.length),
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-emerald-950 transition hover:border-emerald-700 hover:bg-emerald-50"
            >
              Load more results
            </button>
          )}
        </div>
      </section>
    </section>
  );
}
