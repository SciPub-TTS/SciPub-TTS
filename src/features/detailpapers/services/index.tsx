import { buildApiPath, requestPublicJson } from "@/lib/api/fetchJson";

import type {
  OpenAlexWorkDetailApi,
  PaperDetailData,
} from "../types";
import { mapWorkDetailToPaperDetail } from "../mappers/paperDetailMapper";

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
