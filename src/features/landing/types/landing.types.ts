export type LandingTopicPreviewItem = {
  topicId: string | null;
  name: string;
  fieldId: number | null;
  works: number | null;
  citations: number | null;
};

export type LandingKeywordPreviewItem = {
  keywordId: string | null;
  name: string;
  fieldId: number | null;
  works: number | null;
  citations: number | null;
};

export type LandingTrendPreview = {
  snapshotDate: string;
  totalTrendingTopics: number;
  totalTrendingKeywords: number;
  topTopics: LandingTopicPreviewItem[];
  topKeywords: LandingKeywordPreviewItem[];
};
