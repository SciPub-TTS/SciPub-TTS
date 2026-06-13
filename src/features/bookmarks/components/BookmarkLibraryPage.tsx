import {useBookmarks} from "@/features/bookmarks/hooks/UseBookmarks.ts";
import { BookmarkTopBar } from "@/features/bookmarks/components/BookmarkTopBar";
import { BookmarkPageHeader } from "@/features/bookmarks/components/BookmarkPageHeader";
import { BookmarkFiltersBar } from "@/features/bookmarks/components/BookmarkFiltersBar";
import { BookmarkGrid } from "@/features/bookmarks/components/BookmarkGrid";

/**
 * BookmarkLibraryPage
 *
 * Route: /bookmarks
 * Layout: render bên trong MainLayout (sidebar đã có sẵn)
 *
 * Cấu trúc:
 *  BookmarkTopBar        ← breadcrumb + search input + export + new collection
 *  BookmarkPageHeader    ← hero text + stats + shareable link
 *  BookmarkFiltersBar    ← tab + filter dropdowns + sort + count
 *  BookmarkGrid          ← 3-column card grid + infinite scroll
 */
export default function BookmarkLibraryPage() {
    const {
        items,
        totalElements,
        hasNext,
        isLoadingMore,
        isRefreshing,
        error,
        filters,
        stats,
        filterOptions,
        updateFilter,
        resetFilters,
        loadMore,
        deleteBookmark,
        updateNote,
    } = useBookmarks();

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-[1200px] mx-auto px-6 py-6">

                {/* ── Top bar: breadcrumb + global search + actions ── */}
                <BookmarkTopBar
                    keyword={filters.keyword}
                    onKeywordChange={(v) => updateFilter("keyword", v)}
                />

                {/* ── Hero header + stats card ── */}
                <BookmarkPageHeader
                    totalBookmarks={totalElements}
                    stats={stats}
                />

                {/* ── Filter tabs + dropdowns + sort ── */}
                <BookmarkFiltersBar
                    filters={filters}
                    filterOptions={filterOptions}
                    totalShowing={items.length}
                    totalElements={totalElements}
                    onFilterChange={updateFilter}
                    onReset={resetFilters}
                />

                {/* ── Bookmark grid with lazy loading ── */}
                <BookmarkGrid
                    items={items}
                    hasNext={hasNext}
                    isLoadingMore={isLoadingMore}
                    isRefreshing={isRefreshing}
                    error={error}
                    onLoadMore={loadMore}
                    onDelete={deleteBookmark}
                    onUpdateNote={updateNote}
                />

            </div>
        </div>
    );
}
