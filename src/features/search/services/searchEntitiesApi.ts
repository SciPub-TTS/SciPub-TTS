import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
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
  const params = new URLSearchParams();
  params.set("entityType", request.entityType);
  params.set("page", String(request.page));
  params.set("perPage", String(SEARCH_WORKS_PER_PAGE));
  appendIfFilled(params, "query", request.appliedSearchQuery);

  const response = await publicHttp.get<ApiResponse<SearchEntitiesApiResponse>>(
    "/api/search/entities",
    { params },
  );
  const data = response.data.data;
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

function appendIfFilled(params: URLSearchParams, key: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return;
  }

  params.append(key, normalizedValue);
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
