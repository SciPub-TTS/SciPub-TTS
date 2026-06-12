import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SEARCH_DEFAULT_PAGE, SEARCH_FILTER_OPTION_LIMIT } from "../constants";
import { mergeUniqueStrings } from "../services";
import { getFilterOptionPage } from "../services";
import type { RemoteOptionFilterKey } from "../types";
import type { SearchFilterOptions, SearchFilters } from "../types";
import {
  cloneRemoteFilterOptionsSnapshot,
  createDefaultRemoteFilterOptionsSnapshot,
  createRemoteOptionState,
  remoteOptionFilterKeys,
} from "./stateHelpers";
import type { RemoteFilterOptionsSnapshot } from "./types";

type RemoteFilterOptionsState = RemoteFilterOptionsSnapshot & {
  isLoadingFilterOptions: Record<RemoteOptionFilterKey, boolean>;
  isLoadingMoreFilterOptions: Record<RemoteOptionFilterKey, boolean>;
};

export function useRemoteFilterOptions(
  filters: SearchFilters,
  filtersOpen: boolean,
  restoredSnapshot: RemoteFilterOptionsSnapshot | undefined,
) {
  const queryClient = useQueryClient();
  const [remoteFilterOptionsState, setRemoteFilterOptionsState] =
    useState<RemoteFilterOptionsState>(() =>
      createInitialRemoteFilterOptionsState(restoredSnapshot),
    );
  const remoteFilterOptionsStateRef = useRef(remoteFilterOptionsState);
  const searchTimeoutRef = useRef<Record<RemoteOptionFilterKey, number | null>>({
    type: null,
    subField: null,
    author: null,
    institution: null,
    country: null,
    award: null,
    source: null,
  });

  useEffect(() => {
    remoteFilterOptionsStateRef.current = remoteFilterOptionsState;
  }, [remoteFilterOptionsState]);

  useEffect(() => {
    const timeoutLookup = searchTimeoutRef.current;

    return () => {
      for (const filterKey of remoteOptionFilterKeys) {
        const timeoutId = timeoutLookup[filterKey];

        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }

    for (const filterKey of remoteOptionFilterKeys) {
      const currentState = remoteFilterOptionsStateRef.current;

      if (
        currentState.remoteOptionKeywords[filterKey]
        || currentState.filterOptions[filterKey].length > 0
        || currentState.isLoadingFilterOptions[filterKey]
      ) {
        continue;
      }

      updateRemoteFilterOptionsState((state) => ({
        ...state,
        isLoadingFilterOptions: {
          ...state.isLoadingFilterOptions,
          [filterKey]: true,
        },
      }));
      void loadFirstFilterOptionPage(filterKey, "");
    }
  }, [filtersOpen]);

  async function loadFirstFilterOptionPage(
    filterKey: RemoteOptionFilterKey,
    keyword: string,
  ) {
    try {
      const optionsPage = await readFilterOptionPage(filterKey, keyword, 1);
      const currentKeyword =
        remoteFilterOptionsStateRef.current.remoteOptionKeywords[filterKey];

      if (currentKeyword !== keyword) {
        return;
      }

      updateRemoteFilterOptionsState((state) => ({
        ...state,
        filterOptions: {
          ...state.filterOptions,
          [filterKey]: optionsPage.options,
        },
        hasMoreFilterOptions: {
          ...state.hasMoreFilterOptions,
          [filterKey]: optionsPage.hasMore,
        },
        optionValueLookup: {
          ...state.optionValueLookup,
          [filterKey]: optionsPage.valueLookup,
        },
        remoteOptionPages: {
          ...state.remoteOptionPages,
          [filterKey]: SEARCH_DEFAULT_PAGE,
        },
      }));
    } catch (error) {
      const errorMessage = keyword
        ? "Cannot search filter options:"
        : "Cannot load base filter options:";
      console.error(errorMessage, error);
    } finally {
      const currentKeyword =
        remoteFilterOptionsStateRef.current.remoteOptionKeywords[filterKey];

      if (currentKeyword !== keyword) {
        return;
      }

      updateRemoteFilterOptionsState((state) => ({
        ...state,
        isLoadingFilterOptions: {
          ...state.isLoadingFilterOptions,
          [filterKey]: false,
        },
      }));
    }
  }

  function handleFilterOptionSearch(
    filterKey: RemoteOptionFilterKey,
    keyword: string,
  ) {
    const currentTimeoutId = searchTimeoutRef.current[filterKey];

    if (currentTimeoutId !== null) {
      window.clearTimeout(currentTimeoutId);
    }

    const normalizedKeyword = keyword.trim();

    updateRemoteFilterOptionsState((state) => ({
      ...state,
      isLoadingFilterOptions: {
        ...state.isLoadingFilterOptions,
        [filterKey]: true,
      },
      remoteOptionKeywords: {
        ...state.remoteOptionKeywords,
        [filterKey]: normalizedKeyword,
      },
      remoteOptionPages: {
        ...state.remoteOptionPages,
        [filterKey]: SEARCH_DEFAULT_PAGE,
      },
    }));

    if (!normalizedKeyword) {
      void loadFirstFilterOptionPage(filterKey, "");
      return;
    }

    searchTimeoutRef.current[filterKey] = window.setTimeout(() => {
      void loadFirstFilterOptionPage(filterKey, normalizedKeyword);
    }, 300);
  }

  async function handleLoadMoreFilterOptions(filterKey: RemoteOptionFilterKey) {
    const currentState = remoteFilterOptionsStateRef.current;
    const keyword = currentState.remoteOptionKeywords[filterKey];
    const nextPage = currentState.remoteOptionPages[filterKey] + 1;

    if (
      !keyword
      || !currentState.hasMoreFilterOptions[filterKey]
      || currentState.isLoadingFilterOptions[filterKey]
      || currentState.isLoadingMoreFilterOptions[filterKey]
    ) {
      return;
    }

    updateRemoteFilterOptionsState((state) => ({
      ...state,
      isLoadingMoreFilterOptions: {
        ...state.isLoadingMoreFilterOptions,
        [filterKey]: true,
      },
    }));

    try {
      const optionsPage = await readFilterOptionPage(filterKey, keyword, nextPage);
      const currentKeyword =
        remoteFilterOptionsStateRef.current.remoteOptionKeywords[filterKey];

      if (currentKeyword !== keyword) {
        return;
      }

      updateRemoteFilterOptionsState((state) => ({
        ...state,
        filterOptions: {
          ...state.filterOptions,
          [filterKey]: mergeUniqueStrings(
            state.filterOptions[filterKey],
            optionsPage.options,
          ),
        },
        hasMoreFilterOptions: {
          ...state.hasMoreFilterOptions,
          [filterKey]: optionsPage.hasMore,
        },
        optionValueLookup: {
          ...state.optionValueLookup,
          [filterKey]: {
            ...state.optionValueLookup[filterKey],
            ...optionsPage.valueLookup,
          },
        },
        remoteOptionPages: {
          ...state.remoteOptionPages,
          [filterKey]: nextPage,
        },
      }));
    } catch (error) {
      console.error("Cannot load more filter options:", error);
    } finally {
      const currentKeyword =
        remoteFilterOptionsStateRef.current.remoteOptionKeywords[filterKey];

      if (currentKeyword !== keyword) {
        return;
      }

      updateRemoteFilterOptionsState((state) => ({
        ...state,
        isLoadingMoreFilterOptions: {
          ...state.isLoadingMoreFilterOptions,
          [filterKey]: false,
        },
      }));
    }
  }

  const visibleFilterOptions = useMemo(
    () =>
      buildVisibleFilterOptions(remoteFilterOptionsState.filterOptions, filters),
    [filters, remoteFilterOptionsState.filterOptions],
  );
  const remoteFilterOptionsSnapshot = useMemo(
    () =>
      cloneRemoteFilterOptionsSnapshot({
        filterOptions: remoteFilterOptionsState.filterOptions,
        hasMoreFilterOptions: remoteFilterOptionsState.hasMoreFilterOptions,
        optionValueLookup: remoteFilterOptionsState.optionValueLookup,
        remoteOptionKeywords: remoteFilterOptionsState.remoteOptionKeywords,
        remoteOptionPages: remoteFilterOptionsState.remoteOptionPages,
      }),
    [
      remoteFilterOptionsState.filterOptions,
      remoteFilterOptionsState.hasMoreFilterOptions,
      remoteFilterOptionsState.optionValueLookup,
      remoteFilterOptionsState.remoteOptionKeywords,
      remoteFilterOptionsState.remoteOptionPages,
    ],
  );

  return {
    filterOptions: visibleFilterOptions,
    handleFilterOptionSearch,
    handleLoadMoreFilterOptions,
    hasMoreFilterOptions: remoteFilterOptionsState.hasMoreFilterOptions,
    isLoadingFilterOptions: remoteFilterOptionsState.isLoadingFilterOptions,
    isLoadingMoreFilterOptions:
      remoteFilterOptionsState.isLoadingMoreFilterOptions,
    optionValueLookup: remoteFilterOptionsState.optionValueLookup,
    remoteFilterOptionsSnapshot,
  };

  async function readFilterOptionPage(
    filterKey: RemoteOptionFilterKey,
    keyword: string,
    page: number,
  ) {
    return queryClient.fetchQuery({
      queryKey: [
        "searchFilterOptions",
        filterKey,
        keyword,
        page,
        SEARCH_FILTER_OPTION_LIMIT,
      ],
      queryFn: () =>
        getFilterOptionPage(
          filterKey,
          keyword,
          page,
          SEARCH_FILTER_OPTION_LIMIT,
        ),
      staleTime: 5 * 60 * 1000,
    });
  }

  function updateRemoteFilterOptionsState(
    updater: (state: RemoteFilterOptionsState) => RemoteFilterOptionsState,
  ) {
    setRemoteFilterOptionsState((currentState) => {
      const nextState = updater(currentState);
      remoteFilterOptionsStateRef.current = nextState;
      return nextState;
    });
  }
}

function createInitialRemoteFilterOptionsState(
  restoredSnapshot: RemoteFilterOptionsSnapshot | undefined,
): RemoteFilterOptionsState {
  const initialSnapshot = restoredSnapshot
    ? cloneRemoteFilterOptionsSnapshot(restoredSnapshot)
    : createDefaultRemoteFilterOptionsSnapshot();

  return {
    ...initialSnapshot,
    isLoadingFilterOptions: createRemoteOptionState(false),
    isLoadingMoreFilterOptions: createRemoteOptionState(false),
  };
}

function buildVisibleFilterOptions(
  filterOptions: SearchFilterOptions,
  filters: SearchFilters,
): SearchFilterOptions {
  return {
    type: mergeUniqueStrings(filters.type, filterOptions.type),
    subField: mergeUniqueStrings(filters.subField, filterOptions.subField),
    author: mergeUniqueStrings(filters.author, filterOptions.author),
    institution: mergeUniqueStrings(
      filters.institution,
      filterOptions.institution,
    ),
    country: mergeUniqueStrings(filters.country, filterOptions.country),
    source: mergeUniqueStrings(filters.source, filterOptions.source),
    award: mergeUniqueStrings(filters.award, filterOptions.award),
  };
}
