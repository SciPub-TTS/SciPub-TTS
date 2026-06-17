import { ScanSearch } from "lucide-react";

import { searchScopeLabel } from "@/features/search/services";

export function SearchPageHeader() {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
          Explore - Search + Trend Analysis
        </p>
        <h1 className="font-search-title mt-3 max-w-none text-4xl font-normal leading-[1.15] tracking-normal text-[#059669] md:text-5xl xl:whitespace-nowrap">
          Discover Research. Track the Trends.
        </h1>
      </div>

      <div className="self-start xl:mt-2 xl:max-w-sm">
        <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF6FF] text-[#005CB9]">
              <ScanSearch className="h-4 w-4" />
            </span>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#005CB9]">
                Current Scope
              </p>
              <p className="mt-1 text-sm font-semibold leading-5 text-black">
                {searchScopeLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

