export interface SocialAuthorInfo {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
}

export interface SocialPostReferenceInfo {
  id: string;
  openalexId: string;
  titleSnapshot: string;
  authorsSnapshot: string;
  authorOpenAlexIdsSnapshot: Array<string | null>;
  workTypeSnapshot: string | null;
  topicSnapshot: string | null;
  topicOpenAlexIdSnapshot: string | null;
  yearSnapshot: number | null;
}

export interface SocialPostSummary {
  id: string;
  title: string;
  bodyPreview: string;
  topicTag: string[];
  references: SocialPostReferenceInfo[];
  likeCount: number;
  liked: boolean;
  author: SocialAuthorInfo;
  createdAt: string;
  updatedAt: string | null;
}

export interface SocialPostDetail {
  id: string;
  title: string;
  body: string;
  topicTag: string[];
  likeCount: number;
  liked: boolean;
  author: SocialAuthorInfo;
  references: SocialPostReferenceInfo[];
  createdAt: string;
  updatedAt: string | null;
}

export interface SocialPostPageResponse {
  content: SocialPostSummary[];
  totalElements: number;
}

export interface CreateSocialPostRequest {
  title: string;
  body: string;
  topicTag: string | null;
  references: string[];
}

export interface UpdateSocialPostRequest {
  title: string;
  body: string;
  topicTag: string | null;
  references: string[];
}

export type CreateSocialPostResponse = SocialPostDetail;

export type UpdateSocialPostResponse = SocialPostDetail;

export type SocialPostDetailResponse = SocialPostDetail;

export interface LikeToggleResponse {
  liked: boolean;
  likeCount: number;
}

export type FeedTab = "all" | "my-posts";

export type SortMode = "newest" | "most-liked";

export type BlogModalMode = "create" | "edit";

export type BlogFormState = {
  title: string;
  body: string;
  selectedOpenAlexIds: string[];
};
