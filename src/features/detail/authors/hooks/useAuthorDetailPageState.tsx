import { useTrimmedRouteParam } from "@/features/detail/hooks/useTrimmedRouteParam";
import { useDetailPageQuery } from "@/features/detail/hooks/useDetailPageQuery";

import { getAuthorDetail } from "../services/api";
import type { AuthorDetailData } from "../types";

export function useAuthorDetailPageState() {
  const authorId = useTrimmedRouteParam("authorId");
  const detailState = useDetailPageQuery<AuthorDetailData>({
    entityId: authorId,
    entityType: "authors",
    getTitle: (detail) => detail.displayName,
    loadErrorMessage: "Cannot load author detail right now.",
    missingIdMessage: "Author ID is missing.",
    queryFn: getAuthorDetail,
    queryKey: ["authorDetail", authorId],
  });

  return {
    detail: detailState.data,
    errorMessage: detailState.errorMessage,
    isLoading: detailState.isLoading,
  };
}
