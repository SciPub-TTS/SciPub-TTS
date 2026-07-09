export type ReportExportFormat = "CSV" | "JSON";

export type ReportFieldGroup = "Core details" | "Research context" | "Discovery";

export type ReportExportField = {
  key:
    | "TITLE"
    | "AUTHORS"
    | "YEAR"
    | "CITATION_COUNT"
    | "OPEN_ACCESS"
    | "FIELD"
    | "DOMAIN"
    | "KEYWORD"
    | "SUBFIELD"
    | "TOPIC"
    | "INSTITUTION"
    | "COUNTRY"
    | "DOI"
    | "ABSTRACT"
    | "TYPE";
  label: string;
  description: string;
  group: ReportFieldGroup;
};

export type ReportExportRequest = {
  paperIds: string[];
  fields: ReportExportField["key"][];
  format: ReportExportFormat;
  includeMetadata: boolean;
  searchQuery: string;
};
