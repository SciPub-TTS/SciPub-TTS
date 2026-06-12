import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../appStore";

const storageKey = "paper-title-store";

type PaperTitleState = {
  titleById: Record<string, string>;
  version: number;
};

const initialState: PaperTitleState = {
  titleById: loadPaperTitlesFromSessionStorage(),
  version: 0,
};

const paperDetailSlice = createSlice({
  name: "paperDetail",
  initialState,
  reducers: {
    setPaperTitleEntry(
      state,
      action: PayloadAction<{ paperId: string; title: string }>,
    ) {
      const paperId = action.payload.paperId.trim();
      const title = action.payload.title.trim();

      if (!paperId || !title) {
        return;
      }

      if (state.titleById[paperId] === title) {
        return;
      }

      state.titleById[paperId] = title;
      state.version += 1;
    },
  },
});

export const { setPaperTitleEntry } = paperDetailSlice.actions;

export const paperDetailReducer = paperDetailSlice.reducer;

export function selectPaperTitle(state: RootState, paperId: string) {
  return state.paperDetail.titleById[paperId.trim()] || "";
}

export function selectPaperTitleStoreVersion(state: RootState) {
  return state.paperDetail.version;
}

export function persistPaperTitlesToSessionStorage(state: RootState) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    storageKey,
    JSON.stringify(state.paperDetail.titleById),
  );
}

function loadPaperTitlesFromSessionStorage() {
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

    for (const [paperId, title] of Object.entries(parsedValue)) {
      const normalizedPaperId = paperId.trim();
      const normalizedTitle = title.trim();

      if (normalizedPaperId && normalizedTitle) {
        entries[normalizedPaperId] = normalizedTitle;
      }
    }

    return entries;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return {};
  }
}
