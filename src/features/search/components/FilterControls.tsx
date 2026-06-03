import { Check, ChevronDown, Search, Tag } from "lucide-react";
import type { ChangeEvent, MouseEvent, UIEvent } from "react";
import { useRef, useState } from "react";

import { SEARCH_MIN_CITATION } from "@/features/search/constants";
import { mockSearchYearRange } from "@/features/search/services";
import type {
  CheckboxFilterProps,
  CitationFilterProps,
  MultiSelectFilterProps,
  OrcidFilterProps,
  SearchFilters,
  YearFilterProps,
} from "@/features/search/types";
import {
  hasInvalidCitationRange,
  hasInvalidYearRange,
} from "@/features/search/utils";

const { currentYear, minimumYear } = mockSearchYearRange;

export function MultiSelectFilter({
  filterKey,
  hasMoreOptions = false,
  isLoadingOptions = false,
  isLoadingMoreOptions = false,
  label,
  options,
  selected,
  onChange,
  onLoadMoreOptions,
  onSearchKeywordChange,
}: MultiSelectFilterProps) {
  const [optionKeyword, setOptionKeyword] = useState("");
  const detailsRef = useRef<HTMLDetailsElement>(null);
  let selectedOptionLabel = "Any";
  if (selected.length > 0) {
    selectedOptionLabel = `${selected.length} selected`;
  }

  const visibleOptions = getVisibleOptions(options, optionKeyword);

  function toggleOption(option: string) {
    if (selected.includes(option)) {
      onChange(removeSelectedOption(selected, option));
      return;
    }

    onChange([...selected, option]);
  }

  function handleOptionKeywordChange(event: ChangeEvent<HTMLInputElement>) {
    const nextOptionKeyword = event.target.value;
    setOptionKeyword(nextOptionKeyword);
    onSearchKeywordChange?.(nextOptionKeyword);
  }

  function handleOptionCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    // currentTarget is the input that fired the event.
    const option = event.currentTarget.value;

    toggleOption(option);
  }

  function handleOptionListScroll(event: UIEvent<HTMLDivElement>) {
    if (!hasMoreOptions || isLoadingOptions || isLoadingMoreOptions || !onLoadMoreOptions) {
      return;
    }

    const optionContainer = event.currentTarget;
    const reachedBottom =
      optionContainer.scrollTop + optionContainer.clientHeight >=
      optionContainer.scrollHeight - 24;

    if (reachedBottom) {
      onLoadMoreOptions();
    }
  }

  function handleDetailsToggle() {
    const currentDropdown = detailsRef.current;

    if (!currentDropdown?.open) {
      return;
    }

    // Keep only one MultiSelect dropdown open at a time to avoid stacked overlays.
    const allDropdowns = document.querySelectorAll<HTMLDetailsElement>(
      'details[data-search-multiselect="true"]',
    );

    allDropdowns.forEach((dropdown) => {
      if (dropdown !== currentDropdown) {
        dropdown.open = false;
      }
    });
  }

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-black">
        {label}
      </span>

      <details
        ref={detailsRef}
        className="group relative"
        data-filter-key={filterKey}
        data-search-multiselect="true"
        onToggle={handleDetailsToggle}
      >
        <summary className="flex h-10 cursor-pointer list-none items-center justify-between rounded-lg border border-slate-400 bg-white px-3 text-sm font-semibold text-black outline-none transition hover:border-[#15803D]">
          <span className="truncate">{selectedOptionLabel}</span>
          <ChevronDown className="h-4 w-4 text-black transition group-open:rotate-180" />
        </summary>

        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl">
          <div className="border-b border-slate-300 bg-slate-50/80 p-2">
            <p className="mb-1 px-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black">
              Search
            </p>
            <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-400 bg-white px-2">
              <Search className="h-4 w-4 text-black" />
              <input
                type="search"
                value={optionKeyword}
                onChange={handleOptionKeywordChange}
                placeholder={`Search ${label.toLowerCase()}`}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-black"
              />
            </div>
            {isLoadingOptions && (
              <p className="px-1 pt-1 text-xs font-semibold text-black">
                Loading options...
              </p>
            )}
          </div>

          <div
            className="max-h-56 overflow-x-hidden overflow-y-auto p-2"
            onScroll={handleOptionListScroll}
          >
            {visibleOptions.length > 0 ? (
              visibleOptions.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-black hover:bg-[#A3E635]/20 hover:text-[#15803D]"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={selected.includes(option)}
                    onChange={handleOptionCheckboxChange}
                    className="h-4 w-4 rounded border-slate-400 accent-[#14532D]"
                  />
                  <span className="min-w-0 flex-1 truncate">{option}</span>
                </label>
              ))
            ) : isLoadingOptions ? (
              <p className="px-2 py-3 text-sm font-semibold text-black">
                Searching...
              </p>
            ) : (
              <p className="px-2 py-3 text-sm font-semibold text-black">
                No options match "{optionKeyword}"
              </p>
            )}

            {isLoadingMoreOptions && (
              <p className="px-2 py-3 text-sm font-semibold text-black">
                Loading more options...
              </p>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}

export function CheckboxFilter({
  label,
  checked,
  onChange,
}: CheckboxFilterProps) {
  const checkboxLabel = checked ? "True" : "False";

  // A controlled checkbox reads from props and reports changes upward.
  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    const isChecked = event.target.checked;

    onChange(isChecked);
  }

  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-black">
        {label}
      </span>

      <span className="flex h-10 items-center gap-2 rounded-lg border border-slate-400 bg-white px-3 text-sm font-semibold text-black">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-slate-400 accent-[#14532D]"
        />
        {checkboxLabel}
      </span>
    </label>
  );
}

export function YearFilter({ filters, updateFilter }: YearFilterProps) {
  const yearRangeIsInvalid = hasInvalidYearRange(filters);
  const invalidYearMessage =
    filters.yearMode === "range"
      ? `Year must be ${minimumYear}-${currentYear} and From cannot be greater than To.`
      : `Year must be ${minimumYear}-${currentYear}.`;
  const inputClassName = [
    "h-9 rounded-md border bg-white px-2 text-sm font-semibold text-black outline-none transition focus:border-[#15803D]",
    yearRangeIsInvalid ? "border-red-500" : "border-slate-400",
  ].join(" ");

  function handleYearModeClick(event: MouseEvent<HTMLButtonElement>) {
    // Button values are strings, so cast them to the union type used by filters.
    const nextYearMode = event.currentTarget.value as SearchFilters["yearMode"];

    updateFilter("yearMode", nextYearMode);
  }

  function handleYearFromChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilter("yearFrom", event.target.value);
  }

  function handleYearToChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilter("yearTo", event.target.value);
  }

  function handleYearExactChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilter("yearExact", event.target.value);
  }

  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-black">
        Year
      </span>

      <div className="rounded-lg border border-slate-400 bg-white p-2">
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1">
          {(["range", "exact"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              value={mode}
              onClick={handleYearModeClick}
              className={[
                "rounded px-2 py-1.5 text-xs font-bold capitalize transition",
                filters.yearMode === mode
                  ? "bg-white text-[#14532D] shadow-sm"
                  : "text-black hover:text-black",
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
              onChange={handleYearFromChange}
              placeholder="From"
              aria-label="Year from"
              className={inputClassName}
            />
            <input
              type="number"
              min={minimumYear}
              max={currentYear}
              value={filters.yearTo}
              onChange={handleYearToChange}
              placeholder="To"
              aria-label="Year to"
              className={inputClassName}
            />
          </div>
        ) : (
          <input
            type="number"
            min={minimumYear}
            max={currentYear}
            value={filters.yearExact}
            onChange={handleYearExactChange}
            placeholder="Exact year"
            aria-label="Exact publication year"
            className={["w-full", inputClassName].join(" ")}
          />
        )}
      </div>

      {yearRangeIsInvalid && (
        <p className="text-xs font-semibold text-red-600">
          {invalidYearMessage}
        </p>
      )}
    </label>
  );
}

export function CitationFilter({ filters, updateFilter }: CitationFilterProps) {
  const citationRangeIsInvalid = hasInvalidCitationRange(filters);
  const rangeInputClassName = [
    "h-9 rounded-md border px-2 text-sm font-semibold text-black outline-none focus:border-[#15803D]",
    citationRangeIsInvalid ? "border-red-500" : "border-slate-400",
  ].join(" ");

  function handleCitationModeClick(event: MouseEvent<HTMLButtonElement>) {
    // The cast narrows the string value to "range" | "exact".
    const nextCitationMode = event.currentTarget
      .value as SearchFilters["citationMode"];

    updateFilter("citationMode", nextCitationMode);
  }

  function handleCitationMinChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilter("citationMin", event.target.value);
  }

  function handleCitationMaxChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilter("citationMax", event.target.value);
  }

  function handleCitationExactChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilter("citationExact", event.target.value);
  }

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-black">
        Citation Count
      </span>

      <div className="rounded-lg border border-slate-400 bg-white p-2">
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1">
          {(["range", "exact"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              value={mode}
              onClick={handleCitationModeClick}
              className={[
                "rounded px-2 py-1.5 text-xs font-bold capitalize transition",
                filters.citationMode === mode
                  ? "bg-white text-[#14532D] shadow-sm"
                  : "text-black hover:text-black",
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
                min={SEARCH_MIN_CITATION}
                value={filters.citationMin}
                onChange={handleCitationMinChange}
                placeholder="Min"
                aria-label="Minimum citation count"
                className={rangeInputClassName}
              />
              <input
                type="number"
                min={SEARCH_MIN_CITATION}
                value={filters.citationMax}
                onChange={handleCitationMaxChange}
                placeholder="Max"
                aria-label="Maximum citation count"
                className={rangeInputClassName}
              />
            </div>

            {citationRangeIsInvalid && (
              <p className="mt-2 text-xs font-semibold text-red-600">
                Min citations cannot be greater than max citations.
              </p>
            )}
          </>
        ) : (
          <input
            type="number"
            min={SEARCH_MIN_CITATION}
            value={filters.citationExact}
            onChange={handleCitationExactChange}
            placeholder="Exact count"
            aria-label="Exact citation count"
            className="h-9 w-full rounded-md border border-slate-400 px-2 text-sm font-semibold text-black outline-none focus:border-[#15803D]"
          />
        )}
      </div>
    </div>
  );
}

export function OrcidFilter({ value, updateFilter }: OrcidFilterProps) {
  function handleOrcidConditionClick(event: MouseEvent<HTMLButtonElement>) {
    // The ORCID condition can only be "", "is", or "is not".
    const nextCondition = event.currentTarget
      .value as SearchFilters["indexedByOrcid"];

    updateFilter("indexedByOrcid", nextCondition);
  }

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-black">
        Indexed by ORCID
      </span>

      <div className="flex h-10 items-center overflow-visible rounded-lg border border-slate-400 bg-white text-sm font-semibold text-black">
        <div className="flex h-full items-center gap-2 border-r border-slate-300 px-3">
          <Tag className="h-4 w-4 text-black" />
          Work
        </div>

        <details className="group relative h-full">
          <summary className="flex h-full min-w-20 cursor-pointer list-none items-center justify-center gap-1 bg-slate-100 px-3 text-black shadow-sm">
            {value || "is"}
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>

          <div className="absolute left-0 z-30 mt-1 w-36 rounded-xl border border-slate-300 bg-white p-1.5 shadow-xl">
            {(["is", "is not"] as const).map((condition) => (
              <button
                key={condition}
                type="button"
                value={condition}
                onClick={handleOrcidConditionClick}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-black hover:bg-[#A3E635]/20 hover:text-[#15803D]"
              >
                <span className="h-4 w-4">
                  {value === condition && <Check className="h-4 w-4" />}
                </span>
                {condition}
              </button>
            ))}
          </div>
        </details>

        <div className="flex-1 px-3">Has an ORCID</div>
      </div>
    </div>
  );
}

function getVisibleOptions(options: string[], keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return options;
  }

  const visibleOptions: string[] = [];

  for (const option of options) {
    if (option.toLowerCase().startsWith(normalizedKeyword)) {
      visibleOptions.push(option);
    }
  }

  return visibleOptions;
}

function removeSelectedOption(selected: string[], optionToRemove: string) {
  const nextSelected: string[] = [];

  for (const option of selected) {
    if (option !== optionToRemove) {
      nextSelected.push(option);
    }
  }

  return nextSelected;
}

