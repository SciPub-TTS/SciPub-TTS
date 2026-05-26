export type SavedSearch = {
  id: string;
  query: string;
  savedAt: string;
};

export type PaperResult = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  citations: number;
  year: number;
  abstract: string;
  fullText: string;
  doi: string;
  tags: string[];
  field: string;
  topic: string;
  subField: string;
  growthPercent: number;
  isTrendTopic?: boolean;
  saved?: boolean;
  trend?: boolean;
};

export type SearchFilters = {
  yearMode: "range" | "exact";
  yearFrom: string;
  yearTo: string;
  yearExact: string;
  type: string[];
  openAccess: boolean;
  subField: string[];
  author: string[];
  institution: string[];
  pdf: boolean;
  country: string[];
  citationMode: "range" | "exact";
  citationMin: string;
  citationMax: string;
  citationExact: string;
  source: string[];
  award: string[];
  indexedByOrcid: "" | "is" | "is not";
};

export type SearchSummaryStats = {
  totalIndexedPapers: number;
  matchedPapers: number;
  latestUpdatedMinutesAgo: number;
  resultCount: number;
  responseTimeSeconds: number;
};
