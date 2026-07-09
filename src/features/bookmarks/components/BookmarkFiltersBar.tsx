import type {
  BookmarkFilters,
  FilterOptionsResponse,
  SortOption,
} from "@/features/bookmarks/types/bookmark.types";
import { SORT_LABELS } from "@/features/bookmarks/utils/bookmark.utils";

interface BookmarkFiltersBarProps {
  filters: BookmarkFilters;
  filterOptions: FilterOptionsResponse | null;
  totalShowing: number;
  totalElements: number;
  onFilterChange: <K extends keyof BookmarkFilters>(
    key: K,
    value: BookmarkFilters[K],
  ) => void;
  onReset: () => void;
}

interface SelectFilterProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
  const hasValue = value !== "";

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 cursor-pointer appearance-none rounded-xl border pl-3 pr-8 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#7AC143]/25 ${
          hasValue
            ? "border-black bg-white text-[#F37021]"
            : "border-black bg-white text-black/70 hover:bg-white"
        }`}
      >
        <option value="">{label}: All {label.toLowerCase()}s</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {label}: {opt}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black/45"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
      >
        <path
          d="M2 3.5l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function BookmarkFiltersBar({
  filters,
  filterOptions,
  totalShowing,
  totalElements,
  onFilterChange,
  onReset,
}: BookmarkFiltersBarProps) {
  const sortOptions: SortOption[] = [
    "RECENT",
    "OLDEST",
    "YEAR_DESC",
    "YEAR_ASC",
    "CITATION_DESC",
    "CITATION_ASC",
    "TITLE_ASC",
    "TITLE_DESC",
  ];

  const hasActiveFilters =
    filters.topic !== "" ||
    filters.source !== "" ||
    filters.author !== "" ||
    filters.year !== null;

  return (
    <div className="mb-4 rounded-2xl border border-black bg-white px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-center gap-4 border-b border-black/15">
        <button className="flex items-center gap-2 border-b-2 border-[#00AEEF] pb-2 text-sm font-medium text-black">
          Saved papers
          <span className="rounded-full bg-[#E8F8FF] px-1.5 py-0.5 text-xs font-semibold text-[#00AEEF]">
            {totalElements}
          </span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SelectFilter
          label="Topic"
          value={filters.topic}
          options={filterOptions?.topics ?? []}
          onChange={(v) => onFilterChange("topic", v)}
        />

        <SelectFilter
          label="Journal"
          value={filters.source}
          options={filterOptions?.sources ?? []}
          onChange={(v) => onFilterChange("source", v)}
        />

        <SelectFilter
          label="Year"
          value={filters.year?.toString() ?? ""}
          options={(filterOptions?.years ?? []).map(String)}
          onChange={(v) => onFilterChange("year", v ? Number(v) : null)}
        />

        <SelectFilter
          label="Author"
          value={filters.author?.toString() ?? ""}
          options={(filterOptions?.authors ?? []).map(String)}
          onChange={(v) => onFilterChange("author", v)}
        />

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex h-9 items-center gap-1 rounded-xl px-3 text-xs text-red-600 transition-all hover:bg-white"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Clear filters
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="font-subtext text-xs text-[#8B5E34]">Sort</span>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange("sort", e.target.value as SortOption)}
              className="h-9 cursor-pointer appearance-none rounded-xl border border-black bg-white pl-3 pr-8 text-xs text-black/70 transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#7AC143]/25"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {SORT_LABELS[opt]}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black/45"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M2 3.5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {totalElements > 0 && (
        <p className="font-subtext mt-3 text-xs text-black/45">
          Showing <span className="text-[#F37021]">{totalShowing}</span> of{" "}
          <span className="text-[#00AEEF]">{totalElements}</span> saved papers
        </p>
      )}
    </div>
  );
}
