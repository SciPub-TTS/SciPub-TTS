// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateBookmarkRequest {
    openAlexId: string;
    titleSnapshot?: string;
    authorsSnapshot?: string;
    sourceSnapshot?: string;
    topicSnapshot?: string;
    publicationYear?: number;
    citationSnapshot?: number;
    note?: string;
}

export interface UpdateBookmarkNoteRequest {
    note: string | null;
}

// ─── Response types ───────────────────────────────────────────────────────────

export interface BookmarkResponse {
    id: string;
    openAlexId: string;
    title: string;
    authors: string;
    source: string;
    topic: string;
    publicationYear: number | null;
    citationCount: number | null;
    note: string | null;
    createdAt: string; // ISO OffsetDateTime
}

export interface BookmarkPageResponse {
    items: BookmarkResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}

export interface BookmarkStatsResponse {
    totalPapers: number;
    totalTopics: number;
    totalSources: number;
    totalAuthors: number;
}

export interface BookmarkStatusResponse {
    bookmarked: boolean;
    bookmarkId: string | null;
    openAlexId: string;
}

export interface FilterOptionsResponse {
    topics: string[];
    years: number[];
    sources: string[];
    authors: string[];
}

// ─── UI-only types ─────────────────────────────────────────────────────────────

export type SortOption =
    | "RECENT"
    | "OLDEST"
    | "YEAR_DESC"
    | "YEAR_ASC"
    | "CITATION_DESC"
    | "CITATION_ASC"
    | "TITLE_ASC"
    | "TITLE_DESC";

export interface BookmarkFilters {
    keyword: string;
    topic: string;
    source: string;
    author: string;
    year: number | null;
    sort: SortOption;
}
