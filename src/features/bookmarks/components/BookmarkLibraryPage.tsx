import { useBookmarks } from "@/features/bookmarks/hooks/UseBookmarks.ts";
import { BookmarkGrid } from "@/features/bookmarks/components/BookmarkGrid";
import { BookmarkPageHeader } from "@/features/bookmarks/components/BookmarkPageHeader";

export default function BookmarkLibraryPage() {
  const {
    items,
    totalElements,
    hasNext,
    isLoadingMore,
    isRefreshing,
    error,
    loadMore,
    deleteBookmark,
    updateNote,
  } = useBookmarks();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-6">
        <BookmarkPageHeader totalBookmarks={totalElements} />

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
