import { useEffect, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";

import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import type { BookmarkPageResponse } from "@/features/bookmarks/types/bookmark.types";

const REPORT_BOOKMARK_PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 350;

type UseReportBookmarksParams = {
  collectionId: string | null;
  searchValue: string;
};

export function useReportBookmarks({
  collectionId,
  searchValue,
}: UseReportBookmarksParams) {
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearchValue(searchValue.trim()),
      SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  const bookmarksQuery = useInfiniteQuery<
    BookmarkPageResponse,
    Error,
    InfiniteData<BookmarkPageResponse>,
    readonly unknown[],
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await bookmarkApi.getList({
        collectionId,
        keyword: debouncedSearchValue,
        page: Number(pageParam),
        size: REPORT_BOOKMARK_PAGE_SIZE,
        sort: "RECENT",
      });

      return response.data;
    },
    queryKey: [
      "reports",
      "bookmarks",
      { collectionId, keyword: debouncedSearchValue },
    ],
    retry: false,
  });

  const collectionsQuery = useQuery({
    queryFn: async () => {
      const response = await bookmarkApi.getCollections();
      return response.data;
    },
    queryKey: bookmarkQueryKeys.collections(),
    retry: false,
  });

  const bookmarks = useMemo(
    () => bookmarksQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [bookmarksQuery.data],
  );
  const totalElements = bookmarksQuery.data?.pages[0]?.totalElements ?? 0;

  return {
    bookmarks,
    collections: collectionsQuery.data ?? [],
    error: bookmarksQuery.error,
    hasNext: Boolean(bookmarksQuery.hasNextPage),
    isLoading: bookmarksQuery.isPending,
    isLoadingCollections: collectionsQuery.isPending,
    isLoadingMore: bookmarksQuery.isFetchingNextPage,
    loadMore: bookmarksQuery.fetchNextPage,
    refetch: bookmarksQuery.refetch,
    totalElements,
  };
}
