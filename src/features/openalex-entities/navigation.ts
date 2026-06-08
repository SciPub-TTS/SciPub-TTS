import { routePaths } from "@/app/router/routes";

import type { OpenAlexEntityEntry } from "./types";
import {
  normalizeOpenAlexEntityEntry,
  normalizeOpenAlexId,
} from "./utils";

const entityTrailSearchParam = "entityTrail";

type SerializedEntityTrailEntry = {
  id?: string;
  label?: string;
  type?: OpenAlexEntityEntry["type"];
};

function normalizeEntityLabel(label?: string) {
  const normalizedLabel = label?.trim();
  return normalizedLabel || undefined;
}

function sanitizeEntityTrail(entries: OpenAlexEntityEntry[]) {
  return entries.reduce<OpenAlexEntityEntry[]>((trail, entry) => {
    const normalizedEntry = normalizeOpenAlexEntityEntry(entry);

    if (!normalizedEntry) {
      return trail;
    }

    const lastEntry = trail[trail.length - 1];
    if (
      lastEntry &&
      lastEntry.id === normalizedEntry.id &&
      lastEntry.type === normalizedEntry.type
    ) {
      return trail;
    }

    trail.push({
      ...normalizedEntry,
      label: normalizeEntityLabel(entry.label) || normalizedEntry.label,
    });

    return trail;
  }, []);
}

export function getEntityLabel(entry: OpenAlexEntityEntry) {
  return normalizeEntityLabel(entry.label) || normalizeOpenAlexId(entry.id);
}

export function parseEntityTrailFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const rawTrail = params.get(entityTrailSearchParam);

  if (!rawTrail) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawTrail);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return sanitizeEntityTrail(
      parsedValue.map((entry) => {
        const value = (entry || {}) as SerializedEntityTrailEntry;

        return {
          id: value.id || "",
          label: value.label,
          type: value.type,
        };
      }),
    );
  } catch {
    return [];
  }
}

export function appendEntityTrailEntry(
  currentTrail: OpenAlexEntityEntry[],
  entry: OpenAlexEntityEntry,
) {
  return sanitizeEntityTrail([...currentTrail, entry]);
}

export function replaceEntityTrail(entry: OpenAlexEntityEntry) {
  return sanitizeEntityTrail([entry]);
}

export function buildEntityTrailSearch(entries: OpenAlexEntityEntry[]) {
  const sanitizedTrail = sanitizeEntityTrail(entries);

  if (sanitizedTrail.length === 0) {
    return "";
  }

  const params = new URLSearchParams({
    [entityTrailSearchParam]: JSON.stringify(
      sanitizedTrail.map((entry) => ({
        id: entry.id,
        label: normalizeEntityLabel(entry.label),
        type: entry.type,
      })),
    ),
  });

  return `?${params.toString()}`;
}

export function buildPaperEntityTrailUrl(
  paperId: string | number,
  entries: OpenAlexEntityEntry[],
) {
  const basePath = routePaths.paperEntityDetail(paperId);
  const search = buildEntityTrailSearch(entries);

  return `${basePath}${search}`;
}
