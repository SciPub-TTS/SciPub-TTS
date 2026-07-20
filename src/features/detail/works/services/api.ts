import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type { PaperDetailData } from "../types";

export async function getPaperDetail(paperId: string): Promise<PaperDetailData> {
  const normalizedPaperId = paperId.trim();

  if (!normalizedPaperId) {
    throw new Error("Paper ID is missing.");
  }

  const response = await publicHttp.get<ApiResponse<PaperDetailData>>(
    `/api/papers/${encodeURIComponent(normalizedPaperId)}`,
  );
  return response.data.data;
}
