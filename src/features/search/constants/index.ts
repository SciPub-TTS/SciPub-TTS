import type { SearchFilters, SearchFilterWidgetKey } from "../types";

// Maximum number of filter options requested from the backend at one time.
export const SEARCH_FILTER_OPTION_LIMIT = 100;

// Number of papers returned by one search API request.
export const SEARCH_WORKS_PER_PAGE = 20;

// Position inside each loaded page that triggers the next search request.
// Example: page 1 loads papers 1-20, index 10 triggers page 2;
// page 2 loads papers 21-40, index 30 triggers page 3.
export const SEARCH_NEXT_QUERY_TRIGGER_OFFSET = 10;

// Number of recent searches requested for the search box history.
export const SEARCH_RECENT_SEARCH_LIMIT = 7;

// First page used by backend pagination.
export const SEARCH_DEFAULT_PAGE = 1;

// Lowest publication year accepted by the search filters.
export const SEARCH_MIN_YEAR = 1900;

// Lowest citation count accepted by the search filters.
export const SEARCH_MIN_CITATION = 0;

// Local form defaults. API-backed option lists live in services.
export const initialFilters: SearchFilters = {
  yearMode: "range",
  yearFrom: "",
  yearTo: "",
  yearExact: "",
  type: [],
  openAccess: false,
  subField: [],
  author: [],
  institution: [],
  pdf: false,
  country: [],
  primaryTopic: [],
  field: [],
  citationMode: "range",
  citationMin: "",
  citationMax: "",
  citationExact: "",
  source: [],
  award: [],
  indexedByOrcid: "",
};

export const defaultVisibleFilterWidgets: SearchFilterWidgetKey[] = [
];

