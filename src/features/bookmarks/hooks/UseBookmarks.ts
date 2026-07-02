import { useCallback, useEffect, useMemo, useState } from "react";
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
  updateInfiniteBookmarkPages,
} from "@/features/bookmarks/services/bookmarkQueryHelpers";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import type {
  BookmarkCollectionResponse,
  BookmarkFilters,
  BookmarkPageResponse,
  BookmarkResponse,
} from "@/features/bookmarks/types/bookmark.types";

type BookmarkMutationContext = {
  previousBookmarks?: InfiniteData<BookmarkPageResponse>;
  previousCollections?: BookmarkCollectionResponse[];
};

function getMutationErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}

function mapQueryErrorToMessage(error: unknown) {
  return getMutationErrorMessage(
    error,
    "Cannot load bookmarks. Please try again.",
  );
}

function patchCollectionMembershipOnBookmarks(
  cachedData: InfiniteData<BookmarkPageResponse> | undefined,
  options: {
    bookmarkId: string;
    collectionId: string;
    collectionName?: string;
    mode: "add" | "remove";
  },
) {
  const { bookmarkId, collectionId, collectionName, mode } = options;

  return updateInfiniteBookmarkPages(cachedData, (bookmark) => {
    if (bookmark.id !== bookmarkId) {
      return bookmark;
    }

    const nextCollections =
      mode === "add"
        ? bookmark.collections.some((collection) => collection.id === collectionId)
          ? bookmark.collections
          : [
              ...bookmark.collections,
              {
                id: collectionId,
                name: collectionName ?? "Collection",
              },
            ]
        : bookmark.collections.filter((collection) => collection.id !== collectionId);

    return {
      ...bookmark,
      collections: nextCollections,
    } satisfies BookmarkResponse;
  });
}

function patchCollectionCounts(
  collections: BookmarkCollectionResponse[] | undefined,
  collectionId: string,
  mode: "add" | "remove",
) {
  if (!collections) {
    return collections;
  }

  return collections.map((collection) => {
    if (collection.id !== collectionId) {
      return collection;
    }

    return {
      ...collection,
      workCount:
        mode === "add"
          ? collection.workCount + 1
          : Math.max(0, collection.workCount - 1),
    };
  });
}

export function useBookmarks() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BookmarkFilters>(
    DEFAULT_BOOKMARK_FILTERS,
  );
  const [error, setError] = useState<string | null>(null);
  const bookmarkListQueryKey = bookmarkQueryKeys.list(filters);

  const invalidateBookmarkLibrary = useCallback(() => {
    void invalidateBookmarkLibraryQueries(queryClient);
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

  const bookmarkStatsQuery = useQuery({
    queryFn: async () => {
      const response = await bookmarkApi.getStats();
      return response.data;
    },
    queryKey: bookmarkQueryKeys.stats(),
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

  const bookmarkFilterOptionsQuery = useQuery({
    queryFn: async () => {
      const response = await bookmarkApi.getFilterOptions();
      return response.data;
    },
    queryKey: bookmarkQueryKeys.filterOptions(),
    retry: false,
  });

  const deleteBookmarkMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.deleteById>>,
    Error,
    string,
    BookmarkMutationContext
  >({
    mutationFn: (bookmarkId) => bookmarkApi.deleteById(bookmarkId),
    onError: (mutationError, bookmarkId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkListQueryKey, context.previousBookmarks);
      }

      invalidateBookmarkLibrary();
      setError(
        getMutationErrorMessage(
          mutationError,
          `Cannot delete bookmark ${bookmarkId}. Please try again.`,
        ),
      );
    },
    onMutate: async (bookmarkId) => {
      setError(null);
      await queryClient.cancelQueries({ queryKey: bookmarkListQueryKey });

      const previousBookmarks = queryClient.getQueryData<
        InfiniteData<BookmarkPageResponse>
      >(bookmarkListQueryKey);

      queryClient.setQueryData<InfiniteData<BookmarkPageResponse> | undefined>(
        bookmarkListQueryKey,
        (cachedData) =>
          updateInfiniteBookmarkPages(cachedData, (bookmark) =>
            bookmark.id === bookmarkId ? null : bookmark,
          ),
      );

      return { previousBookmarks };
    },
    onSettled: () => {
      invalidateBookmarkLibrary();
    },
  });

  const createCollectionMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.createCollection>>,
    Error,
    string
  >({
    mutationFn: (name) => bookmarkApi.createCollection({ name }),
    onError: (mutationError) => {
      setError(
        getMutationErrorMessage(
          mutationError,
          "Cannot create collection right now.",
        ),
      );
    },
    onSuccess: () => {
      invalidateBookmarkLibrary();
    },
  });

  const addToCollectionMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.addToCollection>>,
    Error,
    {
      bookmarkId: string;
      collectionId: string;
    },
    BookmarkMutationContext
  >({
    mutationFn: ({ bookmarkId, collectionId }) =>
      bookmarkApi.addToCollection(collectionId, {
        bookmarkIds: [bookmarkId],
      }),
    onError: (mutationError, _variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkListQueryKey, context.previousBookmarks);
      }

      if (context?.previousCollections) {
        queryClient.setQueryData(
          bookmarkQueryKeys.collections(),
          context.previousCollections,
        );
      }

      setError(
        getMutationErrorMessage(
          mutationError,
          "Cannot add this work to the collection.",
        ),
      );
    },
    onMutate: async ({ bookmarkId, collectionId }) => {
      setError(null);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: bookmarkListQueryKey }),
        queryClient.cancelQueries({ queryKey: bookmarkQueryKeys.collections() }),
      ]);

      const previousBookmarks = queryClient.getQueryData<
        InfiniteData<BookmarkPageResponse>
      >(bookmarkListQueryKey);
      const previousCollections = queryClient.getQueryData<
        BookmarkCollectionResponse[]
      >(bookmarkQueryKeys.collections());
      const targetCollection = previousCollections?.find(
        (collection) => collection.id === collectionId,
      );

      queryClient.setQueryData<InfiniteData<BookmarkPageResponse> | undefined>(
        bookmarkListQueryKey,
        (cachedData) =>
          patchCollectionMembershipOnBookmarks(cachedData, {
            bookmarkId,
            collectionId,
            collectionName: targetCollection?.name,
            mode: "add",
          }),
      );

      queryClient.setQueryData<BookmarkCollectionResponse[] | undefined>(
        bookmarkQueryKeys.collections(),
        (collections) => patchCollectionCounts(collections, collectionId, "add"),
      );

      return {
        previousBookmarks,
        previousCollections,
      };
    },
    onSuccess: () => {
      invalidateBookmarkLibrary();
    },
  });

  const removeFromCollectionMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.removeFromCollection>>,
    Error,
    {
      bookmarkId: string;
      collectionId: string;
    },
    BookmarkMutationContext
  >({
    mutationFn: ({ bookmarkId, collectionId }) =>
      bookmarkApi.removeFromCollection(collectionId, bookmarkId),
    onError: (mutationError, _variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkListQueryKey, context.previousBookmarks);
      }

      if (context?.previousCollections) {
        queryClient.setQueryData(
          bookmarkQueryKeys.collections(),
          context.previousCollections,
        );
      }

      setError(
        getMutationErrorMessage(
          mutationError,
          "Cannot remove this work from the collection.",
        ),
      );
    },
    onMutate: async ({ bookmarkId, collectionId }) => {
      setError(null);
      await Promise.all([
        queryClient.cancelQueries({ queryKey: bookmarkListQueryKey }),
        queryClient.cancelQueries({ queryKey: bookmarkQueryKeys.collections() }),
      ]);

      const previousBookmarks = queryClient.getQueryData<
        InfiniteData<BookmarkPageResponse>
      >(bookmarkListQueryKey);
      const previousCollections = queryClient.getQueryData<
        BookmarkCollectionResponse[]
      >(bookmarkQueryKeys.collections());

      queryClient.setQueryData<InfiniteData<BookmarkPageResponse> | undefined>(
        bookmarkListQueryKey,
        (cachedData) =>
          patchCollectionMembershipOnBookmarks(cachedData, {
            bookmarkId,
            collectionId,
            mode: "remove",
          }),
      );

      queryClient.setQueryData<BookmarkCollectionResponse[] | undefined>(
        bookmarkQueryKeys.collections(),
        (collections) => patchCollectionCounts(collections, collectionId, "remove"),
      );

      return {
        previousBookmarks,
        previousCollections,
      };
    },
    onSuccess: () => {
      invalidateBookmarkLibrary();
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

  useEffect(() => {
    if (bookmarkListQuery.error) {
      setError(mapQueryErrorToMessage(bookmarkListQuery.error));
      return;
    }

    if (bookmarkCollectionsQuery.error) {
      setError(mapQueryErrorToMessage(bookmarkCollectionsQuery.error));
      return;
    }

    if (
      !deleteBookmarkMutation.isError &&
      !createCollectionMutation.isError &&
      !addToCollectionMutation.isError &&
      !removeFromCollectionMutation.isError
    ) {
      setError(null);
    }
  }, [
    addToCollectionMutation.isError,
    bookmarkCollectionsQuery.error,
    bookmarkListQuery.error,
    createCollectionMutation.isError,
    deleteBookmarkMutation.isError,
    removeFromCollectionMutation.isError,
  ]);

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
    setError(null);
    setFilters((previousFilters) => ({
      ...previousFilters,
      [key]: value,
    }));
  }

  function resetFilters() {
    setError(null);
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

  const reload = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: bookmarkListQueryKey });
  }, [bookmarkListQueryKey, queryClient]);

  return {
    addBookmarkToCollection,
    collections: bookmarkCollectionsQuery.data ?? [],
    createCollection,
    deleteBookmark,
    error,
    filterOptions: bookmarkFilterOptionsQuery.data ?? null,
    filters,
    hasNext,
    isCollectionMutating:
      createCollectionMutation.isPending ||
      addToCollectionMutation.isPending ||
      removeFromCollectionMutation.isPending,
    isCreatingCollection: createCollectionMutation.isPending,
    isLoadingMore,
    isRefreshing,
    items,
    loadMore,
    reload,
    removeBookmarkFromCollection,
    resetFilters,
    stats: bookmarkStatsQuery.data ?? null,
    totalElements,
    updateFilter,
  };
}
