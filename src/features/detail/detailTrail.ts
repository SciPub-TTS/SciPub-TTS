import { routePaths } from "@/app/router/routes";
import { trimToEmpty } from "@/lib/resourceFormatting";
import type { DetailTitleEntityType } from "@/features/detail/store/detailTitleStore";
import { ENABLE_SOCIAL_HUB } from "@/features/social/socialFeature";

const detailTrailSearchParam = "trail";
const detailOriginSearchParam = "origin";
const detailTrailSessionStorageKey = "detail-navigation-state";

export type DetailTrailEntityType = DetailTitleEntityType;
export type DetailOrigin =
  | "bookmarks"
  | "search"
  | "social-hub"
  | "trending"
  | "feed"
  | "newfeed";

type DetailTrailEntry = {
  entityId: string;
  entityType: DetailTrailEntityType;
};

type PersistedDetailNavigationState = {
  current: DetailTrailEntry | null;
  origin: DetailOrigin;
  trail: DetailTrailEntry[];
};

type DetailRouteParams = {
  authorId?: string;
  paperId?: string;
  topicId?: string;
};

function normalizeEntityId(entityId: string) {
  return trimToEmpty(entityId);
}

function normalizeDetailOrigin(origin: string | null | undefined): DetailOrigin {
  const normalizedOrigin = origin?.trim().toLowerCase();

  if (normalizedOrigin === "bookmarks") {
    return "bookmarks";
  }

  if (normalizedOrigin === "social-hub" && ENABLE_SOCIAL_HUB) {
    return "social-hub";
  }

  if (normalizedOrigin === "trending") {
    return "trending";
  }

  if (normalizedOrigin === "feed" || normalizedOrigin === "newfeed") {
    return "newfeed";
  }

  return "search";
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

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function normalizeDetailTrailEntries(trail: DetailTrailEntry[]) {
  return trail
    .map((entry) => normalizeDetailTrailEntry(entry))
    .filter((entry): entry is DetailTrailEntry => entry !== null);
}

function readPersistedDetailNavigationState() {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(detailTrailSessionStorageKey);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as {
      current?: DetailTrailEntry | null;
      origin?: string | null;
      trail?: DetailTrailEntry[];
    };
    const current = parsedValue.current
      ? normalizeDetailTrailEntry(parsedValue.current)
      : null;

    return {
      current,
      origin: normalizeDetailOrigin(parsedValue.origin),
      trail: normalizeDetailTrailEntries(parsedValue.trail ?? []),
    } satisfies PersistedDetailNavigationState;
  } catch {
    return null;
  }
}

function writePersistedDetailNavigationState(
  state: PersistedDetailNavigationState,
) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      detailTrailSessionStorageKey,
      JSON.stringify({
        current: state.current,
        origin: state.origin,
        trail: normalizeDetailTrailEntries(state.trail),
      } satisfies PersistedDetailNavigationState),
    );
  } catch {
    // Ignore sessionStorage write failures and keep navigation functional.
  }
}

function getLegacyDetailTrail(search: string) {
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

export function parseDetailOrigin(search: string): DetailOrigin {
  const params = new URLSearchParams(search);
  return normalizeDetailOrigin(params.get(detailOriginSearchParam));
}

function isSameDetailEntry(
  left: DetailTrailEntry | null,
  right: DetailTrailEntry | null,
) {
  return (
    left?.entityType === right?.entityType && left?.entityId === right?.entityId
  );
}

export function getDetailNavigationState(
  search: string,
  currentEntityType: DetailTrailEntityType,
  currentEntityId: string,
) {
  const normalizedCurrent = normalizeDetailTrailEntry({
    entityId: currentEntityId,
    entityType: currentEntityType,
  });
  const legacyTrail = getLegacyDetailTrail(search);
  const legacyOrigin = parseDetailOrigin(search);
  const persistedState = readPersistedDetailNavigationState();

  if (
    normalizedCurrent &&
    persistedState &&
    isSameDetailEntry(persistedState.current, normalizedCurrent)
  ) {
    return {
      origin: persistedState.origin,
      trail: persistedState.trail,
    };
  }

  return {
    origin: legacyOrigin,
    trail: legacyTrail,
  };
}

export function syncDetailNavigationState(
  search: string,
  currentEntityType: DetailTrailEntityType,
  currentEntityId: string,
) {
  const normalizedCurrent = normalizeDetailTrailEntry({
    entityId: currentEntityId,
    entityType: currentEntityType,
  });

  if (!normalizedCurrent) {
    return;
  }

  const legacyTrail = getLegacyDetailTrail(search);
  const persistedState = readPersistedDetailNavigationState();

  if (legacyTrail.length > 0) {
    writePersistedDetailNavigationState({
      current: normalizedCurrent,
      origin: parseDetailOrigin(search),
      trail: legacyTrail,
    });
    return;
  }

  if (persistedState && isSameDetailEntry(persistedState.current, normalizedCurrent)) {
    return;
  }

  writePersistedDetailNavigationState({
    current: normalizedCurrent,
    origin: parseDetailOrigin(search),
    trail: [],
  });
}

function appendDetailTrailEntry(
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
  origin: DetailOrigin = "search",
) {
  const basePath = buildDetailPath(entityType, entityId);
  const normalizedOrigin = normalizeDetailOrigin(origin);

  if (normalizedOrigin === "search") {
    return basePath;
  }

  const params = new URLSearchParams();
  params.set(detailOriginSearchParam, normalizedOrigin);

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

function persistDetailNavigationState(
  current: DetailTrailEntry,
  trail: DetailTrailEntry[],
  origin: DetailOrigin,
) {
  writePersistedDetailNavigationState({
    current,
    origin: normalizeDetailOrigin(origin),
    trail: normalizeDetailTrailEntries(trail),
  });
}

export function persistRootDetailNavigation(
  targetEntityType: DetailTrailEntityType,
  targetEntityId: string | number,
  origin: DetailOrigin = "search",
) {
  const current = normalizeDetailTrailEntry({
    entityId: String(targetEntityId),
    entityType: targetEntityType,
  });

  if (!current) {
    return;
  }

  persistDetailNavigationState(current, [], origin);
}

export function persistNextDetailNavigation(
  search: string,
  currentEntityType: DetailTrailEntityType,
  currentEntityId: string,
  targetEntityType: DetailTrailEntityType,
  targetEntityId: string | number,
) {
  const normalizedTarget = normalizeDetailTrailEntry({
    entityId: String(targetEntityId),
    entityType: targetEntityType,
  });
  const currentNavigationState = getDetailNavigationState(
    search,
    currentEntityType,
    currentEntityId,
  );

  if (!normalizedTarget) {
    return;
  }

  if (
    currentEntityType === normalizedTarget.entityType &&
    normalizeEntityId(currentEntityId) === normalizedTarget.entityId
  ) {
    persistDetailNavigationState(
      normalizedTarget,
      currentNavigationState.trail,
      currentNavigationState.origin,
    );
    return;
  }

  const nextTrail = appendDetailTrailEntry(
    currentNavigationState.trail,
    currentEntityType,
    currentEntityId,
  );

  persistDetailNavigationState(
    normalizedTarget,
    nextTrail,
    currentNavigationState.origin,
  );
}

export function buildNextDetailUrl(
  search: string,
  currentEntityType: DetailTrailEntityType,
  currentEntityId: string,
  targetEntityType: DetailTrailEntityType,
  targetEntityId: string | number,
) {
  const normalizedTargetId = normalizeEntityId(String(targetEntityId));
  const currentOrigin = parseDetailOrigin(search);

  if (!normalizedTargetId) {
    return buildDetailTrailUrl(
      targetEntityType,
      targetEntityId,
      currentOrigin,
    );
  }

  if (
    currentEntityType === targetEntityType &&
    normalizeEntityId(currentEntityId) === normalizedTargetId
  ) {
    return buildDetailTrailUrl(
      targetEntityType,
      normalizedTargetId,
      currentOrigin,
    );
  }

  return buildDetailTrailUrl(
    targetEntityType,
    normalizedTargetId,
    currentOrigin,
  );
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
