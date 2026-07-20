export type PaperDetailSummaryItem = {
  href: string | null;
  label: string;
  value: string;
};

export type PaperDetailMetric = {
  label: string;
  value: string;
};

export type PaperDetailEntityRef = {
  id: string;
  name: string;
  type: "author" | "topic" | "institution" | "source";
};

export type PaperDetailWorkLink = {
  id: string;
  label: string;
};

export type PaperDetailBadge = {
  entityId: string | null;
  entityType: "topic" | null;
  label: string;
  tone: "default" | "accent" | "topic";
};

export type PaperDetailQuickLink = {
  href: string | null;
  label: string;
  value: string;
};

export type PaperDetailAuthor = {
  id: string;
  entityId: string | null;
  isCorresponding: boolean;
  isFollowed: boolean;
  name: string;
  orcid: string | null;
  position: string | null;
};

export type PaperDetailInstitution = {
  countryName: string | null;
  countryCode: string | null;
  id: string;
  name: string;
  type: string | null;
};

export type PaperDetailCountry = {
  code: string;
  name: string;
};

export type PaperDetailData = {
  abstractText: string;
  accessItems: PaperDetailSummaryItem[];
  authors: PaperDetailAuthor[];
  awards: string[];
  citationCount: number;
  doiHref: string | null;
  doiLabel: string;
  headerBadges: PaperDetailBadge[];
  indexedIn: string[];
  institutions: PaperDetailInstitution[];
  countries: PaperDetailCountry[];
  items: PaperDetailMetric[];
  keywords: string[];
  languageLabel: string;
  openAlexId: string;
  pdfUrl: string | null;
  publicationYear: number | null;
  publishedLabel: string;
  quickLinks: PaperDetailQuickLink[];
  referencedWorks: PaperDetailWorkLink[];
  relatedWorks: PaperDetailWorkLink[];
  source: PaperDetailEntityRef | null;
  sourceHostOrganization: string | null;
  sourceName: string;
  sourceType: string;
  title: string;
  topics: PaperDetailEntityRef[];
  workType: string;
};
