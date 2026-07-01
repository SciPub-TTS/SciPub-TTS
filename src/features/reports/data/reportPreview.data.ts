import type { ReportExportField } from "@/features/reports/types";

export const REPORT_EXPORT_FIELDS: ReportExportField[] = [
  { key: "TITLE", label: "Title", description: "Full paper title", group: "Core details" },
  { key: "AUTHORS", label: "Author", description: "All credited authors", group: "Core details" },
  { key: "YEAR", label: "Year", description: "Publication year", group: "Core details" },
  { key: "CITATION_COUNT", label: "Citation count", description: "Current citation total", group: "Core details" },
  { key: "DOI", label: "DOI", description: "Digital object identifier", group: "Core details" },
  { key: "TYPE", label: "Type", description: "Article, review, or dataset", group: "Core details" },
  { key: "OPEN_ACCESS", label: "Open access", description: "Open-access availability", group: "Research context" },
  { key: "FIELD", label: "Field", description: "Primary research field", group: "Research context" },
  { key: "DOMAIN", label: "Domain", description: "Broad academic domain", group: "Research context" },
  { key: "SUBFIELD", label: "Subfield", description: "Primary research subfield", group: "Research context" },
  { key: "INSTITUTION", label: "Institution", description: "Affiliated institutions", group: "Research context" },
  { key: "COUNTRY", label: "Country", description: "Author country codes", group: "Research context" },
  { key: "TOPIC", label: "Topic", description: "OpenAlex topic labels", group: "Discovery" },
  { key: "KEYWORD", label: "Keyword", description: "Indexed keywords", group: "Discovery" },
  { key: "ABSTRACT", label: "Abstract", description: "Full abstract text", group: "Discovery" },
];

export const DEFAULT_REPORT_FIELDS = [
  "TITLE",
  "AUTHORS",
  "YEAR",
  "CITATION_COUNT",
  "DOI",
] as const;
