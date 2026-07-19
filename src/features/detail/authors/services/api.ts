import { trimToEmpty } from "@/lib/resourceFormatting";
import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type { AuthorDetailData } from "../types";

export async function getAuthorDetail(authorId: string): Promise<AuthorDetailData> {
  const normalizedAuthorId = trimToEmpty(authorId);

  if (!normalizedAuthorId) {
    throw new Error("Author ID is missing.");
  }

  const response = await publicHttp.get<ApiResponse<AuthorDetailData>>(
    `/api/authors/${encodeURIComponent(normalizedAuthorId)}`,
  );

  return response.data.data;
}
