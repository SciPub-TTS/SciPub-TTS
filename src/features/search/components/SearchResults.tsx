import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  searchResultSortGroups,
  type SearchResultSortGroup,
} from "@/features/search/services";
import type { SearchResultsProps } from "@/features/search/types";
import { formatFullNumber, formatResponseTime } from "@/features/search/utils";

import { PaperResultCard } from "./PaperResultCard";

export function SearchResults({
  appliedSearchQuery,
  autoLoadAnchorIndex,
  canLoadMoreResults,
  hasSearched,
  isLoadingResults,
  isLoadingMoreResults,
  responseTimeSeconds,
  selectedSorts,
  totalResultCount,
  visiblePaperResults,
  onLoadMoreResults,
  onClearSorts,
  onToggleSort,
}: SearchResultsProps) {
  const lazyLoadAnchorRef = useRef<HTMLDivElement>(null);
  const resultTitle = appliedSearchQuery || "all papers";
  const formattedResultCount = formatFullNumber(totalResultCount);
  const formattedResponseTime = formatResponseTime(responseTimeSeconds);
  const resultMetaText = `${formattedResultCount} papers - ${formattedResponseTime}.`;
  const canSortResults =
    hasSearched && visiblePaperResults.length > 0 && !isLoadingResults;

  useEffect(() => {
    const anchor = lazyLoadAnchorRef.current;

    if (
      !anchor ||
      autoLoadAnchorIndex < 0 ||
      !canLoadMoreResults ||
      isLoadingMoreResults
    ) {
      return;
    }

    anchor.dataset.autoLoadTriggered = "0";

    const observer = new IntersectionObserver(
      (entries) => {
        const anchorIsVisible = entries.some((entry) => entry.isIntersecting);

        if (
          anchorIsVisible &&
          anchor.dataset.autoLoadTriggered !== "1"
        ) {
          anchor.dataset.autoLoadTriggered = "1";
          onLoadMoreResults();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(anchor);

    return () => {
      observer.disconnect();
    };
  }, [
    autoLoadAnchorIndex,
    canLoadMoreResults,
    isLoadingMoreResults,
    onLoadMoreResults,
  ]);

  return (
    <section>
      <div className="space-y-4">
        <div
          className={[
            "flex gap-4",
            hasSearched && !isLoadingResults
              ? "flex-col lg:flex-row lg:items-start lg:justify-between"
              : "justify-end",
          ].join(" ")}
        >
          {hasSearched && !isLoadingResults ? (
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-semibold text-black">
                Results for{" "}
                <span className="italic text-[#14532D]">"{resultTitle}"</span>
              </h2>
              <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.24em] text-black">
                {resultMetaText}
              </p>
            </div>
          ) : null}

          <div className="flex shrink-0 justify-end lg:justify-start">
            <SortActions
              canSortResults={canSortResults}
              selectedSorts={selectedSorts}
              onClearSorts={onClearSorts}
              onToggleSort={onToggleSort}
            />
          </div>
        </div>

        {isLoadingResults ? (
          <SearchLoadingState />
        ) : !hasSearched ? (
          <div className="rounded-2xl border border-slate-600 bg-white p-8 text-center">
            <p className="text-lg font-bold text-black">
              Enter a keyword or choose filters, then click Search or Apply
              filters.
            </p>
          </div>
        ) : visiblePaperResults.length === 0 ? (
          <div className="rounded-2xl border border-slate-600 bg-white p-8 text-center">
            <p className="text-lg font-bold text-black">
              No papers matched this search.
            </p>
          </div>
        ) : (
          <ResultsList
            autoLoadAnchorIndex={autoLoadAnchorIndex}
            lazyLoadAnchorRef={lazyLoadAnchorRef}
            visiblePaperResults={visiblePaperResults}
          />
        )}

        {hasSearched && !isLoadingResults && isLoadingMoreResults ? (
          <p className="py-2 text-center text-sm font-semibold text-black">
            Loading more results...
          </p>
        ) : null}
      </div>
    </section>
  );
}

function SearchLoadingState() {
  return (
    <div className="rounded-2xl border border-[#059669] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#A3E635]/20 text-[#059669]">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
      <p className="mt-4 text-lg font-bold text-black">Searching papers...</p>
    </div>
  );
}

type SortActionsProps = {
  canSortResults: boolean;
  selectedSorts: string[];
  onClearSorts: () => void;
  onToggleSort: (sortOption: string) => void;
};

type ResultsListProps = {
  autoLoadAnchorIndex: number;
  lazyLoadAnchorRef: { current: HTMLDivElement | null };
  visiblePaperResults: SearchResultsProps["visiblePaperResults"];
};

function SortActions(props: SortActionsProps) {
  const { canSortResults, selectedSorts, onClearSorts, onToggleSort } = props;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-black bg-slate-50/80 p-3 shadow-sm">
      {searchResultSortGroups.map((group) => (
        <SortDropdown
          key={group.key}
          group={group}
          canSortResults={canSortResults}
          selectedSort={getSelectedSortValue(group, selectedSorts)}
          onToggleSort={onToggleSort}
        />
      ))}
      <button
        type="button"
        onClick={onClearSorts}
        disabled={!canSortResults || selectedSorts.length === 0}
        className={[
          "h-10 rounded-lg border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
          canSortResults && selectedSorts.length > 0
            ? "border-black bg-white text-black hover:bg-red-600 hover:text-white"
            : "border-black bg-slate-200 text-slate-500",
        ].join(" ")}
      >
        Clear
      </button>
    </div>
  );
}

type SortDropdownProps = {
  canSortResults: boolean;
  group: SearchResultSortGroup;
  selectedSort: string;
  onToggleSort: (sortOption: string) => void;
};

function SortDropdown(props: SortDropdownProps) {
  const { canSortResults, group, selectedSort, onToggleSort } = props;
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const selectedOption =
    group.options.find((option) => option.value === selectedSort) || null;
  const isActive = selectedOption !== null;
  const summaryLabel = selectedOption ? selectedOption.label : "None";

  function handleDetailsToggle() {
    const currentDropdown = detailsRef.current;

    if (!currentDropdown || !currentDropdown.open) {
      return;
    }

    const allDropdowns = document.querySelectorAll<HTMLDetailsElement>(
      'details[data-search-sort-dropdown="true"]',
    );

    allDropdowns.forEach((dropdown) => {
      if (dropdown !== currentDropdown) {
        dropdown.open = false;
      }
    });
  }

  function handleSelectSort(sortValue: string) {
    onToggleSort(sortValue);

    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-black">
        {group.label}
      </span>

      <details
        ref={detailsRef}
        className="group relative min-w-[8.75rem]"
        data-search-sort-dropdown="true"
        onToggle={handleDetailsToggle}
      >
        <summary
          className={[
            "flex h-10 cursor-pointer list-none items-center justify-between rounded-sm border border-black bg-white px-2.5 text-sm font-semibold text-black outline-none transition",
            "marker:content-none [&::-webkit-details-marker]:hidden",
            isActive
              ? "border-[#15803D] bg-[#A3E635]/15"
              : "hover:border-[#15803D]",
            canSortResults
              ? ""
              : "pointer-events-none border-black bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          <span className="truncate">{summaryLabel}</span>
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180 text-black" />
        </summary>

        <div className="absolute left-0 top-full z-20 mt-2 w-full min-w-[9.5rem] divide-y divide-black overflow-hidden rounded-sm border border-black bg-white shadow-xl">
          {group.options.map((option) => {
            const isSelected = selectedSort === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectSort(option.value)}
                className={[
                  "flex w-full items-center gap-2 px-2.5 py-2 text-left text-sm font-semibold transition",
                  isSelected
                    ? "bg-[#A3E635]/20 text-[#15803D]"
                    : "text-black hover:bg-[#A3E635]/20 hover:text-[#15803D]",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-4 w-4 items-center justify-center",
                    isSelected ? "text-[#14532D]" : "text-transparent",
                  ].join(" ")}
                >
                  <Check className="h-4 w-4" />
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </details>
    </div>
  );
}

function ResultsList(props: ResultsListProps) {
  const { autoLoadAnchorIndex, lazyLoadAnchorRef, visiblePaperResults } = props;
  const resultItems = [];

  for (let index = 0; index < visiblePaperResults.length; index += 1) {
    const paper = visiblePaperResults[index];

    if (index === autoLoadAnchorIndex) {
      resultItems.push(
        <div
          key="auto-load-anchor"
          ref={lazyLoadAnchorRef}
          className="h-1 w-full"
        />,
      );
    }

    resultItems.push(<PaperResultCard key={paper.id} paper={paper} />);
  }

  return <div className="space-y-4">{resultItems}</div>;
}

function getSelectedSortValue(
  group: SearchResultSortGroup,
  selectedSorts: string[],
) {
  const selectedOption = group.options.find((option) =>
    selectedSorts.includes(option.value),
  );

  if (!selectedOption) {
    return "";
  }

  return selectedOption.value;
}
