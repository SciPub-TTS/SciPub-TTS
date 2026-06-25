export interface CreateBookmarkRequest {
  openAlexId: string;
  titleSnapshot?: string;
  authorsSnapshot?: string;
  authorOpenAlexIdsSnapshot?: Array<string | null>;
  sourceSnapshot?: string;
  topicSnapshot?: string;
  topicOpenAlexIdSnapshot?: string;
  publicationYear?: number;
  citationSnapshot?: number;
  note?: string;
}

export interface CreateBookmarkCollectionRequest {
  name: string;
}

export interface UpdateBookmarkNoteRequest {
  note: string | null;
}

export interface UpdateBookmarkCollectionItemsRequest {
  bookmarkIds: string[];
}

export interface BookmarkCollectionSummary {
  id: string;
  name: string;
}

export interface BookmarkCollectionResponse extends BookmarkCollectionSummary {
  workCount: number;
  createdAt: string;
}

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
  collections: BookmarkCollectionSummary[];
  createdAt: string;
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
  collectionId: string | null;
}
