import { useDetailPageQuery } from "@/features/detail/hooks/useDetailPageQuery";
import { useTrimmedRouteParam } from "@/features/detail/hooks/useTrimmedRouteParam";

import type { EntityDetailData, EntityDetailType } from "../types";
import { getEntityDetailConfig } from "./entityDetailConfig";

export function useEntityDetailPageState(entityType: EntityDetailType) {
  const entityConfig = getEntityDetailConfig(entityType);
  const entityId = useTrimmedRouteParam(entityConfig.routeParam);
  const detailState = useDetailPageQuery<EntityDetailData>({
    entityId,
    entityType,
    getTitle: (detail) => detail.displayName,
    loadErrorMessage: `Cannot load ${entityConfig.label} detail right now.`,
    missingIdMessage: `${entityConfig.label} ID is missing.`,
    queryFn: entityConfig.queryFn,
    queryKey: ["entityDetail", entityType, entityId],
  });

  return {
    detail: detailState.data,
    errorMessage: detailState.errorMessage,
    isLoading: detailState.isLoading,
  };
}
