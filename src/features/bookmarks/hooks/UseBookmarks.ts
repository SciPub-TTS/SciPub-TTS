import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import type {
  BookmarkFilters,
  BookmarkPageResponse,
  BookmarkResponse,
} from "@/features/bookmarks/types/bookmark.types";

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: BookmarkFilters = {
  author: "",
  keyword: "",
  sort: "RECENT",
  source: "",
  topic: "",
  year: null,
};

type BookmarkMutationContext = {
  previousBookmarks?: InfiniteData<BookmarkPageResponse>;
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

function updateInfiniteBookmarkPages(
  cachedData: InfiniteData<BookmarkPageResponse> | undefined,
  updater: (bookmark: BookmarkResponse) => BookmarkResponse | null,
) {
  if (!cachedData) {
    return cachedData;
  }

  let removedItemCount = 0;

  for (const page of cachedData.pages) {
    for (const bookmark of page.items) {
      if (updater(bookmark) === null) {
        removedItemCount += 1;
      }
    }
  }

  return {
    ...cachedData,
    pages: cachedData.pages.map((page) => {
      const nextItems: BookmarkResponse[] = [];

      for (const bookmark of page.items) {
        const updatedBookmark = updater(bookmark);

        if (updatedBookmark) {
          nextItems.push(updatedBookmark);
        }
      }

      return {
        ...page,
        items: nextItems,
        totalElements: removedItemCount > 0
          ? Math.max(0, page.totalElements - removedItemCount)
          : page.totalElements,
      };
    }),
  };
}

export function useBookmarks() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BookmarkFilters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);
  const bookmarkListQueryKey = bookmarkQueryKeys.list(filters);
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
        author: filters.author,
        keyword: filters.keyword,
        page: Number(pageParam),
        size: PAGE_SIZE,
        sort: filters.sort,
        source: filters.source,
        topic: filters.topic,
        year: filters.year,
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
    mutationFn: (bookmarkId: string) => bookmarkApi.deleteById(bookmarkId),
    onError: (mutationError, bookmarkId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkListQueryKey, context.previousBookmarks);
      }

      void queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.stats(),
      });
      void queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.filterOptions(),
      });
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
      void queryClient.invalidateQueries({ queryKey: bookmarkListQueryKey });
      void queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.stats(),
      });
      void queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.filterOptions(),
      });
    },
  });
  const updateNoteMutation = useMutation<
    Awaited<ReturnType<typeof bookmarkApi.updateNote>>,
    Error,
    {
      bookmarkId: string;
      note: string | null;
    },
    BookmarkMutationContext
  >({
    mutationFn: ({
      bookmarkId,
      note,
    }: {
      bookmarkId: string;
      note: string | null;
    }) =>
      bookmarkApi.updateNote(bookmarkId, {
        note,
      }),
    onError: (mutationError, variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(bookmarkListQueryKey, context.previousBookmarks);
      }

      setError(
        getMutationErrorMessage(
          mutationError,
          `Cannot update note for bookmark ${variables.bookmarkId}.`,
        ),
      );
    },
    onMutate: async ({ bookmarkId, note }) => {
      setError(null);
      await queryClient.cancelQueries({ queryKey: bookmarkListQueryKey });

      const previousBookmarks = queryClient.getQueryData<
        InfiniteData<BookmarkPageResponse>
      >(bookmarkListQueryKey);

      queryClient.setQueryData<InfiniteData<BookmarkPageResponse> | undefined>(
        bookmarkListQueryKey,
        (cachedData) =>
          updateInfiniteBookmarkPages(cachedData, (bookmark) =>
            bookmark.id === bookmarkId
              ? { ...bookmark, note }
              : bookmark,
          ),
      );

      return { previousBookmarks };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookmarkListQueryKey });
    },
  });

  const items = useMemo(
    () =>
      (bookmarkListQuery.data?.pages || []).flatMap((page: BookmarkPageResponse) =>
        page.items,
      ),
    [bookmarkListQuery.data],
  );
  const firstPage = bookmarkListQuery.data?.pages[0] ?? null;
  const totalElements = firstPage?.totalElements ?? 0;
  const hasNext = Boolean(bookmarkListQuery.hasNextPage);
  const isLoadingMore = bookmarkListQuery.isFetchingNextPage;
  const isRefreshing =
    bookmarkListQuery.isPending
    || (bookmarkListQuery.isFetching && !bookmarkListQuery.isFetchingNextPage);

  useEffect(() => {
    if (bookmarkListQuery.error) {
      setError(mapQueryErrorToMessage(bookmarkListQuery.error));
    } else if (!deleteBookmarkMutation.isError && !updateNoteMutation.isError) {
      setError(null);
    }
  }, [
    bookmarkListQuery.error,
    deleteBookmarkMutation.isError,
    updateNoteMutation.isError,
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
    setFilters(DEFAULT_FILTERS);
  }

  async function deleteBookmark(bookmarkId: string) {
    await deleteBookmarkMutation.mutateAsync(bookmarkId);
  }

  async function updateNote(bookmarkId: string, note: string | null) {
    await updateNoteMutation.mutateAsync({
      bookmarkId,
      note,
    });
  }

  const reload = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: bookmarkListQueryKey });
  }, [bookmarkListQueryKey, queryClient]);

  return {
    deleteBookmark,
    error,
    filterOptions: bookmarkFilterOptionsQuery.data ?? null,
    filters,
    hasNext,
    isLoadingMore,
    isRefreshing,
    items,
    loadMore,
    reload,
    resetFilters,
    stats: bookmarkStatsQuery.data ?? null,
    totalElements,
    updateFilter,
    updateNote,
  };
}
