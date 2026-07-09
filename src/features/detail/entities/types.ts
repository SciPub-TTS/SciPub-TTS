import type { PaperResult } from "@/features/search/types";
import type { SearchWorksApiItem } from "@/features/search/services/types";

export type EntityDetailType = "authors" | "topics";

export type EntityDetailRelatedItem = {
  id: string;
  displayName: string;
  count: number | null;
};

export type EntityDetailYearStat = {
  year: number;
  worksCount: number;
  citedByCount: number;
};

export type EntityDetailTypeBreakdownItem = {
  value: string;
  label: string;
  count: number;
};

export type EntityDetailApiResponse = {
  entityType: EntityDetailType;
  id: string;
  displayName: string;
  description: string | null;
  orcid: string | null;
  primaryInstitutionName: string | null;
  subfieldName: string | null;
  fieldName: string | null;
  domainName: string | null;
  worksCount: number;
  citedByCount: number;
  hIndex: number | null;
  i10Index: number | null;
  observedNames: string[];
  observedInstitutions: string[];
  topicHighlights: EntityDetailRelatedItem[];
  siblingTopics: EntityDetailRelatedItem[];
  countsByYear: EntityDetailYearStat[];
  typeBreakdown: EntityDetailTypeBreakdownItem[];
  works: SearchWorksApiItem[];
};

type EntityDetailBaseData = {
  entityType: EntityDetailType;
  id: string;
  displayName: string;
  worksCount: number;
  citedByCount: number;
  works: PaperResult[];
  countsByYear: EntityDetailYearStat[];
};

export type AuthorDetailData = EntityDetailBaseData & {
  entityType: "authors";
  hIndex: number | null;
  i10Index: number | null;
  observedInstitutions: string[];
  observedNames: string[];
  orcid: string | null;
  primaryInstitutionName: string | null;
  topicHighlights: EntityDetailRelatedItem[];
};

export type TopicDetailData = EntityDetailBaseData & {
  entityType: "topics";
  description: string | null;
  domainName: string | null;
  fieldName: string | null;
  siblingTopics: EntityDetailRelatedItem[];
  subfieldName: string | null;
  typeBreakdown: EntityDetailTypeBreakdownItem[];
};

export type EntityDetailData = AuthorDetailData | TopicDetailData;
