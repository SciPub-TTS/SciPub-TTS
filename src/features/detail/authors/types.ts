import type { PaperResult } from "@/features/search/types";

export type AuthorRelatedTopic = {
  id: string;
  displayName: string;
  count: number | null;
};

export type AuthorYearStat = {
  year: number;
  worksCount: number;
  citedByCount: number;
};

export type AuthorDetailData = {
  entityType: "authors";
  id: string;
  displayName: string;
  worksCount: number;
  citedByCount: number;
  works: PaperResult[];
  countsByYear: AuthorYearStat[];
  hIndex: number | null;
  i10Index: number | null;
  observedInstitutions: string[];
  observedNames: string[];
  orcid: string | null;
  primaryInstitutionName: string | null;
  topicHighlights: AuthorRelatedTopic[];
};
