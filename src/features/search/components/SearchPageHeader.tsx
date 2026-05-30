import { BookmarkPlus } from "lucide-react";
import type { SearchPageHeaderProps } from "@/features/search/types";

export function SearchPageHeader({
  canSaveSearch,
  onSaveSearch,
}: SearchPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-emerald-950">
          Explore - Search + Trend Analysis
        </p>
        <h1 className="mt-3 max-w-3xl font-['Newsreader'] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-slate-950 md:text-5xl">
          Search papers. See the field move.
        </h1>
      </div>

      <button
        type="button"
        onClick={onSaveSearch}
        disabled={!canSaveSearch}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        <BookmarkPlus className="h-4 w-4" />
        Save this search
      </button>
    </div>
  );
}

/*
SEARCH_FILE_NOTE
Syntax su dung:
- Presentational component nhan props.
File nay lam gi:
- Hien thi tieu de trang va nut Save this search.
Flow chay:
- Nhan callback onSaveSearch tu component cha de xu ly khi click.
*/

