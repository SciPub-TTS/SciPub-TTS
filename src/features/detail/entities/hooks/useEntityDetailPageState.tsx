import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { setDetailTitle } from "@/features/detail/store/detailTitleStore";

import { getAuthorDetail, getTopicDetail } from "../services/api";
import type { EntityDetailData, EntityDetailType } from "../types";

export function useEntityDetailPageState(entityType: EntityDetailType) {
  const params = useParams();
  const rawEntityId =
    entityType === "authors" ? params.authorId || "" : params.topicId || "";
  const normalizedEntityId = rawEntityId.trim();
  const entityLabel = entityType === "authors" ? "author" : "topic";
  const detailQuery = useQuery<EntityDetailData>({
    enabled: Boolean(normalizedEntityId),
    queryFn: () =>
      entityType === "authors"
        ? getAuthorDetail(normalizedEntityId)
        : getTopicDetail(normalizedEntityId),
    queryKey: ["entityDetail", entityType, normalizedEntityId],
  });

  useEffect(() => {
    if (!normalizedEntityId || !detailQuery.data?.displayName) {
      return;
    }

    setDetailTitle(
      entityType,
      normalizedEntityId,
      detailQuery.data.displayName,
    );
  }, [detailQuery.data, entityType, normalizedEntityId]);

  let errorMessage = "";

  if (detailQuery.error instanceof Error) {
    errorMessage = detailQuery.error.message;
  } else if (detailQuery.error) {
    errorMessage = `Cannot load ${entityLabel} detail right now.`;
  }

  return {
    detail: detailQuery.data || null,
    errorMessage: normalizedEntityId ? errorMessage : `${entityLabel} ID is missing.`,
    isLoading: Boolean(normalizedEntityId) && detailQuery.isPending,
  };
}
