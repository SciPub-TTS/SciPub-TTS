import { useEffect, useMemo, useState } from "react";

import { SafeActionDialog } from "@/components/SafeActionDialog";
import { BookmarkGrid } from "@/features/bookmarks/components/BookmarkGrid";
import { BookmarkPageHeader } from "@/features/bookmarks/components/BookmarkPageHeader";
import { BookmarkTopBar } from "@/features/bookmarks/components/BookmarkTopBar";
import { CreateCollectionModal } from "@/features/bookmarks/components/CreateCollectionModal";
import { useBookmarks } from "@/features/bookmarks/hooks/UseBookmarks";

export default function BookmarkLibraryPage() {
  const {
    addBookmarkToCollection,
    collections,
    createCollection,
    deleteBookmark,
    error,
    filters,
    hasNext,
    isCollectionMutating,
    isCreatingCollection,
    isLoadingMore,
    isRefreshing,
    items,
    loadMore,
    removeBookmarkFromCollection,
    totalElements,
    updateFilter,
    updateNote,
  } = useBookmarks();

  const [searchValue, setSearchValue] = useState(filters.keyword);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const [deleteDialogBookmarkId, setDeleteDialogBookmarkId] = useState<
    string | null
  >(null);
  const [deletingBookmarkId, setDeletingBookmarkId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setSearchValue(filters.keyword);
  }, [filters.keyword]);

  const selectedCollection = useMemo(
    () =>
      collections.find((collection) => collection.id === filters.collectionId) ??
      null,
    [collections, filters.collectionId],
  );

  const bookmarkPendingDelete = useMemo(
    () =>
      items.find((bookmark) => bookmark.id === deleteDialogBookmarkId) ?? null,
    [deleteDialogBookmarkId, items],
  );

  function handleSearchSubmit() {
    updateFilter("keyword", searchValue.trim());
  }

  function handleSearchClear() {
    setSearchValue("");
    updateFilter("keyword", "");
  }

  async function handleCreateCollection() {
    const trimmedName = collectionName.trim();

    if (!trimmedName) {
      setCollectionError("Please enter a name for the new collection.");
      return;
    }

    try {
      await createCollection(trimmedName);
      setCollectionError(null);
      setCollectionName("");
      setIsCreateModalOpen(false);
    } catch (createError) {
      setCollectionError(
        createError instanceof Error
          ? createError.message
          : "Cannot create collection right now.",
      );
    }
  }

  function handleRequestDeleteBookmark(bookmarkId: string) {
    if (deletingBookmarkId) {
      return;
    }

    setDeleteDialogBookmarkId(bookmarkId);
  }

  async function handleConfirmDeleteBookmark() {
    if (!deleteDialogBookmarkId || deletingBookmarkId) {
      return;
    }

    setDeletingBookmarkId(deleteDialogBookmarkId);

    try {
      await deleteBookmark(deleteDialogBookmarkId);
    } catch {
      // The hook already exposes the mutation error to the page state.
    } finally {
      setDeletingBookmarkId(null);
      setDeleteDialogBookmarkId(null);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-6 sm:px-6">
          <BookmarkPageHeader />

          <BookmarkTopBar
            collections={collections}
            error={error}
            onCollectionChange={(collectionId) =>
              updateFilter("collectionId", collectionId)
            }
            onCreateCollectionClick={() => {
              setCollectionError(null);
              setCollectionName("");
              setIsCreateModalOpen(true);
            }}
            onSearchChange={setSearchValue}
            onSearchClear={handleSearchClear}
            onSearchSubmit={handleSearchSubmit}
            searchValue={searchValue}
            selectedCollectionId={filters.collectionId}
            totalElements={totalElements}
            totalShowing={items.length}
          />

          <BookmarkGrid
            availableCollections={collections}
            error={error}
            hasNext={hasNext}
            isCollectionMutating={isCollectionMutating}
            isLoadingMore={isLoadingMore}
            isRefreshing={isRefreshing}
            items={items}
            onAddToCollection={addBookmarkToCollection}
            onDelete={handleRequestDeleteBookmark}
            onLoadMore={loadMore}
            onRemoveFromCollection={removeBookmarkFromCollection}
            onUpdateNote={updateNote}
            searchQuery={filters.keyword}
            selectedCollectionId={filters.collectionId}
            selectedCollectionName={selectedCollection?.name ?? null}
          />
        </div>

        <CreateCollectionModal
          error={collectionError}
          isOpen={isCreateModalOpen}
          isSubmitting={isCreatingCollection}
          name={collectionName}
          onChange={(value) => {
            setCollectionName(value);
            if (collectionError) {
              setCollectionError(null);
            }
          }}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCollectionError(null);
          }}
          onSubmit={() => {
            void handleCreateCollection();
          }}
        />
      </div>

      <SafeActionDialog
        confirmLabel="Delete bookmark"
        description={
          bookmarkPendingDelete
            ? `Remove "${bookmarkPendingDelete.title}" from your bookmark library? This action cannot be undone.`
            : "Remove this bookmark from your library? This action cannot be undone."
        }
        eyebrow="Safe delete"
        isPending={deletingBookmarkId !== null}
        onClose={() => {
          if (!deletingBookmarkId) {
            setDeleteDialogBookmarkId(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmDeleteBookmark();
        }}
        open={deleteDialogBookmarkId !== null}
        pendingLabel="Deleting bookmark..."
        title="Delete this bookmark?"
        variant="danger"
      />
    </>
  );
}
