import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type { LandingTrendPreview } from "../types/landing.types";

export async function getLandingTrendPreview() {
  const response = await publicHttp.get<ApiResponse<LandingTrendPreview>>(
    "/api/home/landing/preview",
  );

  return response.data.data;
}
