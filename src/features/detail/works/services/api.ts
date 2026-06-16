import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import { mapWorkDetailToPaperDetail } from "../mappers/paperDetailMapper";
import type { OpenAlexWorkDetailApi, PaperDetailData } from "../types";

export async function getPaperDetail(paperId: string): Promise<PaperDetailData> {
  const normalizedPaperId = paperId.trim();

  if (!normalizedPaperId) {
    throw new Error("Paper ID is missing.");
  }

  const response = await publicHttp.get<ApiResponse<OpenAlexWorkDetailApi>>(
    `/api/papers/${encodeURIComponent(normalizedPaperId)}`,
  );
  const data = response.data.data;

  return mapWorkDetailToPaperDetail(data);
}
