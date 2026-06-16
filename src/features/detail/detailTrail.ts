import { routePaths } from "@/app/router/routes";
import type { DetailTitleEntityType } from "@/store/detailTitleStore";

const detailTrailSearchParam = "trail";

export type DetailTrailEntityType = DetailTitleEntityType;

export type DetailTrailEntry = {
  entityId: string;
  entityType: DetailTrailEntityType;
};

type DetailRouteParams = {
  authorId?: string;
  paperId?: string;
  topicId?: string;
};

function normalizeEntityId(entityId: string) {
  return entityId.trim();
}

function normalizeEntityType(entityType: string) {
  const normalizedEntityType = entityType.trim().toLowerCase();

  if (
    normalizedEntityType === "works" ||
    normalizedEntityType === "authors" ||
    normalizedEntityType === "topics"
  ) {
    return normalizedEntityType;
  }

  return null;
}

function normalizeDetailTrailEntry(entry: DetailTrailEntry) {
  const entityType = normalizeEntityType(entry.entityType);
  const entityId = normalizeEntityId(entry.entityId);

  if (!entityType || !entityId) {
    return null;
  }

  return {
    entityId,
    entityType,
  } satisfies DetailTrailEntry;
}

function serializeDetailTrailEntry(entry: DetailTrailEntry) {
  return `${entry.entityType}:${entry.entityId}`;
}

function buildDetailPath(
  entityType: DetailTrailEntityType,
  entityId: string | number,
) {
  if (entityType === "works") {
    return routePaths.paperDetail(entityId);
  }

  if (entityType === "authors") {
    return routePaths.authorDetail(entityId);
  }

  return routePaths.topicDetail(entityId);
}

export function parseDetailTrail(search: string) {
  const params = new URLSearchParams(search);
  const rawTrail = params.get(detailTrailSearchParam);

  if (!rawTrail) {
    return [];
  }

  return rawTrail
    .split(",")
    .map((rawEntry) => decodeURIComponent(rawEntry).trim())
    .map((rawEntry) => {
      const separatorIndex = rawEntry.indexOf(":");

      if (separatorIndex <= 0) {
        return normalizeDetailTrailEntry({
          entityId: rawEntry,
          entityType: "works",
        });
      }

      return normalizeDetailTrailEntry({
        entityId: rawEntry.slice(separatorIndex + 1),
        entityType: rawEntry.slice(0, separatorIndex) as DetailTrailEntityType,
      });
    })
    .filter((entry): entry is DetailTrailEntry => entry !== null);
}

export function appendDetailTrailEntry(
  currentTrail: DetailTrailEntry[],
  currentEntityType: DetailTrailEntityType,
  currentEntityId: string,
) {
  const currentEntry = normalizeDetailTrailEntry({
    entityId: currentEntityId,
    entityType: currentEntityType,
  });

  const normalizedCurrentTrail = currentTrail
    .map((entry) => normalizeDetailTrailEntry(entry))
    .filter((entry): entry is DetailTrailEntry => entry !== null);

  if (!currentEntry) {
    return normalizedCurrentTrail;
  }

  const nextTrail = [...normalizedCurrentTrail];
  const lastEntry = nextTrail[nextTrail.length - 1];

  if (
    !lastEntry ||
    lastEntry.entityType !== currentEntry.entityType ||
    lastEntry.entityId !== currentEntry.entityId
  ) {
    nextTrail.push(currentEntry);
  }

  return nextTrail;
}

export function buildDetailTrailUrl(
  entityType: DetailTrailEntityType,
  entityId: string | number,
  trail: DetailTrailEntry[],
) {
  const basePath = buildDetailPath(entityType, entityId);
  const normalizedTrail = trail
    .map((entry) => normalizeDetailTrailEntry(entry))
    .filter((entry): entry is DetailTrailEntry => entry !== null);

  if (normalizedTrail.length === 0) {
    return basePath;
  }

  const params = new URLSearchParams({
    [detailTrailSearchParam]: normalizedTrail
      .map((entry) => encodeURIComponent(serializeDetailTrailEntry(entry)))
      .join(","),
  });

  return `${basePath}?${params.toString()}`;
}

export function buildNextDetailUrl(
  search: string,
  currentEntityType: DetailTrailEntityType,
  currentEntityId: string,
  targetEntityType: DetailTrailEntityType,
  targetEntityId: string | number,
) {
  const normalizedTargetId = normalizeEntityId(String(targetEntityId));
  const currentTrail = parseDetailTrail(search);

  if (!normalizedTargetId) {
    return buildDetailTrailUrl(targetEntityType, targetEntityId, currentTrail);
  }

  if (
    currentEntityType === targetEntityType &&
    normalizeEntityId(currentEntityId) === normalizedTargetId
  ) {
    return buildDetailTrailUrl(targetEntityType, normalizedTargetId, currentTrail);
  }

  const nextTrail = appendDetailTrailEntry(
    currentTrail,
    currentEntityType,
    currentEntityId,
  );

  return buildDetailTrailUrl(targetEntityType, normalizedTargetId, nextTrail);
}

export function getDetailContextFromRouteParams(params: DetailRouteParams) {
  if (params.paperId) {
    return {
      entityId: params.paperId,
      entityType: "works",
    } satisfies DetailTrailEntry;
  }

  if (params.authorId) {
    return {
      entityId: params.authorId,
      entityType: "authors",
    } satisfies DetailTrailEntry;
  }

  if (params.topicId) {
    return {
      entityId: params.topicId,
      entityType: "topics",
    } satisfies DetailTrailEntry;
  }

  return null;
}
