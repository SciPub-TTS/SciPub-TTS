import { useDetailPageQuery } from "@/features/detail/hooks/useDetailPageQuery";
import { useTrimmedRouteParam } from "@/features/detail/hooks/useTrimmedRouteParam";

import { getPaperDetail } from "../services";

export function usePaperDetailPageState() {
  const paperId = useTrimmedRouteParam("paperId");
  const paperDetailState = useDetailPageQuery({
    entityId: paperId,
    entityType: "works",
    getTitle: (paperDetail) => paperDetail.title,
    loadErrorMessage: "Cannot load paper detail right now.",
    missingIdMessage: "Paper ID is missing.",
    queryFn: getPaperDetail,
    queryKey: ["paperDetail", paperId],
  });

  return {
    errorMessage: paperDetailState.errorMessage,
    isLoading: paperDetailState.isLoading,
    paperDetail: paperDetailState.data,
  };
}
