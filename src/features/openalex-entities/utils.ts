import type { OpenAlexEntityEntry, EntityType } from "./types";

const entityTypeLabels: Record<EntityType, string> = {
  author: "Author",
  topic: "Topic",
  institution: "Institution",
  source: "Source",
};

const entityPrefixMap: Record<string, EntityType> = {
  A: "author",
  T: "topic",
  I: "institution",
  S: "source",
};

export function normalizeOpenAlexId(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  const lastSlashIndex = normalizedValue.lastIndexOf("/");

  if (lastSlashIndex === -1 || lastSlashIndex === normalizedValue.length - 1) {
    return normalizedValue;
  }

  return normalizedValue.slice(lastSlashIndex + 1);
}

export function inferEntityTypeFromId(openAlexId: string): EntityType | null {
  const normalizedId = normalizeOpenAlexId(openAlexId);
  const prefix = normalizedId.charAt(0).toUpperCase();

  return entityPrefixMap[prefix] || null;
}

export function formatEntityTypeLabel(entityType: EntityType) {
  return entityTypeLabels[entityType];
}

export function normalizeOpenAlexEntityEntry(
  entry: OpenAlexEntityEntry,
): OpenAlexEntityEntry | null {
  if (!entry.id?.trim()) {
    return null;
  }

  const normalizedId = normalizeOpenAlexId(entry.id);
  const normalizedType = entry.type || inferEntityTypeFromId(normalizedId);

  if (!normalizedType) {
    return null;
  }

  return {
    id: normalizedId,
    label: entry.label,
    type: normalizedType,
  };
}

export function getOpenAlexEntityUrl(entityId: string) {
  const normalizedId = normalizeOpenAlexId(entityId);
  return normalizedId ? `https://openalex.org/${normalizedId}` : "";
}
