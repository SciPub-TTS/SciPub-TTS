import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import { SEARCH_RECENT_SEARCH_LIMIT } from "../constants";
import type { SavedSearch } from "../types";
import type { SearchHistoryApiItem } from "./types";

export async function getRecentSearches(
  keyword = "",
  limit = SEARCH_RECENT_SEARCH_LIMIT,
): Promise<SavedSearch[]> {
  const normalizedKeyword = keyword.trim();
  const response = await http.get<ApiResponse<SearchHistoryApiItem[]>>(
    "/api/search/history/recent",
    {
      params: {
        keyword: normalizedKeyword,
        limit,
      },
    },
  );
  const data = response.data.data;

  return data.map((item) => ({
    id: item.id,
    query: item.query,
    savedAt: item.savedAt || "",
  }));
}

export async function saveSearchHistory(query: string): Promise<void> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return;
  }

  await http.post<ApiResponse<null>>("/api/search/history", {
      query: normalizedQuery,
  });
}

export async function deleteSearchHistory(query: string): Promise<void> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return;
  }

  await http.delete<ApiResponse<null>>("/api/search/history", {
    params: {
      query: normalizedQuery,
    },
  });
}

export async function clearSearchHistory(): Promise<void> {
  await http.delete<ApiResponse<null>>("/api/search/history/all");
}
