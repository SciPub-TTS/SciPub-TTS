import { createApiUrl, requestPublicJson } from "@/lib/api/fetchJson";
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
  const endpoint = createApiUrl("/api/search/summary");
  endpoint.searchParams.set("entityType", entityType);
  const data = await requestPublicJson<SearchSummaryApiData>(endpoint);

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
  const endpoint = createApiUrl(`/api/search/filters/${filterKey}/options`);
  endpoint.searchParams.set("limit", String(limit));
  endpoint.searchParams.set("page", String(page));
  appendIfFilled(endpoint, "keyword", keyword);

  const data = await requestPublicJson<FilterOptionPageApiData>(endpoint);
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

function appendIfFilled(url: URL, key: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return;
  }

  url.searchParams.append(key, normalizedValue);
}
