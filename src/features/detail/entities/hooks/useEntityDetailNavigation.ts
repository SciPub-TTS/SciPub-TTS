import { useLocation, useParams } from "react-router-dom";

import { routePaths } from "@/app/router";
import {
  buildNextDetailUrl,
  getDetailContextFromRouteParams,
  persistNextDetailNavigation,
  persistRootDetailNavigation,
  type DetailTrailEntityType,
} from "@/features/detail/detailTrail";

function buildDirectDetailUrl(
  entityType: DetailTrailEntityType,
  entityId: string,
) {
  if (entityType === "works") {
    return routePaths.paperDetail(entityId);
  }

  if (entityType === "authors") {
    return routePaths.authorDetail(entityId);
  }

  return routePaths.topicDetail(entityId);
}

// Entity detail pages can link deeper into other detail pages while preserving
// the breadcrumb trail. This hook keeps that navigation rule in one place.
export function useEntityDetailNavigation() {
  const location = useLocation();
  const currentDetailContext = getDetailContextFromRouteParams(useParams());

  function buildDetailHref(
    targetEntityType: DetailTrailEntityType,
    targetEntityId: string,
  ) {
    if (!currentDetailContext) {
      return buildDirectDetailUrl(targetEntityType, targetEntityId);
    }

    return buildNextDetailUrl(
      location.search,
      currentDetailContext.entityType,
      currentDetailContext.entityId,
      targetEntityType,
      targetEntityId,
    );
  }

  function handleDetailClick(
    targetEntityType: DetailTrailEntityType,
    targetEntityId: string,
  ) {
    if (!currentDetailContext) {
      persistRootDetailNavigation(targetEntityType, targetEntityId);
      return;
    }

    persistNextDetailNavigation(
      location.search,
      currentDetailContext.entityType,
      currentDetailContext.entityId,
      targetEntityType,
      targetEntityId,
    );
  }

  return {
    buildDetailHref,
    handleDetailClick,
  };
}
