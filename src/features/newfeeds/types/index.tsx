export type FeedTabKey =
  | "all"
  | "matched-topic"
  | "matched-author";

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
  authors: FeedAuthor[];
  badges: FeedBadge[];
  citations: number;
  doiLabel: string;
  doiUrl: string;
  extraAuthors?: number;
  id: string;
  relevance: number;
  reason: string;
  source: string;
  tabMatches: FeedTabKey[];
  tags: string[];
  title: string;
  year: number;
};

export type FollowedTopic = {
  id: string;
  name: string;
};

export type FollowedAuthor = {
  id: string;
  name: string;
};

export type SuggestedTopic = {
  id: string;
  name: string;
};

export type ResearchFeedData = {
  articles: FeedArticle[];
  followedAuthors: FollowedAuthor[];
  followedTopics: FollowedTopic[];
  suggestedTopics: SuggestedTopic[];
  tabs: FeedTab[];
};
