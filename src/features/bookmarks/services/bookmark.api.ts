import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
  BookmarkCollectionResponse,
  BookmarkPageResponse,
  BookmarkResponse,
  BookmarkStatsResponse,
  BookmarkStatusResponse,
  CreateBookmarkCollectionRequest,
  CreateBookmarkRequest,
  FilterOptionsResponse,
  SortOption,
  UpdateBookmarkCollectionItemsRequest,
} from "@/features/bookmarks/types/bookmark.types";

const BASE = "/api/bookmarks";
const DEFAULT_PAGE_SIZE = 12;

type BookmarkListParams = {
  page: number;
  size?: number;
  keyword?: string;
  topic?: string;
  source?: string;
  author?: string;
  year?: number | null;
  sort?: SortOption;
  collectionId?: string | null;
};

function normalizeQueryText(value?: string) {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}

export const bookmarkApi = {
  add(payload: CreateBookmarkRequest) {
    return http
      .post<ApiResponse<BookmarkResponse>>(BASE, payload)
      .then((res) => res.data);
  },

  getList(params: BookmarkListParams) {
    return http
      .get<ApiResponse<BookmarkPageResponse>>(BASE, {
        params: {
          author: normalizeQueryText(params.author),
          collectionId: params.collectionId ?? undefined,
          keyword: normalizeQueryText(params.keyword),
          page: params.page,
          size: params.size ?? DEFAULT_PAGE_SIZE,
          sort: params.sort ?? "RECENT",
          source: normalizeQueryText(params.source),
          topic: normalizeQueryText(params.topic),
          year: params.year ?? undefined,
        },
      })
      .then((res) => res.data);
  },

  getStatus(openAlexId: string) {
    return http
      .get<ApiResponse<BookmarkStatusResponse>>(`${BASE}/status`, {
        params: { openAlexId },
      })
      .then((res) => res.data);
  },

  getStats() {
    return http
      .get<ApiResponse<BookmarkStatsResponse>>(`${BASE}/stats`)
      .then((res) => res.data);
  },

  getFilterOptions() {
    return http
      .get<ApiResponse<FilterOptionsResponse>>(`${BASE}/filter-options`)
      .then((res) => res.data);
  },

  getCollections() {
    return http
      .get<ApiResponse<BookmarkCollectionResponse[]>>(`${BASE}/collections`)
      .then((res) => res.data);
  },

  createCollection(payload: CreateBookmarkCollectionRequest) {
    return http
      .post<ApiResponse<BookmarkCollectionResponse>>(
        `${BASE}/collections`,
        payload,
      )
      .then((res) => res.data);
  },

  deleteCollection(collectionId: string) {
    return http
      .delete<ApiResponse<null>>(`${BASE}/collections/${collectionId}`)
      .then((res) => res.data);
  },

  addToCollection(
    collectionId: string,
    payload: UpdateBookmarkCollectionItemsRequest,
  ) {
    return http
      .post<ApiResponse<null>>(
        `${BASE}/collections/${collectionId}/items`,
        payload,
      )
      .then((res) => res.data);
  },

  removeFromCollection(collectionId: string, bookmarkId: string) {
    return http
      .delete<ApiResponse<null>>(
        `${BASE}/collections/${collectionId}/items/${bookmarkId}`,
      )
      .then((res) => res.data);
  },

  deleteById(bookmarkId: string) {
    return http
      .delete<ApiResponse<null>>(`${BASE}/${bookmarkId}`)
      .then((res) => res.data);
  },

  deleteByOpenAlexId(openAlexId: string) {
    return http
      .delete<ApiResponse<null>>(`${BASE}/by-openalex/${openAlexId}`)
      .then((res) => res.data);
  },
};
