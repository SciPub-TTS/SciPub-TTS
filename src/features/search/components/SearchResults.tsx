import { LoaderCircle } from "lucide-react";
import type { MouseEvent, ReactNode, RefObject } from "react";
import { memo, useEffect, useRef } from "react";

import { mockResultSortOptions } from "@/features/search/services";
import type {
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
  const resultTitle = appliedSearchQuery || "all papers";
  const formattedResultCount = formatFullNumber(totalResultCount);
  const formattedResponseTime = formatResponseTime(responseTimeSeconds);
  const resultMetaText = `${formattedResultCount} papers - ${formattedResponseTime} - matched title, abstract.`;

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

  return (
    <section>
      <div className="space-y-4">
        {hasSearched && !isLoadingResults ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-black">
                Results for{" "}
                <span className="italic text-[#14532D]">"{resultTitle}"</span>
              </h2>
              <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.24em] text-black">
                {resultMetaText}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <SortActions
                isLoadingResults={isLoadingResults}
                selectedSort={selectedSort}
                onSelectSort={onSelectSort}
              />
            </div>
          </div>
        ) : null}

        {isLoadingResults ? (
          <SearchLoadingState />
        ) : !hasSearched ? (
          <div className="rounded-2xl border border-slate-600 bg-white p-8 text-center">
            <p className="text-lg font-bold text-black">
              Enter a keyword or choose filters, then click Search.
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

export const SearchResults = memo(SearchResultsComponent);

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

function SortActions({
  isLoadingResults,
  selectedSort,
  onSelectSort,
}: {
  isLoadingResults: boolean;
  selectedSort: string;
  onSelectSort: (sortOption: string) => void;
}) {
  function handleSortClick(event: MouseEvent<HTMLButtonElement>) {
    // value comes from the clicked sort button.
    const sortOption = event.currentTarget.value;

    onSelectSort(sortOption);
  }

  return (
    <>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-black">
        Sort:
      </span>
      <div className="flex overflow-hidden rounded-lg border border-slate-400 bg-white divide-x divide-slate-400">
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
                ? "bg-[#14532D] text-white"
                : "text-black hover:bg-slate-200 hover:text-black",
            ].join(" ")}
          >
            {sortOption}
          </button>
        ))}
      </div>
    </>
  );
}

function ResultsList({
  autoLoadAnchorIndex,
  lazyLoadAnchorRef,
  visiblePaperResults,
}: ResultsListProps & {
  lazyLoadAnchorRef: RefObject<HTMLDivElement | null>;
}) {
  const resultItems: ReactNode[] = [];
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

  return <div className="space-y-4">{resultItems}</div>;
}
