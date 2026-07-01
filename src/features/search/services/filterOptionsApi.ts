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
  HotKeywordApiResponse,
  HotTopicApiResponse,
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
  entityType: SearchEntityType,
  keyword: string,
  page: number,
  limit = SEARCH_FILTER_OPTION_LIMIT,
): Promise<RemoteFilterOptionsPage> {
  const params = new URLSearchParams();
  params.set("entityType", entityType);
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

export async function getTrendingKeywords(snapshotDate?: string, limit = 12) {
  const response = await publicHttp.get<ApiResponse<HotKeywordApiResponse>>(
    "/api/search/trending-keywords",
    {
      params: {
        limit,
        ...(snapshotDate ? { snapshotDate } : {}),
      },
    },
  );

  return response.data.data;
}

export async function getTrendingTopics(snapshotDate?: string, limit = 8) {
  const response = await publicHttp.get<ApiResponse<HotTopicApiResponse>>(
    "/api/search/trending-topics",
    {
      params: {
        limit,
        ...(snapshotDate ? { snapshotDate } : {}),
      },
    },
  );

  return response.data.data;
}

function appendIfFilled(params: URLSearchParams, key: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return;
  }

  params.append(key, normalizedValue);
}
