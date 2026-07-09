import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import { SEARCH_WORKS_PER_PAGE } from "../constants";
import type { SearchFilters } from "../types";
import { mapApiWorkToPaperResult } from "./searchWorksMapper";
import { sortPaperResults } from "./searchWorksSorting";
import type {
  SearchWorksApiResponse,
  SearchWorksRequest,
  SearchWorksState,
} from "./types";

export async function searchWorks(
  request: SearchWorksRequest,
): Promise<SearchWorksState> {
  const params = buildSearchWorksParams(request);
  const response = await publicHttp.get<ApiResponse<SearchWorksApiResponse>>(
    "/api/search/works",
    { params },
  );
  const data = response.data.data;
  const works = data.results.map(mapApiWorkToPaperResult);

  return {
    entityType: "works",
    page: data.meta.page,
    perPage: data.meta.perPage,
    responseTimeSeconds: data.meta.dbResponseTimeMs / 1000,
    totalCount: data.meta.totalCount,
    works: sortPaperResults(works, request.sortState),
  };
}

function buildSearchWorksParams(request: SearchWorksRequest) {
  const params = new URLSearchParams();
  const { filters, optionValueLookup } = request;
  const { sortState } = request;

  appendIfFilled(params, "query", request.appliedSearchQuery.trim());

  if (hasActiveYearFilter(filters)) {
    appendIfFilled(params, "yearMode", filters.yearMode);

    if (filters.yearMode === "exact") {
      appendIfFilled(params, "yearExact", filters.yearExact);
    } else {
      appendIfFilled(params, "yearFrom", filters.yearFrom);
      appendIfFilled(params, "yearTo", filters.yearTo);
    }
  }

  appendMappedValues(params, "type", filters.type, optionValueLookup.type);

  if (filters.openAccess) {
    params.append("openAccess", "true");
  }

  appendMappedValues(
    params,
    "subField",
    filters.subField,
    optionValueLookup.subField,
  );
  appendMappedValues(
    params,
    "author",
    filters.author,
    optionValueLookup.author,
  );
  appendMappedValues(
    params,
    "institution",
    filters.institution,
    optionValueLookup.institution,
  );

  if (filters.pdf) {
    params.append("pdf", "true");
  }

  appendMappedValues(
    params,
    "country",
    filters.country,
    optionValueLookup.country,
  );

  if (hasActiveCitationFilter(filters)) {
    appendIfFilled(params, "citationMode", filters.citationMode);

    if (filters.citationMode === "exact") {
      appendIfFilled(params, "citationExact", filters.citationExact);
    } else {
      appendIfFilled(params, "citationMin", filters.citationMin);
      appendIfFilled(params, "citationMax", filters.citationMax);
    }
  }

  appendMappedValues(
    params,
    "source",
    filters.source,
    optionValueLookup.source,
  );
  appendMappedValues(
    params,
    "award",
    filters.award,
    optionValueLookup.award,
  );
  appendIfFilled(params, "indexedByOrcid", filters.indexedByOrcid);

  if (sortState.sortBy !== "relevance") {
    appendIfFilled(params, "sortBy", sortState.sortBy);
    appendIfFilled(params, "sortDirection", sortState.sortDirection);
  }

  params.set("page", String(request.page));
  params.set("perPage", String(SEARCH_WORKS_PER_PAGE));

  return params;
}

function hasActiveYearFilter(filters: SearchFilters) {
  if (filters.yearMode === "exact") {
    return Boolean(filters.yearExact.trim());
  }

  return Boolean(filters.yearFrom.trim() || filters.yearTo.trim());
}

function hasActiveCitationFilter(filters: SearchFilters) {
  if (filters.citationMode === "exact") {
    return Boolean(filters.citationExact.trim());
  }

  return Boolean(filters.citationMin.trim() || filters.citationMax.trim());
}

function appendIfFilled(params: URLSearchParams, key: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return;
  }

  params.append(key, normalizedValue);
}

function appendMappedValues(
  params: URLSearchParams,
  key: string,
  labels: string[],
  valueLookup: Record<string, string>,
) {
  for (const label of labels) {
    const value = valueLookup[label] || label;

    if (!value.trim()) {
      continue;
    }

    params.append(key, value);
  }
}
