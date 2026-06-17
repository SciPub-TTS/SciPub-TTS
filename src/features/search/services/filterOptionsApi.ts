import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import { SEARCH_FILTER_OPTION_LIMIT } from "../constants";
import type { RemoteOptionFilterKey, SearchEntityType } from "../types";
import {
  mapOptionsToLabels,
  mapOptionsToValueLookup,
  shouldIncludeStableSuffix,
} from "./filterOptionMapping";
import type {
  FilterOptionPageApiData,
  RemoteFilterOptionsPage,
  SearchSummaryApiData,
  SearchSummaryState,
} from "./types";

export async function getSearchSummary(
  entityType: SearchEntityType,
): Promise<SearchSummaryState> {
  const response = await publicHttp.get<ApiResponse<SearchSummaryApiData>>(
    "/api/search/summary",
    {
      params: {
        entityType,
      },
    },
  );
  const data = response.data.data;

  return {
    entityType: data.entityType,
    totalIndexedCount: data.totalCount,
    totalCountExact: data.totalCountExact,
  };
}

export async function getFilterOptionPage(
  filterKey: RemoteOptionFilterKey,
  keyword: string,
  page: number,
  limit = SEARCH_FILTER_OPTION_LIMIT,
): Promise<RemoteFilterOptionsPage> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));
  appendIfFilled(params, "keyword", keyword);

  const response = await publicHttp.get<ApiResponse<FilterOptionPageApiData>>(
    `/api/search/filters/${filterKey}/options`,
    { params },
  );
  const data = response.data.data;
  const options = mapOptionsToLabels(
    data.options,
    shouldIncludeStableSuffix(filterKey),
  );
  const valueLookup = mapOptionsToValueLookup(
    data.options,
    shouldIncludeStableSuffix(filterKey),
  );

  return {
    hasMore: options.length >= limit,
    options,
    page,
    valueLookup,
  };
}

function appendIfFilled(params: URLSearchParams, key: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return;
  }

  params.append(key, normalizedValue);
}
