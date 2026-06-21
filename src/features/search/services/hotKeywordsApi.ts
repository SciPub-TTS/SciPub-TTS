import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type { HotKeywordApiResponse } from "./types";

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

export const getHotKeywords = getTrendingKeywords;
