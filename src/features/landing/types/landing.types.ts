export interface LandingSummaryRequest {
  startTime: string;
  endTime: string;
  fieldId: string;
  formula: string;
}

export interface LandingKeyword {
  id: number;
  keywordId: string;
  name: string;
  fieldId: string;
  score: number;
  cagr: number;
  ps: number;
  worksCount: number;
  citedByCount: number;
}

export interface LandingTopic {
  name: string;
  topicId: string;
  works: number;
  citations: number;
  score: number;
  change: number | null;
  state: string | null;
  isFollowed: boolean;
}

export interface LandingTrendingPaper {
  openAlexId: string;
  title: string;
  authors: string;
  topic: string;
  citations: number;
  saveCount: number;
}

export interface LandingSummaryData {
  totalPapers?: number;
  totalTopics?: number;
  totalAuthors?: number;
  totalFields?: number;
  top1Keyword: LandingKeyword | null;
  top6Keywords: LandingKeyword[];
  top10Topics: LandingTopic[];
  top6TrendingPapers: LandingTrendingPaper[];
}
