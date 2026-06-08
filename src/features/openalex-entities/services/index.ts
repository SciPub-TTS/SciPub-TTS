import {
  buildApiPath,
  createApiUrl,
  requestJson,
} from "@/lib/api/fetchJson";

import type { EntityType, OpenAlexEntity, OpenAlexWorkListItem } from "../types";

type OpenAlexWorksResponse = {
  results?: OpenAlexWorkListItem[];
};

export async function getOpenAlexEntityDetail(
  entityType: EntityType,
  entityId: string,
): Promise<OpenAlexEntity> {
  const normalizedEntityId = entityId.trim();
  if (!normalizedEntityId) {
    throw new Error("Entity ID is missing.");
  }

  const endpoint = buildApiPath(
    `/api/openalex-entities/${encodeURIComponent(entityType)}/${encodeURIComponent(normalizedEntityId)}`,
  );

  return requestJson<OpenAlexEntity>(endpoint);
}

export async function getOpenAlexEntityTopWorks(params: {
  entityId: string;
  entityType: EntityType;
  sort?: string;
  perPage?: number;
  page?: number;
}) {
  const normalizedEntityId = params.entityId.trim();
  if (!normalizedEntityId) {
    throw new Error("Entity ID is missing.");
  }

  const endpoint = createApiUrl(
    `/api/openalex-entities/${encodeURIComponent(params.entityType)}/${encodeURIComponent(normalizedEntityId)}/works`,
  );

  if (params.sort) {
    endpoint.searchParams.set("sort", params.sort);
  }
  if (params.perPage) {
    endpoint.searchParams.set("per_page", String(params.perPage));
  }
  if (params.page) {
    endpoint.searchParams.set("page", String(params.page));
  }

  const data = await requestJson<OpenAlexWorksResponse>(endpoint);

  return Array.isArray(data.results) ? data.results : [];
}
