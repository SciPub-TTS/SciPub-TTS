import type { PaperResult } from "@/features/search/types";

export type TopicRelatedItem = {
  id: string;
  displayName: string;
  count: number | null;
};

export type TopicYearStat = {
  year: number;
  worksCount: number;
  citedByCount: number;
};

export type TopicTypeBreakdownItem = {
  value: string;
  label: string;
  count: number;
};

export type TopicDetailData = {
  entityType: "topics";
  id: string;
  displayName: string;
  worksCount: number;
  citedByCount: number;
  works: PaperResult[];
  countsByYear: TopicYearStat[];
  description: string | null;
  domainName: string | null;
  fieldName: string | null;
  siblingTopics: TopicRelatedItem[];
  subfieldName: string | null;
  typeBreakdown: TopicTypeBreakdownItem[];
};
