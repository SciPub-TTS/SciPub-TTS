import type { BookmarkFilters, FilterOptionsResponse, SortOption } from "@/features/bookmarks/types/bookmark.types";
import { SORT_LABELS } from "@/features/bookmarks/utils/bookmark.utils";

interface BookmarkFiltersBarProps {
    filters: BookmarkFilters;
    filterOptions: FilterOptionsResponse | null;
    totalShowing: number;
    totalElements: number;
    onFilterChange: <K extends keyof BookmarkFilters>(key: K, value: BookmarkFilters[K]) => void;
    onReset: () => void;
}

interface SelectFilterProps {
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
    icon?: React.ReactNode;
}

function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
    const hasValue = value !== "";
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`h-8 pl-2.5 pr-7 rounded-lg border text-xs font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    hasValue
                        ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
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
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                width="10" height="10" viewBox="0 0 10 10" fill="none"
            >
                <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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
        "RECENT", "OLDEST", "YEAR_DESC", "YEAR_ASC",
        "CITATION_DESC", "CITATION_ASC", "TITLE_ASC", "TITLE_DESC",
    ];

    const hasActiveFilters =
        filters.topic !== "" ||
        filters.source !== "" ||
        filters.author !== "" ||
        filters.year !== null;

    return (
        <div className="mb-4">
            {/* Tab row */}
            <div className="flex items-center gap-4 border-b border-slate-200 mb-4">
                <button className="flex items-center gap-2 pb-2 border-b-2 border-emerald-600 text-sm font-medium text-slate-900">
                    Saved papers
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {totalElements}
          </span>
                </button>
            </div>

            {/* Filters row */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Topic */}
                <SelectFilter
                    label="Topic"
                    value={filters.topic}
                    options={filterOptions?.topics ?? []}
                    onChange={(v) => onFilterChange("topic", v)}
                />

                {/* Source / Journal */}
                <SelectFilter
                    label="Journal"
                    value={filters.source}
                    options={filterOptions?.sources ?? []}
                    onChange={(v) => onFilterChange("source", v)}
                />

                {/* Year */}
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

                {/*/!* More filters placeholder *!/*/}
                {/*<button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all">*/}
                {/*    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">*/}
                {/*        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />*/}
                {/*    </svg>*/}
                {/*    More filters*/}
                {/*</button>*/}

                {/* Reset if active */}
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-all"
                    >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        Clear filters
                    </button>
                )}

                {/* Sort — pushed to right */}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-slate-400">Sort</span>
                    <div className="relative">
                        <select
                            value={filters.sort}
                            onChange={(e) => onFilterChange("sort", e.target.value as SortOption)}
                            className="h-8 pl-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all hover:border-slate-300"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {SORT_LABELS[opt]}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                            width="10" height="10" viewBox="0 0 10 10" fill="none"
                        >
                            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Result count */}
            {totalElements > 0 && (
                <p className="mt-3 text-xs text-slate-400">
                    Showing {totalShowing} of {totalElements} saved papers
                </p>
            )}
        </div>
    );
}
