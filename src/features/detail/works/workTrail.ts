import {
  appendDetailTrailEntry,
  buildDetailTrailUrl,
  parseDetailTrail,
} from "../detailTrail";

export function parseWorkTrail(search: string) {
  return parseDetailTrail(search)
    .filter((entry) => entry.entityType === "works")
    .map((entry) => entry.entityId);
}

export function appendWorkTrailEntry(
  currentTrail: string[],
  currentPaperId: string,
) {
  return appendDetailTrailEntry(
    currentTrail.map((paperId) => ({
      entityId: paperId,
      entityType: "works" as const,
    })),
    "works",
    currentPaperId,
  )
    .filter((entry) => entry.entityType === "works")
    .map((entry) => entry.entityId);
}

export function buildPaperDetailTrailUrl(
  paperId: string | number,
  trail: string[],
) {
  return buildDetailTrailUrl(
    "works",
    paperId,
    trail.map((trailPaperId) => ({
      entityId: trailPaperId,
      entityType: "works" as const,
    })),
  );
}
