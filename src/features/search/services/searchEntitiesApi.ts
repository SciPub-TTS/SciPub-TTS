import {
  extractPathId,
  toOptionalPlainText,
  toPlainText,
  trimToEmpty,
} from "@/lib/resourceFormatting";
import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import { SEARCH_WORKS_PER_PAGE } from "../constants";
import type {
  AuthorResult,
  TopicResult,
} from "../types";
import type {
  SearchEntitiesApiResponse,
  SearchEntityApiItem,
  SearchEntitiesState,
  SearchEntityRequest,
} from "./types";

export async function searchEntities(
  request: SearchEntityRequest,
): Promise<SearchEntitiesState> {
  const params = buildSearchEntityParams(request);
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
    totalCount: data.meta?.totalCount || 0,
    totalCountExact: data.meta?.totalCountExact ?? true,
  };
}

function buildSearchEntityParams(request: SearchEntityRequest) {
  const params = new URLSearchParams();
  const { filters, optionValueLookup, sortState } = request;

  params.set("entityType", request.entityType);
  params.set("page", String(request.page));
  params.set("perPage", String(SEARCH_WORKS_PER_PAGE));
  appendIfFilled(params, "query", request.appliedSearchQuery);

  if (request.entityType === "authors") {
    appendMappedValues(
      params,
      "institution",
      filters.institution,
      optionValueLookup.institution,
    );
    appendMappedValues(
      params,
      "country",
      filters.country,
      optionValueLookup.country,
    );
  }

  if (request.entityType === "topics") {
    appendMappedValues(
      params,
      "subField",
      filters.subField,
      optionValueLookup.subField,
    );
    appendMappedValues(
      params,
      "field",
      filters.field,
      optionValueLookup.field,
    );
  }

  if (sortState.sortBy !== "relevance") {
    appendIfFilled(params, "sortBy", sortState.sortBy);
    appendIfFilled(params, "sortDirection", sortState.sortDirection);
  }

  return params;
}

function appendMappedValues(
  params: URLSearchParams,
  key: string,
  labels: string[],
  valueLookup: Record<string, string>,
) {
  for (const label of labels) {
    const value = valueLookup[label] || label;

    if (!trimToEmpty(value)) {
      continue;
    }

    params.append(key, value);
  }
}

function appendIfFilled(params: URLSearchParams, key: string, value: string) {
  const normalizedValue = trimToEmpty(value);

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

function mapApiEntityToResult(
  entity: SearchEntityApiItem,
): AuthorResult | TopicResult {
  switch (entity.entityType) {
    case "authors":
      return {
        id: extractPathId(entity.id),
        entityType: "authors",
        displayName: toPlainText(entity.displayName) || "Unknown author",
        primaryInstitutionName: toOptionalPlainText(
          entity.primaryInstitutionName,
        ),
        primaryTopicName: toOptionalPlainText(entity.primaryTopicName),
        worksCount: Math.max(entity.worksCount || 0, 0),
      };
    case "topics":
      return {
        id: extractPathId(entity.id),
        entityType: "topics",
        displayName: toPlainText(entity.displayName) || "Unknown topic",
        subfieldName: toOptionalPlainText(entity.subfieldName),
        fieldName: toOptionalPlainText(entity.fieldName),
        domainName: toOptionalPlainText(entity.domainName),
        worksCount: Math.max(entity.worksCount || 0, 0),
      };
  }
}
