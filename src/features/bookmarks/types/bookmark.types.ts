export interface CreateBookmarkRequest {
  openAlexId: string;
  titleSnapshot?: string;
  authorsSnapshot?: string;
  authorOpenAlexIdsSnapshot?: Array<string | null>;
  workTypeSnapshot?: string;
  sourceSnapshot?: string;
  topicSnapshot?: string;
  topicOpenAlexIdSnapshot?: string;
  publicationYear?: number;
  citationSnapshot?: number;
}

export interface CreateBookmarkCollectionRequest {
  name: string;
}

export interface UpdateBookmarkCollectionItemsRequest {
  bookmarkIds: string[];
}

export interface BookmarkCollectionResponse {
  id: string;
  name: string;
  workCount: number;
}

export interface BookmarkResponse {
  id: string;
  openAlexId: string;
  title: string;
  authors: string;
  workType: string | null;
  topic: string;
  publicationYear: number | null;
  citationCount: number | null;
  collections: BookmarkCollectionResponse[];
  createdAt: string;
}

export interface BookmarkPageResponse {
  items: BookmarkResponse[];
  page: number;
  totalElements: number;
  hasNext: boolean;
}

export interface BookmarkStatusResponse {
  bookmarked: boolean;
  bookmarkId: string | null;
  openAlexId: string;
  collections: BookmarkCollectionResponse[];
}

export interface BookmarkFilters {
  keyword: string;
  collectionId: string | null;
}
