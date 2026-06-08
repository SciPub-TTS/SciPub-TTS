import { useSyncExternalStore } from "react";

const paperTitles = new Map<string, string>();
const listeners = new Set<() => void>();
let version = 0;
const storageKey = "paper-title-store";

loadPaperTitlesFromSessionStorage();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return version;
}

function loadPaperTitlesFromSessionStorage() {
  if (typeof window === "undefined") {
    return;
  }

  const rawValue = window.sessionStorage.getItem(storageKey);
  if (!rawValue) {
    return;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<string, string>;

    Object.entries(parsedValue).forEach(([paperId, title]) => {
      const normalizedPaperId = paperId.trim();
      const normalizedTitle = title.trim();

      if (normalizedPaperId && normalizedTitle) {
        paperTitles.set(normalizedPaperId, normalizedTitle);
      }
    });
  } catch {
    window.sessionStorage.removeItem(storageKey);
  }
}

function savePaperTitlesToSessionStorage() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    storageKey,
    JSON.stringify(Object.fromEntries(paperTitles)),
  );
}

export function usePaperTitleStoreVersion() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function setPaperTitle(paperId: string, title: string) {
  const normalizedPaperId = paperId.trim();
  const normalizedTitle = title.trim();

  if (!normalizedPaperId || !normalizedTitle) {
    return;
  }

  if (paperTitles.get(normalizedPaperId) === normalizedTitle) {
    return;
  }

  paperTitles.set(normalizedPaperId, normalizedTitle);
  savePaperTitlesToSessionStorage();
  version += 1;
  emitChange();
}

export function getPaperTitle(paperId: string) {
  return paperTitles.get(paperId.trim()) || "";
}
