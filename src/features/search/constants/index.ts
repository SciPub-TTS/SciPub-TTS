import type { SearchFilters } from "../types";

export const searchTabs = ["Works"];

export const resultSortOptions = [
  "Latest",
  "Most cited",
  "Trending",
];

export const suggestedSearches = [
  "Topic 1",
  "Topic 2",
  "Topic 3",
  "Topic 4",
  "Topic 5",
  "Topic 6",
  "Topic 7",
];

export const currentYear = new Date().getFullYear();
export const minimumYear = 1900;

export const multiFilterOptions = {
  type: ["Journal article", "Conference paper", "Preprint", "Dataset"],
  subField: ["Machine Learning", "NLP", "Computer Vision", "Bioinformatics"],
  author: ["Yoshua Bengio", "Geoffrey Hinton", "Yann LeCun", "Fei-Fei Li"],
  institution: ["FPT University", "Stanford", "MIT", "National University"],
  country: ["Vietnam", "United States", "Japan", "Singapore"],
  source: ["OpenAlex", "Crossref", "PubMed", "Scopus", "Web of Science"],
  award: ["Best Paper", "Highly Cited", "Editor's Choice", "Open Science"],
};

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
  citationMode: "range",
  citationMin: "",
  citationMax: "",
  citationExact: "",
  source: [],
  award: [],
  indexedByOrcid: "",
};
