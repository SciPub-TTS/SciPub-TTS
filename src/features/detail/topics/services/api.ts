import { trimToEmpty } from "@/lib/resourceFormatting";
import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type { TopicDetailData } from "../types";

export async function getTopicDetail(topicId: string): Promise<TopicDetailData> {
  const normalizedTopicId = trimToEmpty(topicId);

  if (!normalizedTopicId) {
    throw new Error("Topic ID is missing.");
  }

  const response = await publicHttp.get<ApiResponse<TopicDetailData>>(
    `/api/topics/${encodeURIComponent(normalizedTopicId)}`,
  );

  return response.data.data;
}
