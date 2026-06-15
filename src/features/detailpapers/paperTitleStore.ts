import { store, useAppSelector } from "@/store";
import {
  selectPaperTitle,
  selectPaperTitleStoreVersion,
  setPaperTitleEntry,
} from "@/store/slices/paperDetailSlice";

export function usePaperTitleStoreVersion() {
  return useAppSelector(selectPaperTitleStoreVersion);
}

export function setPaperTitle(paperId: string, title: string) {
  store.dispatch(setPaperTitleEntry({ paperId, title }));
}

export function getPaperTitle(paperId: string) {
  return selectPaperTitle(store.getState(), paperId);
}
