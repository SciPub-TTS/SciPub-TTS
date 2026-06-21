import { BookmarkCard } from "@/features/bookmarks/components/BookmarkCard";
import { useInfiniteScroll } from "@/features/bookmarks/hooks/UseInfiniteScroll.ts";
import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";

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

function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-2xl border border-black bg-white p-5 animate-pulse">
      <div className="flex gap-2">
        <div className="h-4 w-12 rounded bg-black/10" />
        <div className="h-4 w-20 rounded bg-black/10" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3.5 w-full rounded bg-black/10" />
        <div className="h-3.5 w-5/6 rounded bg-black/10" />
        <div className="h-3.5 w-3/4 rounded bg-black/10" />
      </div>
      <div className="h-3 w-2/3 rounded bg-black/10" />
      <div className="h-3 w-1/3 rounded bg-black/10" />
      <div className="flex gap-2 border-t border-black/10 pt-2">
        <div className="h-3 w-24 rounded bg-black/10" />
        <div className="ml-auto flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-7 rounded-lg bg-black/10" />
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
  const sentinelRef = useInfiniteScroll(
    onLoadMore,
    hasNext && !isLoadingMore && !isRefreshing,
  );

  if (error && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-black bg-red-50">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
            <path
              d="M12 8v5"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="1.2" fill="#ef4444" />
          </svg>
        </div>
        <p className="text-sm font-medium text-black">Could not load bookmarks</p>
        <p className="mt-1 text-xs text-black/45">{error}</p>
      </div>
    );
  }

  if (isRefreshing && items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!isRefreshing && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-black bg-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
              stroke="#F37021"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-title text-lg text-[#00AEEF]">No bookmarks yet</h3>
        <p className="font-subtext max-w-xs text-sm leading-relaxed text-black/55">
          Save papers while reading to build a colorful, searchable personal
          research library.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={onDelete}
            onUpdateNote={onUpdateNote}
          />
        ))}

        {isLoadingMore &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
      </div>

      {hasNext && !isRefreshing && (
        <div ref={sentinelRef} className="mt-4 h-4" aria-hidden />
      )}

      {!hasNext && items.length > 0 && (
        <p className="font-subtext py-8 text-center text-xs text-[#8B5E34]">
          You&apos;ve reached the end of your bookmark library.
        </p>
      )}
    </div>
  );
}
