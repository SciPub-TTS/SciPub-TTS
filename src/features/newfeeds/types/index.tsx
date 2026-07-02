import type { PaperResult } from "@/features/search/types";

export type FeedTabKey =
  | "all"
  | "matched-topic"
  | "matched-author";

export type FeedTab = {
  key: FeedTabKey;
  label: string;
};

export type FeedExactMatchType = "AUTHOR" | "TOPIC";

export type FeedExactMatchFilter = {
  id: string;
  name: string;
  type: FeedExactMatchType;
};

export type FeedArticle = PaperResult & {
  relevance: number;
  reason: string;
  tabMatches: FeedTabKey[];
};

export type FollowedTopic = {
  id: string;
  name: string;
};

export type FollowedAuthor = {
  id: string;
  name: string;
};

export type ResearchFeedData = {
  articles: FeedArticle[];
  followedAuthors: FollowedAuthor[];
  followedTopics: FollowedTopic[];
  tabs: FeedTab[];
};
