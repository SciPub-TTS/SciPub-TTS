import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import type {
  BookmarkFilters,
  BookmarkPageResponse,
  BookmarkResponse,
} from "@/features/bookmarks/types/bookmark.types";

export const BOOKMARK_PAGE_SIZE = 12;

export const DEFAULT_BOOKMARK_FILTERS: BookmarkFilters = {
  author: "",
  collectionId: null,
  keyword: "",
  sort: "RECENT",
  source: "",
  topic: "",
  year: null,
};

export async function invalidateBookmarkLibraryQueries(
  queryClient: QueryClient,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.collections() }),
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.stats() }),
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.statuses() }),
    queryClient.invalidateQueries({
      queryKey: bookmarkQueryKeys.filterOptions(),
    }),
  ]);
}

export function updateInfiniteBookmarkPages(
  cachedData: InfiniteData<BookmarkPageResponse> | undefined,
  updater: (bookmark: BookmarkResponse) => BookmarkResponse | null,
) {
  if (!cachedData) {
    return cachedData;
  }

  let removedItemCount = 0;

  const pages = cachedData.pages.map((page) => {
    const nextItems: BookmarkResponse[] = [];

    for (const bookmark of page.items) {
      const updatedBookmark = updater(bookmark);

      if (updatedBookmark) {
        nextItems.push(updatedBookmark);
        continue;
      }

      removedItemCount += 1;
    }

    return {
      ...page,
      items: nextItems,
    };
  });

  if (removedItemCount === 0) {
    return {
      ...cachedData,
      pages,
    };
  }

  return {
    ...cachedData,
    pages: pages.map((page) => ({
      ...page,
      totalElements: Math.max(0, page.totalElements - removedItemCount),
    })),
  };
}
