export type FeedTabKey =
  | "all"
  | "matched-topic"
  | "matched-author"
  | "matched-both"
  | "latest"
  | "trending"
  | "most-relevant";

export type FeedTab = {
  key: FeedTabKey;
  label: string;
};

export type FeedBadge = {
  label: string;
  tone: "author" | "match" | "rising" | "stable" | "topic";
};

export type FeedAuthor = {
  following?: boolean;
  name: string;
};

export type FeedArticle = {
  abstract: string;
  authors: FeedAuthor[];
  badges: FeedBadge[];
  citations: number;
  doiLabel: string;
  doiUrl: string;
  extraAuthors?: number;
  id: string;
  relevance: number;
  reason: string;
  tabMatches: FeedTabKey[];
  tags: string[];
  title: string;
  venue: string;
  year: number;
};

export type FollowedTopic = {
  name: string;
  status: "Rising" | "Stable";
};

export type FollowedAuthor = {
  field: string;
  name: string;
};

export type SuggestedTopic = {
  name: string;
};

export type ResearchFeedData = {
  articles: FeedArticle[];
  followedAuthors: FollowedAuthor[];
  followedTopics: FollowedTopic[];
  suggestedTopics: SuggestedTopic[];
  tabs: FeedTab[];
};
