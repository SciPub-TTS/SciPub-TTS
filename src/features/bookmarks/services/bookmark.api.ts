import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
    BookmarkPageResponse,
    BookmarkResponse,
    BookmarkStatsResponse,
    BookmarkStatusResponse,
    CreateBookmarkRequest,
    FilterOptionsResponse,
    SortOption,
    UpdateBookmarkNoteRequest,
} from "@/features/bookmarks/types/bookmark.types";
const BASE = "/api/bookmarks";

export const bookmarkApi = {
    // 1. Add bookmark
    add(payload: CreateBookmarkRequest) {
        return http
            .post<ApiResponse<BookmarkResponse>>(BASE, payload)
            .then((res) => res.data);
    },

    // 2. Get paginated bookmark list
    getList(params: {
        page: number;
        size?: number;
        keyword?: string;
        topic?: string;
        source?: string;
        author?: string;
        year?: number | null;
        sort?: SortOption;
    }) {
        return http
            .get<ApiResponse<BookmarkPageResponse>>(BASE, {
                params: {
                    page: params.page,
                    size: params.size ?? 12,
                    keyword: params.keyword || undefined,
                    topic: params.topic || undefined,
                    source: params.source || undefined,
                    author: params.author || undefined,
                    year: params.year ?? undefined,
                    sort: params.sort ?? "RECENT",
                },
            })
            .then((res) => res.data);
    },

    // 3. Check bookmark status by openAlexId
    getStatus(openAlexId: string) {
        return http
            .get<ApiResponse<BookmarkStatusResponse>>(`${BASE}/status`, {
                params: { openAlexId },
            })
            .then((res) => res.data);
    },

    // 4. Get stats
    getStats() {
        return http
            .get<ApiResponse<BookmarkStatsResponse>>(`${BASE}/stats`)
            .then((res) => res.data);
    },

    // 5. Get filter options
    getFilterOptions() {
        return http
            .get<ApiResponse<FilterOptionsResponse>>(`${BASE}/filter-options`)
            .then((res) => res.data);
    },

    // 6. Update note
    updateNote(bookmarkId: string, payload: UpdateBookmarkNoteRequest) {
        return http
            .patch<ApiResponse<BookmarkResponse>>(
                `${BASE}/${bookmarkId}/note`,
                payload,
            )
            .then((res) => res.data);
    },

    // 7. Delete by bookmark ID
    deleteById(bookmarkId: string) {
        return http
            .delete<ApiResponse<null>>(`${BASE}/${bookmarkId}`)
            .then((res) => res.data);
    },

    // 8. Delete by openAlexId
    deleteByOpenAlexId(openAlexId: string) {
        return http
            .delete<ApiResponse<null>>(`${BASE}/by-openalex/${openAlexId}`)
            .then((res) => res.data);
    },
};
