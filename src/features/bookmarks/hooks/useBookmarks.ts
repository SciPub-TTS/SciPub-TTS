import { useCallback, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import {
  BOOKMARK_PAGE_SIZE,
  DEFAULT_BOOKMARK_FILTERS,
  invalidateBookmarkLibraryQueries,
} from "@/features/bookmarks/services/bookmarkQueryHelpers";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import type {
  BookmarkFilters,
  BookmarkPageResponse,
} from "@/features/bookmarks/types/bookmark.types";

function getMutationErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

function mapQueryErrorToMessage(error: unknown) {
  return getMutationErrorMessage(
    error,
    "Cannot load bookmarks. Please try again.",
  );
}

export function useBookmarks() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BookmarkFilters>(
    DEFAULT_BOOKMARK_FILTERS,
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const bookmarkListQueryKey = bookmarkQueryKeys.list(filters);

  const invalidateBookmarkLibrary = useCallback(() => {
    return invalidateBookmarkLibraryQueries(queryClient);
  }, [queryClient]);

  const bookmarkListQuery = useInfiniteQuery<
    BookmarkPageResponse,
    Error,
    InfiniteData<BookmarkPageResponse>,
    ReturnType<typeof bookmarkQueryKeys.list>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await bookmarkApi.getList({
        ...filters,
        page: Number(pageParam),
        size: BOOKMARK_PAGE_SIZE,
      });

      return response.data;
    },
    queryKey: bookmarkListQueryKey,
    retry: false,
  });

  const bookmarkCollectionsQuery = useQuery({
    queryFn: async () => {
      const response = await bookmarkApi.getCollections();
      return response.data;
    },
    queryKey: bookmarkQueryKeys.collections(),
    retry: false,
  });

  const deleteBookmarkMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.deleteById>>,
    Error,
    string
  >({
    mutationFn: (bookmarkId) => bookmarkApi.deleteById(bookmarkId),
    onError: (mutationError, bookmarkId) => {
      setMutationError(
        getMutationErrorMessage(
          mutationError,
          `Cannot delete bookmark ${bookmarkId}. Please try again.`,
        ),
      );
    },
    onMutate: () => {
      setMutationError(null);
    },
    onSuccess: () => {
      setMutationError(null);
      return invalidateBookmarkLibrary();
    },
  });

  const createCollectionMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.createCollection>>,
    Error,
    string
  >({
    mutationFn: (name) => bookmarkApi.createCollection({ name }),
    onError: (mutationError) => {
      setMutationError(
        getMutationErrorMessage(
          mutationError,
          "Cannot create collection right now.",
        ),
      );
    },
    onSuccess: () => {
      setMutationError(null);
      return invalidateBookmarkLibrary();
    },
  });

  const deleteCollectionMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.deleteCollection>>,
    Error,
    string
  >({
    mutationFn: (collectionId) => bookmarkApi.deleteCollection(collectionId),
    onError: (mutationError, collectionId) => {
      setMutationError(
        getMutationErrorMessage(
          mutationError,
          `Cannot delete collection ${collectionId}. Please try again.`,
        ),
      );
    },
    onMutate: () => {
      setMutationError(null);
    },
    onSuccess: (_response, collectionId) => {
      setMutationError(null);
      if (filters.collectionId === collectionId) {
        setFilters((previousFilters) => ({
          ...previousFilters,
          collectionId: null,
        }));
      }

      return invalidateBookmarkLibrary();
    },
  });

  const addToCollectionMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.addToCollection>>,
    Error,
    {
      bookmarkId: string;
      collectionId: string;
    }
  >({
    mutationFn: ({ bookmarkId, collectionId }) =>
      bookmarkApi.addToCollection(collectionId, {
        bookmarkIds: [bookmarkId],
      }),
    onError: (mutationError) => {
      setMutationError(
        getMutationErrorMessage(
          mutationError,
          "Cannot add this work to the collection.",
        ),
      );
    },
    onMutate: () => {
      setMutationError(null);
    },
    onSuccess: () => {
      setMutationError(null);
      return invalidateBookmarkLibrary();
    },
  });

  const removeFromCollectionMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.removeFromCollection>>,
    Error,
    {
      bookmarkId: string;
      collectionId: string;
    }
  >({
    mutationFn: ({ bookmarkId, collectionId }) =>
      bookmarkApi.removeFromCollection(collectionId, bookmarkId),
    onError: (mutationError) => {
      setMutationError(
        getMutationErrorMessage(
          mutationError,
          "Cannot remove this work from the collection.",
        ),
      );
    },
    onMutate: () => {
      setMutationError(null);
    },
    onSuccess: () => {
      setMutationError(null);
      return invalidateBookmarkLibrary();
    },
  });

  const items = useMemo(
    () => bookmarkListQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [bookmarkListQuery.data],
  );

  const firstPage = bookmarkListQuery.data?.pages[0] ?? null;
  const totalElements = firstPage?.totalElements ?? 0;
  const hasNext = Boolean(bookmarkListQuery.hasNextPage);
  const isLoadingMore = bookmarkListQuery.isFetchingNextPage;
  const isRefreshing =
    bookmarkListQuery.isPending ||
    (bookmarkListQuery.isFetching && !bookmarkListQuery.isFetchingNextPage);

  const queryError = useMemo(() => {
    if (bookmarkListQuery.error) {
      return mapQueryErrorToMessage(bookmarkListQuery.error);
    }

    if (bookmarkCollectionsQuery.error) {
      return mapQueryErrorToMessage(bookmarkCollectionsQuery.error);
    }

    return null;
  }, [
    bookmarkCollectionsQuery.error,
    bookmarkListQuery.error,
  ]);
  const error = queryError ?? mutationError;

  const loadMore = useCallback(() => {
    if (!hasNext || isLoadingMore || isRefreshing) {
      return;
    }

    void bookmarkListQuery.fetchNextPage();
  }, [bookmarkListQuery, hasNext, isLoadingMore, isRefreshing]);

  function updateFilter<K extends keyof BookmarkFilters>(
    key: K,
    value: BookmarkFilters[K],
  ) {
    setMutationError(null);
    setFilters((previousFilters) => ({
      ...previousFilters,
      [key]: value,
    }));
  }

  function resetFilters() {
    setMutationError(null);
    setFilters(DEFAULT_BOOKMARK_FILTERS);
  }

  async function deleteBookmark(bookmarkId: string) {
    await deleteBookmarkMutation.mutateAsync(bookmarkId);
  }

  async function createCollection(name: string) {
    const response = await createCollectionMutation.mutateAsync(name);
    return response.data;
  }

  async function addBookmarkToCollection(
    bookmarkId: string,
    collectionId: string,
  ) {
    await addToCollectionMutation.mutateAsync({
      bookmarkId,
      collectionId,
    });
  }

  async function removeBookmarkFromCollection(
    bookmarkId: string,
    collectionId: string,
  ) {
    await removeFromCollectionMutation.mutateAsync({
      bookmarkId,
      collectionId,
    });
  }

  async function deleteCollection(collectionId: string) {
    await deleteCollectionMutation.mutateAsync(collectionId);
  }

  const reload = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: bookmarkListQueryKey });
  }, [bookmarkListQueryKey, queryClient]);

  return {
    addBookmarkToCollection,
    collections: bookmarkCollectionsQuery.data ?? [],
    createCollection,
    deleteCollection,
    deleteBookmark,
    error,
    filters,
    hasNext,
    isCollectionMutating:
      createCollectionMutation.isPending ||
      deleteCollectionMutation.isPending ||
      addToCollectionMutation.isPending ||
      removeFromCollectionMutation.isPending,
    isCreatingCollection: createCollectionMutation.isPending,
    isDeletingCollection: deleteCollectionMutation.isPending,
    isLoadingMore,
    isRefreshing,
    items,
    loadMore,
    reload,
    removeBookmarkFromCollection,
    resetFilters,
    totalElements,
    updateFilter,
  };
}
