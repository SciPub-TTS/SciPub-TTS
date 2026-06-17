import type { BookmarkFilters } from "@/features/bookmarks/types/bookmark.types";

export const bookmarkQueryKeys = {
  all: ["bookmarks"] as const,
  filterOptions: () => [...bookmarkQueryKeys.all, "filter-options"] as const,
  list: (filters: BookmarkFilters) =>
    [...bookmarkQueryKeys.lists(), filters] as const,
  lists: () => [...bookmarkQueryKeys.all, "list"] as const,
  stats: () => [...bookmarkQueryKeys.all, "stats"] as const,
  status: (openAlexId: string) =>
    [...bookmarkQueryKeys.statuses(), openAlexId] as const,
  statuses: () => [...bookmarkQueryKeys.all, "status"] as const,
};
