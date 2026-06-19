import { useEffect, useRef } from "react";

import { hydrateSearchPageState, resetSearchPageState } from "../store/searchPageSlice";
import {
  buildSearchPageSnapshot,
  persistSearchPageSnapshot,
} from "./stateHelpers";
import type {
  RemoteFilterOptionsSnapshot,
  SearchPageSnapshot,
  SubmittedSearch,
} from "./types";
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
  restoredSnapshot: SearchPageSnapshot | null;
  remoteFilterOptionsSnapshot: RemoteFilterOptionsSnapshot;
  searchPageState: SearchPageStateForPersistence;
  visibleResultCount: number;
};

// Search state needs two persistence behaviors:
// 1. hydrate when we navigate back from detail pages
// 2. keep the latest snapshot in session storage while the user edits/searches
export function useSearchPagePersistence(
  params: UseSearchPagePersistenceParams,
) {
  const {
    dispatch,
    restoredSnapshot,
    remoteFilterOptionsSnapshot,
    searchPageState,
    visibleResultCount,
  } = params;
  const hasInitializedRef = useRef(false);
  const latestSnapshotRef = useRef<SearchPageSnapshot | null>(restoredSnapshot);
  const shouldRestoreScrollRef = useRef(Boolean(restoredSnapshot));

  useEffect(() => {
    if (restoredSnapshot) {
      dispatch(hydrateSearchPageState(restoredSnapshot));
    } else {
      dispatch(resetSearchPageState());
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

      dispatch(resetSearchPageState());
    };
  }, [dispatch, restoredSnapshot]);

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

  useEffect(() => {
    if (!shouldRestoreScrollRef.current) {
      return;
    }

    shouldRestoreScrollRef.current = false;
    const restoredScrollY = restoredSnapshot?.scrollY ?? 0;

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: restoredScrollY,
        behavior: "auto",
      });
    });
  }, [restoredSnapshot, visibleResultCount]);
}

