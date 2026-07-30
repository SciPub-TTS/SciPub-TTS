import { useEffect, useRef } from "react";

import { hydrateSearchPageState, resetSearchPageState } from "../store/searchPageSlice";
import {
  buildSearchPageSnapshot,
  persistSearchPageSnapshot,
  type RemoteFilterOptionsSnapshot,
  type SearchPageSnapshot,
  type SubmittedSearch,
} from "./stateHelpers";
import type { AppDispatch } from "@/store/appStore";
import type {
  SearchEntityType,
  SearchFilters,
  SearchFilterWidgetKey,
} from "../types";
import { clearSearchPageRestorePending } from "../utils/navigationState";

type SearchPageStateForPersistence = {
  activeEntityType: SearchEntityType;
  filters: SearchFilters;
  filtersOpen: boolean;
  searchQuery: string;
  sortState: SearchPageSnapshot["sortState"];
  submittedSearch: SubmittedSearch | null;
  visibleFilterWidgets: SearchFilterWidgetKey[];
};

type UseSearchPagePersistenceParams = {
  dispatch: AppDispatch;
  initialEntityType?: SearchEntityType | null;
  restoredSnapshot: SearchPageSnapshot | null;
  remoteFilterOptionsSnapshot: RemoteFilterOptionsSnapshot;
  searchPageState: SearchPageStateForPersistence;
};

export function useSearchPagePersistence(
  params: UseSearchPagePersistenceParams,
) {
  const {
    dispatch,
    initialEntityType,
    restoredSnapshot,
    remoteFilterOptionsSnapshot,
    searchPageState,
  } = params;
  const hasInitializedRef = useRef(false);
  const latestSnapshotRef = useRef<SearchPageSnapshot | null>(restoredSnapshot);

  useEffect(() => {
    if (restoredSnapshot) {
      dispatch(hydrateSearchPageState(restoredSnapshot));
    } else if (initialEntityType) {
      dispatch(resetSearchPageState(initialEntityType));
    }

    clearSearchPageRestorePending();

    return () => {
      const latestSnapshot = latestSnapshotRef.current;

      if (latestSnapshot) {
        persistSearchPageSnapshot({
          ...latestSnapshot,
          scrollY: window.scrollY,
        });
      }
    };
  }, [dispatch, initialEntityType, restoredSnapshot]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    const snapshot = buildSearchPageSnapshot(
      searchPageState,
      remoteFilterOptionsSnapshot,
      window.scrollY,
    );

    latestSnapshotRef.current = snapshot;
    persistSearchPageSnapshot(snapshot);
  }, [remoteFilterOptionsSnapshot, searchPageState]);
}
