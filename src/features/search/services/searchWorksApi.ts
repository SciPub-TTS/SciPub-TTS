import { createApiUrl, requestPublicJson } from "@/lib/api/fetchJson";
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
  const endpoint = buildSearchWorksUrl(request);
  const data = await requestPublicJson<SearchWorksApiResponse>(endpoint);
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

function buildSearchWorksUrl(request: SearchWorksRequest) {
  const endpoint = createApiUrl("/api/search/works");
  const { filters, optionValueLookup } = request;
  const { sortState } = request;

  appendIfFilled(endpoint, "query", request.appliedSearchQuery.trim());

  if (hasActiveYearFilter(filters)) {
    appendIfFilled(endpoint, "yearMode", filters.yearMode);

    if (filters.yearMode === "exact") {
      appendIfFilled(endpoint, "yearExact", filters.yearExact);
    } else {
      appendIfFilled(endpoint, "yearFrom", filters.yearFrom);
      appendIfFilled(endpoint, "yearTo", filters.yearTo);
    }
  }

  appendMappedValues(endpoint, "type", filters.type, optionValueLookup.type);

  if (filters.openAccess) {
    endpoint.searchParams.append("openAccess", "true");
  }

  appendMappedValues(
    endpoint,
    "subField",
    filters.subField,
    optionValueLookup.subField,
  );
  appendMappedValues(
    endpoint,
    "author",
    filters.author,
    optionValueLookup.author,
  );
  appendMappedValues(
    endpoint,
    "institution",
    filters.institution,
    optionValueLookup.institution,
  );

  if (filters.pdf) {
    endpoint.searchParams.append("pdf", "true");
  }

  appendMappedValues(
    endpoint,
    "country",
    filters.country,
    optionValueLookup.country,
  );

  if (hasActiveCitationFilter(filters)) {
    appendIfFilled(endpoint, "citationMode", filters.citationMode);

    if (filters.citationMode === "exact") {
      appendIfFilled(endpoint, "citationExact", filters.citationExact);
    } else {
      appendIfFilled(endpoint, "citationMin", filters.citationMin);
      appendIfFilled(endpoint, "citationMax", filters.citationMax);
    }
  }

  appendMappedValues(
    endpoint,
    "source",
    filters.source,
    optionValueLookup.source,
  );
  appendMappedValues(
    endpoint,
    "award",
    filters.award,
    optionValueLookup.award,
  );
  appendIfFilled(endpoint, "indexedByOrcid", filters.indexedByOrcid);

  if (sortState.trendingMode !== "none") {
    appendIfFilled(endpoint, "trendingMode", sortState.trendingMode);
  }

  if (sortState.sortBy !== "relevance") {
    appendIfFilled(endpoint, "sortBy", sortState.sortBy);
    appendIfFilled(endpoint, "sortDirection", sortState.sortDirection);
  }

  endpoint.searchParams.set("page", String(request.page));
  endpoint.searchParams.set("perPage", String(SEARCH_WORKS_PER_PAGE));

  return endpoint;
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

function appendIfFilled(url: URL, key: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return;
  }

  url.searchParams.append(key, normalizedValue);
}

function appendMappedValues(
  url: URL,
  key: string,
  labels: string[],
  valueLookup: Record<string, string>,
) {
  for (const label of labels) {
    const value = valueLookup[label] || label;

    if (!value.trim()) {
      continue;
    }

    url.searchParams.append(key, value);
  }
}
