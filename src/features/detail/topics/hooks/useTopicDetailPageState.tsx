import { useTrimmedRouteParam } from "@/features/detail/hooks/useTrimmedRouteParam";
import { useDetailPageQuery } from "@/features/detail/hooks/useDetailPageQuery";

import { getTopicDetail } from "../services/api";
import type { TopicDetailData } from "../types";

export function useTopicDetailPageState() {
  const topicId = useTrimmedRouteParam("topicId");
  const detailState = useDetailPageQuery<TopicDetailData>({
    entityId: topicId,
    entityType: "topics",
    getTitle: (detail) => detail.displayName,
    loadErrorMessage: "Cannot load topic detail right now.",
    missingIdMessage: "Topic ID is missing.",
    queryFn: getTopicDetail,
    queryKey: ["topicDetail", topicId],
  });

  return {
    detail: detailState.data,
    errorMessage: detailState.errorMessage,
    isLoading: detailState.isLoading,
  };
}
