import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/store/appStore";

const storageKey = "detail-title-store";

export type DetailTitleEntityType = "works" | "authors" | "topics";

type DetailTitleState = {
  titleByKey: Record<string, string>;
  version: number;
};

const initialState: DetailTitleState = {
  titleByKey: loadDetailTitlesFromSessionStorage(),
  version: 0,
};

const detailTitleSlice = createSlice({
  name: "detailTitle",
  initialState,
  reducers: {
    setDetailTitleEntry(
      state,
      action: PayloadAction<{
        entityId: string;
        entityType: DetailTitleEntityType;
        title: string;
      }>,
    ) {
      const entityId = action.payload.entityId.trim();
      const title = action.payload.title.trim();

      if (!entityId || !title) {
        return;
      }

      const key = buildDetailTitleKey(action.payload.entityType, entityId);

      if (state.titleByKey[key] === title) {
        return;
      }

      state.titleByKey[key] = title;
      state.version += 1;
    },
  },
});

export const { setDetailTitleEntry } = detailTitleSlice.actions;

export const detailTitleReducer = detailTitleSlice.reducer;

export function selectDetailTitle(
  state: RootState,
  entityType: DetailTitleEntityType,
  entityId: string,
) {
  return state.detailTitle.titleByKey[
    buildDetailTitleKey(entityType, entityId)
  ] || "";
}

export function selectDetailTitleStoreVersion(state: RootState) {
  return state.detailTitle.version;
}

export function persistDetailTitlesToSessionStorage(state: RootState) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    storageKey,
    JSON.stringify(state.detailTitle.titleByKey),
  );
}

function loadDetailTitlesFromSessionStorage() {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.sessionStorage.getItem(storageKey);

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<string, string>;
    const entries: Record<string, string> = {};

    for (const [entityKey, title] of Object.entries(parsedValue)) {
      const normalizedEntityKey = entityKey.trim();
      const normalizedTitle = title.trim();

      if (normalizedEntityKey && normalizedTitle) {
        entries[normalizedEntityKey] = normalizedTitle;
      }
    }

    return entries;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return {};
  }
}

function buildDetailTitleKey(
  entityType: DetailTitleEntityType,
  entityId: string,
) {
  return `${entityType}:${entityId.trim()}`;
}
