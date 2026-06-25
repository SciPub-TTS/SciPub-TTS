import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
  LandingSummaryData,
  LandingSummaryRequest,
} from "@/features/landing/types/landing.types";

export const LANDING_DEFAULT_FIELD_ID = "22";
export const LANDING_DEFAULT_FORMULA = "TRENDING";

export async function fetchLandingSummary(params: LandingSummaryRequest) {
  const response = await publicHttp.get<ApiResponse<LandingSummaryData | null>>(
    "/api/home/landing/summary",
    { params },
  );

  return response.data.data;
}
