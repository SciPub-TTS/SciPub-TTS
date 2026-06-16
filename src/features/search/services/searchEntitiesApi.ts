import { createApiUrl, requestPublicJson } from "@/lib/api/fetchJson";
import { SEARCH_WORKS_PER_PAGE } from "../constants";
import { mapApiEntityToResult } from "./searchEntitiesMapper";
import type {
  SearchEntitiesApiResponse,
  SearchEntitiesState,
  SearchEntityRequest,
} from "./types";

export async function searchEntities(
  request: SearchEntityRequest,
): Promise<SearchEntitiesState> {
  const endpoint = createApiUrl("/api/search/entities");
  endpoint.searchParams.set("entityType", request.entityType);
  endpoint.searchParams.set("page", String(request.page));
  endpoint.searchParams.set("perPage", String(SEARCH_WORKS_PER_PAGE));
  appendIfFilled(endpoint, "query", request.appliedSearchQuery);

  const data = await requestPublicJson<SearchEntitiesApiResponse>(endpoint);
  const normalizedEntityType = normalizeEntityType(
    data.meta?.entityType,
    request.entityType,
  );
  const rawResults = Array.isArray(data.results) ? data.results : [];

  return {
    entityType: normalizedEntityType,
    hasMore: Boolean(data.meta?.hasMore),
    items: rawResults.map(mapApiEntityToResult),
    page: data.meta?.page || request.page,
    perPage: data.meta?.perPage || SEARCH_WORKS_PER_PAGE,
    responseTimeSeconds: (data.meta?.dbResponseTimeMs || 0) / 1000,
    totalCount: data.meta?.totalCount || 0,
    totalCountExact: data.meta?.totalCountExact ?? true,
  };
}

function appendIfFilled(url: URL, key: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return;
  }

  url.searchParams.append(key, normalizedValue);
}

function normalizeEntityType(
  value: string | undefined,
  fallback: SearchEntityRequest["entityType"],
): SearchEntityRequest["entityType"] {
  switch (value) {
    case "authors":
    case "topics":
      return value;
    default:
      return fallback;
  }
}
