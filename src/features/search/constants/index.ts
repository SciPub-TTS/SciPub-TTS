import type { SearchFilters } from "../types";

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
  citationMode: "range",
  citationMin: "",
  citationMax: "",
  citationExact: "",
  source: [],
  award: [],
  indexedByOrcid: "",
};

/*
SEARCH_FILE_NOTE
Syntax su dung:
- File index trong module search dung de gom export hoac constants/types.
File nay lam gi:
- Giu vai tro diem tap trung import/export trong tung folder.
Flow chay:
- Cac file khac import tu index de gon duong dan va de maintain.
*/

