import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type { LandingTrendPreview } from "../types/landing.types";

export async function getLandingTrendPreview(snapshotDate?: string) {
  const response = await publicHttp.get<ApiResponse<LandingTrendPreview>>(
    "/api/home/landing/preview",
    {
      params: snapshotDate ? { snapshotDate } : undefined,
    },
  );

  return response.data.data;
}
