import { store, useAppSelector } from "@/store";
import {
  selectDetailTitle,
  selectDetailTitleStoreVersion,
  setDetailTitleEntry,
  type DetailTitleEntityType,
} from "./detailTitleSlice";

export type { DetailTitleEntityType } from "./detailTitleSlice";

export function useDetailTitleStoreVersion() {
  return useAppSelector(selectDetailTitleStoreVersion);
}

export function setDetailTitle(
  entityType: DetailTitleEntityType,
  entityId: string,
  title: string,
) {
  store.dispatch(setDetailTitleEntry({ entityId, entityType, title }));
}

export function getDetailTitle(
  entityType: DetailTitleEntityType,
  entityId: string,
) {
  return selectDetailTitle(store.getState(), entityType, entityId);
}
