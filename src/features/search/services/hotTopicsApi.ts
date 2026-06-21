import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type { HotTopicApiResponse } from "./types";

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

export const getHotTopics = getTrendingTopics;
