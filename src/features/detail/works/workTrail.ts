import { routePaths } from "@/app/router/routes";

const workTrailSearchParam = "trail";

function normalizePaperId(paperId: string) {
  return paperId.trim();
}

export function parseWorkTrail(search: string) {
  const params = new URLSearchParams(search);
  const rawTrail = params.get(workTrailSearchParam);

  if (!rawTrail) {
    return [];
  }

  return rawTrail
    .split(",")
    .map((paperId) => decodeURIComponent(paperId).trim())
    .filter(Boolean);
}

export function appendWorkTrailEntry(
  currentTrail: string[],
  currentPaperId: string,
) {
  const normalizedCurrentPaperId = normalizePaperId(currentPaperId);

  if (!normalizedCurrentPaperId) {
    return [...currentTrail];
  }

  const nextTrail = [...currentTrail];
  const lastPaperId = nextTrail[nextTrail.length - 1];

  if (lastPaperId !== normalizedCurrentPaperId) {
    nextTrail.push(normalizedCurrentPaperId);
  }

  return nextTrail;
}

export function buildPaperDetailTrailUrl(
  paperId: string | number,
  trail: string[],
) {
  const basePath = routePaths.paperDetail(paperId);
  const normalizedTrail = trail
    .map((trailPaperId) => normalizePaperId(trailPaperId))
    .filter(Boolean);

  if (normalizedTrail.length === 0) {
    return basePath;
  }

  const params = new URLSearchParams({
    [workTrailSearchParam]: normalizedTrail
      .map((trailPaperId) => encodeURIComponent(trailPaperId))
      .join(","),
  });

  return `${basePath}?${params.toString()}`;
}
