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
  likesReset: boolean;
}

export interface SocialPostPageResponse {
  content: SocialPostSummary[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
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
