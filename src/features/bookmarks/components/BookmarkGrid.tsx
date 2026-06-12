import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import { BookmarkCard } from "@/features/bookmarks/components/BookmarkCard";
import {useInfiniteScroll} from "@/features/bookmarks/hooks/UseInfiniteScroll.ts";

interface BookmarkGridProps {
    items: BookmarkResponse[];
    hasNext: boolean;
    isLoadingMore: boolean;
    isRefreshing: boolean;
    error: string | null;
    onLoadMore: () => void;
    onDelete: (id: string) => void | Promise<void>;
    onUpdateNote: (id: string, note: string | null) => void | Promise<void>;
}

// Skeleton card
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 animate-pulse">
            <div className="flex gap-2">
                <div className="h-4 w-12 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
            </div>
            <div className="space-y-1.5">
                <div className="h-3.5 bg-slate-100 rounded w-full" />
                <div className="h-3.5 bg-slate-100 rounded w-5/6" />
                <div className="h-3.5 bg-slate-100 rounded w-3/4" />
            </div>
            <div className="h-3 bg-slate-100 rounded w-2/3" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="flex gap-2 pt-2 border-t border-slate-100">
                <div className="h-3 bg-slate-100 rounded w-24" />
                <div className="flex gap-1 ml-auto">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-7 h-7 bg-slate-100 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function BookmarkGrid({
                                 items,
                                 hasNext,
                                 isLoadingMore,
                                 isRefreshing,
                                 error,
                                 onLoadMore,
                                 onDelete,
                                 onUpdateNote,
                             }: BookmarkGridProps) {
    const sentinelRef = useInfiniteScroll(onLoadMore, hasNext && !isLoadingMore && !isRefreshing);

    // ── Error state ─────────────────────────────────────────────────────────────
    if (error && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
                        <path d="M12 8v5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="12" cy="16.5" r="1.2" fill="#ef4444" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">Could not load bookmarks</p>
                <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
        );
    }

    // ── Initial loading skeleton ─────────────────────────────────────────────────
    if (isRefreshing && items.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    // ── Empty state ──────────────────────────────────────────────────────────────
    if (!isRefreshing && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="font-serif text-lg text-slate-700 mb-1">No bookmarks yet</h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                    Save papers while reading to build your personal research library.
                </p>
            </div>
        );
    }
    console.log("GRID ITEMS", items.map((item) => item.title));
    return (
        <div>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((bookmark) => (
                    <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        onDelete={onDelete}
                        onUpdateNote={onUpdateNote}
                    />
                ))}

                {/* Loading more skeletons */}
                {isLoadingMore &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={`skeleton-${i}`} />
                    ))}
            </div>

            {/* Infinite scroll sentinel — invisible trigger element */}
            {hasNext && !isRefreshing && (
                <div ref={sentinelRef} className="h-4 mt-4" aria-hidden />
            )}

            {/* End of list indicator */}
            {!hasNext && items.length > 0 && (
                <p className="text-center text-xs text-slate-400 py-8">
                    You've reached the end of your bookmark library.
                </p>
            )}
        </div>
    );
}
