import { BookmarkPlus } from "lucide-react";
import type { SearchPageHeaderProps } from "@/features/search/types";

export function SearchPageHeader({
  canSaveSearch,
  onSaveSearch,
}: SearchPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
          Explore - Search + Trend Analysis
        </p>
        <h1 className="font-search-title mt-3 max-w-none text-4xl font-normal leading-[1.15] tracking-normal text-[#059669] md:text-5xl xl:whitespace-nowrap">
          Discover Research. Track the Trends.
        </h1>
      </div>

      <button
        type="button"
        onClick={onSaveSearch}
        disabled={!canSaveSearch}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-400 bg-white px-4 py-3 text-sm font-semibold text-black shadow-sm transition enabled:hover:border-[#059669] enabled:hover:bg-[#059669] enabled:hover:text-white disabled:cursor-not-allowed disabled:text-black"
      >
        <BookmarkPlus className="h-4 w-4" />
        Save this search
      </button>
    </div>
  );
}

