import { buildApiPath, requestPublicJson } from "@/lib/api/fetchJson";
import { mapWorkDetailToPaperDetail } from "../mappers/paperDetailMapper";
import type { OpenAlexWorkDetailApi, PaperDetailData } from "../types";

export async function getPaperDetail(paperId: string): Promise<PaperDetailData> {
  const normalizedPaperId = paperId.trim();

  if (!normalizedPaperId) {
    throw new Error("Paper ID is missing.");
  }

  const endpoint = buildApiPath(
    `/api/papers/${encodeURIComponent(normalizedPaperId)}`,
  );
  const data = await requestPublicJson<OpenAlexWorkDetailApi>(endpoint);

  return mapWorkDetailToPaperDetail(data);
}
