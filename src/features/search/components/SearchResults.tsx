import type { MouseEvent, RefObject } from "react";
import { memo, useEffect, useRef } from "react";

import { mockResultSortOptions } from "@/features/search/services";
import type {
  ResultsHeaderProps,
  ResultsListProps,
  SearchResultsProps,
} from "@/features/search/types";
import { formatFullNumber, formatResponseTime } from "@/features/search/utils";

import { PaperResultCard } from "./PaperResultCard";

function SearchResultsComponent({
  appliedSearchQuery,
  autoLoadAnchorIndex,
  canLoadMoreResults,
  hasSearched,
  isLoadingResults,
  isLoadingMoreResults,
  responseTimeSeconds,
  selectedSort,
  totalResultCount,
  visiblePaperResults,
  onLoadMoreResults,
  onSelectSort,
}: SearchResultsProps) {
  const lazyLoadAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchor = lazyLoadAnchorRef.current;

    if (!anchor || !canLoadMoreResults || isLoadingMoreResults) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const anchorIsVisible = entries.some((entry) => entry.isIntersecting);

        if (anchorIsVisible) {
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

  if (!hasSearched) {
    return (
      <section>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-lg font-bold text-slate-900">
            Enter a keyword or choose filters, then click Search.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="space-y-4">
        <ResultsHeader
          appliedSearchQuery={appliedSearchQuery}
          isLoadingResults={isLoadingResults}
          responseTimeSeconds={responseTimeSeconds}
          totalResultCount={totalResultCount}
          selectedSort={selectedSort}
          onSelectSort={onSelectSort}
        />

        <ResultsList
          autoLoadAnchorIndex={autoLoadAnchorIndex}
          hasSearched={hasSearched}
          isLoadingResults={isLoadingResults}
          lazyLoadAnchorRef={lazyLoadAnchorRef}
          visiblePaperResults={visiblePaperResults}
        />

        {isLoadingMoreResults && (
          <p className="py-2 text-center text-sm font-semibold text-slate-600">
            Loading more results...
          </p>
        )}
      </div>
    </section>
  );
}

export const SearchResults = memo(SearchResultsComponent);

function ResultsHeader({
  appliedSearchQuery,
  isLoadingResults,
  responseTimeSeconds,
  totalResultCount,
  selectedSort,
  onSelectSort,
}: ResultsHeaderProps) {
  // Empty query means the user is viewing the full result list.
  const resultTitle = appliedSearchQuery || "all papers";
  const formattedResultCount = formatFullNumber(totalResultCount);
  const formattedResponseTime = formatResponseTime(responseTimeSeconds);
  const resultMetaText = `${formattedResultCount} papers - ${formattedResponseTime} - matched title, abstract, full text`;

  function handleSortClick(event: MouseEvent<HTMLButtonElement>) {
    // value comes from the clicked sort button.
    const sortOption = event.currentTarget.value;

    onSelectSort(sortOption);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">
          Results for{" "}
          <span className="italic text-emerald-950">"{resultTitle}"</span>
        </h2>
        <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">
          {resultMetaText}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-slate-500">
          Sort:
        </span>
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white">
          {mockResultSortOptions.map((sortOption) => (
            <button
              key={sortOption}
              type="button"
              value={sortOption}
              onClick={handleSortClick}
              disabled={isLoadingResults}
              className={[
                "px-4 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60",
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
  );
}

function ResultsList({
  autoLoadAnchorIndex,
  hasSearched,
  isLoadingResults,
  lazyLoadAnchorRef,
  visiblePaperResults,
}: ResultsListProps & {
  lazyLoadAnchorRef: RefObject<HTMLDivElement | null>;
}) {
  if (isLoadingResults) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-bold text-slate-900">Loading results...</p>
      </div>
    );
  }

  if (hasSearched && visiblePaperResults.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-lg font-bold text-slate-900">
          No papers matched this search.
        </p>
      </div>
    );
  }

  const resultItems = [];
  for (let index = 0; index < visiblePaperResults.length; index += 1) {
    if (index === autoLoadAnchorIndex) {
      resultItems.push(
        <div
          key="auto-load-anchor"
          ref={lazyLoadAnchorRef}
          className="h-1 w-full"
        />,
      );
    }

    const paper = visiblePaperResults[index];
    resultItems.push(<PaperResultCard key={paper.id} paper={paper} />);
  }

  return (
    <div className="space-y-4">
      {resultItems}
    </div>
  );
}

