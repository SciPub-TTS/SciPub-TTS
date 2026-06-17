import { configureStore } from "@reduxjs/toolkit";
import {
  detailTitleReducer,
  persistDetailTitlesToSessionStorage,
} from "@/features/detail/store/detailTitleSlice";
import { searchPageReducer } from "@/features/search/store/searchPageSlice";

export const store = configureStore({
  reducer: {
    detailTitle: detailTitleReducer,
    searchPage: searchPageReducer,
  },
});

let lastDetailTitleVersion = store.getState().detailTitle.version;

store.subscribe(() => {
  const state = store.getState();
  const currentDetailTitleVersion = state.detailTitle.version;

  if (currentDetailTitleVersion !== lastDetailTitleVersion) {
    lastDetailTitleVersion = currentDetailTitleVersion;
    persistDetailTitlesToSessionStorage(state);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
