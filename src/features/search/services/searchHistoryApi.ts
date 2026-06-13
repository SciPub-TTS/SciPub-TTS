import { requestJson, createApiUrl } from "@/lib/api/fetchJson";
import { SEARCH_RECENT_SEARCH_LIMIT } from "../constants";
import type { SavedSearch } from "../types";
import type { SearchHistoryApiItem } from "./types";

export async function getRecentSearches(
  keyword = "",
  limit = SEARCH_RECENT_SEARCH_LIMIT,
): Promise<SavedSearch[]> {
  const normalizedKeyword = keyword.trim();
  const endpoint = createApiUrl("/api/search/history/recent");
  endpoint.searchParams.set("keyword", normalizedKeyword);
  endpoint.searchParams.set("limit", String(limit));

  const data = await requestJson<SearchHistoryApiItem[]>(endpoint);

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

  await requestJson<null>(createApiUrl("/api/search/history"), {
    method: "POST",
    body: JSON.stringify({
      query: normalizedQuery,
    }),
  });
}

export async function deleteSearchHistory(query: string): Promise<void> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return;
  }

  const endpoint = createApiUrl("/api/search/history");
  endpoint.searchParams.set("query", normalizedQuery);

  await requestJson<null>(endpoint, {
    method: "DELETE",
  });
}

export async function clearSearchHistory(): Promise<void> {
  await requestJson<null>(createApiUrl("/api/search/history/all"), {
    method: "DELETE",
  });
}
