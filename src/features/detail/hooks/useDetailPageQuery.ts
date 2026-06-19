import { useEffect } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";

import {
  setDetailTitle,
  type DetailTitleEntityType,
} from "@/features/detail/store/detailTitleStore";

type UseDetailPageQueryParams<TData> = {
  entityId: string;
  entityType: DetailTitleEntityType;
  getTitle: (data: TData) => string | null | undefined;
  loadErrorMessage: string;
  missingIdMessage: string;
  queryFn: (entityId: string) => Promise<TData>;
  queryKey: QueryKey;
};

function resolveQueryErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return error ? fallbackMessage : "";
}

// Shared detail-page flow:
// route param -> fetch -> expose loading/error/data -> register breadcrumb title
export function useDetailPageQuery<TData>(
  params: UseDetailPageQueryParams<TData>,
) {
  const {
    entityId,
    entityType,
    getTitle,
    loadErrorMessage,
    missingIdMessage,
    queryFn,
    queryKey,
  } = params;
  const detailQuery = useQuery<TData>({
    enabled: Boolean(entityId),
    queryFn: () => queryFn(entityId),
    queryKey,
  });

  useEffect(() => {
    const title = detailQuery.data ? getTitle(detailQuery.data) : null;

    if (!entityId || !title) {
      return;
    }

    setDetailTitle(entityType, entityId, title);
  }, [detailQuery.data, entityId, entityType, getTitle]);

  return {
    data: detailQuery.data || null,
    errorMessage: entityId
      ? resolveQueryErrorMessage(detailQuery.error, loadErrorMessage)
      : missingIdMessage,
    isLoading: Boolean(entityId) && detailQuery.isPending,
  };
}

