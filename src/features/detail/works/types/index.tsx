export type ResponseEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

export type OpenAlexNamedEntity = {
  id: string;
  display_name: string;
};

export type OpenAlexInstitution = OpenAlexNamedEntity & {
  country_code: string | null;
  ror: string | null;
  type: string | null;
};

export type OpenAlexSource = OpenAlexNamedEntity & {
  host_organization_name: string | null;
  issn: string[] | null;
  issn_l: string | null;
  type: string | null;
};

export type OpenAlexLocation = {
  is_oa: boolean | null;
  landing_page_url: string | null;
  license: string | null;
  pdf_url: string | null;
  source: OpenAlexSource | null;
  version: string | null;
  is_accepted: boolean | null;
  is_published: boolean | null;
  raw_type: string | null;
};

export type OpenAlexTopic = OpenAlexNamedEntity & {
  score: number | null;
  subfield: OpenAlexNamedEntity | null;
  field: OpenAlexNamedEntity | null;
  domain: OpenAlexNamedEntity | null;
};

export type OpenAlexKeyword = OpenAlexNamedEntity & {
  score: number | null;
};

export type OpenAlexAward = {
  display_name?: string | null;
  funder_award_id?: string | null;
  funder_display_name?: string | null;
  name?: string | null;
  title?: string | null;
};

export type OpenAlexAuthorship = {
  author_position: string | null;
  author: (OpenAlexNamedEntity & { orcid: string | null }) | null;
  countries?: string[];
  institutions: OpenAlexInstitution[];
  is_corresponding: boolean | null;
  raw_author_name?: string | null;
};

export type OpenAlexWorkIdMap = {
  doi: string | null;
  mag: string | null;
  openalex: string | null;
  pmid: string | null;
};

export type OpenAlexCitationPercentile = {
  is_in_top_1_percent: boolean;
  is_in_top_10_percent: boolean;
  value: number;
};

export type OpenAlexCountByYear = {
  year: number;
  cited_by_count: number;
};

export type OpenAlexApc = {
  currency: string | null;
  value: number | null;
  value_usd: number | null;
};

export type OpenAlexContentAvailability = {
  grobid_xml: boolean | null;
  pdf: boolean | null;
};

export type OpenAlexContentUrls = {
  grobid_xml?: string | null;
  pdf?: string | null;
};

export type OpenAlexBiblio = {
  first_page: string | null;
  issue: string | null;
  last_page: string | null;
  volume: string | null;
};

export type OpenAlexAbstractInvertedIndex = Record<string, number[]>;

export type OpenAlexWorkDetailApi = {
  abstract_inverted_index: OpenAlexAbstractInvertedIndex | null;
  apc_list: OpenAlexApc | null;
  apc_paid: OpenAlexApc | null;
  authorships: OpenAlexAuthorship[];
  awards?: OpenAlexAward[];
  best_oa_location: OpenAlexLocation | null;
  biblio: OpenAlexBiblio | null;
  citation_normalized_percentile: OpenAlexCitationPercentile | null;
  cited_by_count: number | null;
  content_urls: OpenAlexContentUrls | null;
  counts_by_year: OpenAlexCountByYear[];
  doi: string | null;
  fwci: number | null;
  has_content: OpenAlexContentAvailability | null;
  id: string;
  ids: OpenAlexWorkIdMap | null;
  indexed_in: string[];
  is_retracted: boolean | null;
  keywords: OpenAlexKeyword[];
  language: string | null;
  locations_count: number | null;
  locations: OpenAlexLocation[];
  open_access: {
    any_repository_has_fulltext: boolean | null;
    is_oa: boolean | null;
    oa_status: string | null;
    oa_url: string | null;
  } | null;
  primary_location: OpenAlexLocation | null;
  primary_topic: OpenAlexTopic | null;
  publication_date: string | null;
  publication_year: number | null;
  referenced_work_details?: OpenAlexWorkReferenceApi[];
  referenced_works: string[];
  referenced_works_count: number | null;
  related_work_details?: OpenAlexWorkReferenceApi[];
  related_works: string[];
  title: string | null;
  topics: OpenAlexTopic[];
  type: string | null;
};

export type OpenAlexWorkReferenceApi = {
  id: string;
  title: string | null;
};

export type PaperDetailSummaryItem = {
  label: string;
  value: string;
  href?: string;
};

export type PaperDetailMetric = {
  label: string;
  value: string;
};

export type PaperDetailImpactChartItem = {
  citations: number;
  year: number;
};

export type PaperDetailImpactPieChartItem = {
  color: string;
  label: string;
  value: number;
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
  label: string;
  tone: "default" | "accent" | "topic" | "topicTrend";
  entityId?: string;
  entityType?: "topic";
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
  isFollowed?: boolean;
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
  impactChartItems: PaperDetailImpactChartItem[];
  impactPieChartItems: PaperDetailImpactPieChartItem[];
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
