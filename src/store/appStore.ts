import { configureStore } from "@reduxjs/toolkit";
import {
  paperDetailReducer,
  persistPaperTitlesToSessionStorage,
} from "./slices/paperDetailSlice";
import { searchPageReducer } from "./slices/searchPageSlice";

export const store = configureStore({
  reducer: {
    paperDetail: paperDetailReducer,
    searchPage: searchPageReducer,
  },
});

let lastPaperTitleVersion = store.getState().paperDetail.version;

store.subscribe(() => {
  const state = store.getState();
  const currentPaperTitleVersion = state.paperDetail.version;

  if (currentPaperTitleVersion === lastPaperTitleVersion) {
    return;
  }

  lastPaperTitleVersion = currentPaperTitleVersion;
  persistPaperTitlesToSessionStorage(state);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
