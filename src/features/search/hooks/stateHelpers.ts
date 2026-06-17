import { initialFilters, SEARCH_DEFAULT_PAGE } from "../constants";
import {
  emptySearchFilterOptions,
  emptySearchOptionValueLookup,
  normalizeSearchTabEntityType,
  normalizeSearchSortState,
} from "../services";
import type { SearchOptionValueLookup } from "../services";
import type {
  RemoteOptionFilterKey,
  SearchEntityType,
  SearchFilterOptions,
  SearchFilters,
} from "../types";
import { countActiveFilters, normalizeSearchFilterWidgetKeys } from "../utils";
import { searchPageStateStorageKey } from "../utils/navigationState";
import type {
  RemoteFilterOptionsSnapshot,
  SearchPageSnapshot,
  SubmittedSearch,
} from "./types";

export const remoteOptionFilterKeys: RemoteOptionFilterKey[] = [
  "type",
  "subField",
  "author",
  "institution",
  "country",
  "primaryTopic",
  "field",
  "award",
  "source",
];

type SearchPageStateLike = {
  activeEntityType: SearchEntityType;
  filters: SearchFilters;
  filtersOpen: boolean;
  searchQuery: string;
  sortState: SubmittedSearch["sortState"];
  submittedSearch: SubmittedSearch | null;
  visibleFilterWidgets: SearchPageSnapshot["visibleFilterWidgets"];
};

type LegacySearchPageSnapshot = Partial<SearchPageSnapshot> & {
  activeEntityType?: SearchEntityType;
  appliedFilters?: SearchFilters;
  appliedSearchQuery?: string;
  entityType?: SearchEntityType;
  filterOptions?: SearchFilterOptions;
  optionValueLookup?: SearchOptionValueLookup;
  selectedSort?: string;
  selectedSorts?: string[];
  submittedSearch?: (Partial<SubmittedSearch> & {
    selectedSorts?: string[];
    sortState?: SubmittedSearch["sortState"];
  }) | null;
};

export function createRemoteOptionState<T>(value: T): Record<RemoteOptionFilterKey, T> {
  return {
    type: value,
    subField: value,
    author: value,
    institution: value,
    country: value,
    primaryTopic: value,
    field: value,
    award: value,
    source: value,
  };
}

export function isReloadNavigation() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigationEntries = window.performance.getEntriesByType("navigation");
  const navigationEntry = navigationEntries[0] as
    | PerformanceNavigationTiming
    | undefined;

  return navigationEntry?.type === "reload";
}

export function cloneSearchFilters(filters: SearchFilters): SearchFilters {
  return {
    yearMode: filters.yearMode === "exact" ? "exact" : "range",
    yearFrom: filters.yearFrom || "",
    yearTo: filters.yearTo || "",
    yearExact: filters.yearExact || "",
    type: [...(filters.type || [])],
    openAccess: Boolean(filters.openAccess),
    subField: [...(filters.subField || [])],
    author: [...(filters.author || [])],
    institution: [...(filters.institution || [])],
    pdf: Boolean(filters.pdf),
    country: [...(filters.country || [])],
    primaryTopic: [...(filters.primaryTopic || [])],
    field: [...(filters.field || [])],
    citationMode: filters.citationMode === "exact" ? "exact" : "range",
    citationMin: filters.citationMin || "",
    citationMax: filters.citationMax || "",
    citationExact: filters.citationExact || "",
    source: [...(filters.source || [])],
    award: [...(filters.award || [])],
    indexedByOrcid:
      filters.indexedByOrcid === "is" || filters.indexedByOrcid === "is not"
        ? filters.indexedByOrcid
        : "",
  };
}

export function cloneSearchFilterOptions(options: SearchFilterOptions): SearchFilterOptions {
  return {
    type: [...(options.type || [])],
    subField: [...(options.subField || [])],
    author: [...(options.author || [])],
    institution: [...(options.institution || [])],
    country: [...(options.country || [])],
    primaryTopic: [...(options.primaryTopic || [])],
    field: [...(options.field || [])],
    source: [...(options.source || [])],
    award: [...(options.award || [])],
  };
}

export function cloneSearchOptionValueLookup(
  optionValueLookup: SearchOptionValueLookup,
): SearchOptionValueLookup {
  return {
    type: {
      ...(optionValueLookup.type || {}),
    },
    subField: {
      ...(optionValueLookup.subField || {}),
    },
    author: {
      ...(optionValueLookup.author || {}),
    },
    institution: {
      ...(optionValueLookup.institution || {}),
    },
    country: {
      ...(optionValueLookup.country || {}),
    },
    primaryTopic: {
      ...(optionValueLookup.primaryTopic || {}),
    },
    field: {
      ...(optionValueLookup.field || {}),
    },
    source: {
      ...(optionValueLookup.source || {}),
    },
    award: {
      ...(optionValueLookup.award || {}),
    },
  };
}

export function cloneSubmittedSearch(submittedSearch: SubmittedSearch | null) {
  if (!submittedSearch) {
    return null;
  }

  return {
    appliedFilters: cloneSearchFilters(submittedSearch.appliedFilters),
    appliedSearchQuery: submittedSearch.appliedSearchQuery,
    entityType: submittedSearch.entityType,
    optionValueLookup: cloneSearchOptionValueLookup(
      submittedSearch.optionValueLookup,
    ),
    sortState: { ...submittedSearch.sortState },
  };
}

export function createDefaultRemoteFilterOptionsSnapshot(): RemoteFilterOptionsSnapshot {
  return {
    filterOptions: cloneSearchFilterOptions(emptySearchFilterOptions),
    hasMoreFilterOptions: createRemoteOptionState(false),
    optionValueLookup: cloneSearchOptionValueLookup(
      emptySearchOptionValueLookup,
    ),
    remoteOptionKeywords: createRemoteOptionState(""),
    remoteOptionPages: createRemoteOptionState(SEARCH_DEFAULT_PAGE),
  };
}

export function cloneRemoteFilterOptionsSnapshot(
  remoteFilterOptions: RemoteFilterOptionsSnapshot,
): RemoteFilterOptionsSnapshot {
  return {
    filterOptions: cloneSearchFilterOptions(remoteFilterOptions.filterOptions),
    hasMoreFilterOptions: {
      ...remoteFilterOptions.hasMoreFilterOptions,
    },
    optionValueLookup: cloneSearchOptionValueLookup(
      remoteFilterOptions.optionValueLookup,
    ),
    remoteOptionKeywords: {
      ...remoteFilterOptions.remoteOptionKeywords,
    },
    remoteOptionPages: {
      ...remoteFilterOptions.remoteOptionPages,
    },
  };
}

export function buildSearchPageSnapshot(
  searchPageState: SearchPageStateLike,
  remoteFilterOptions: RemoteFilterOptionsSnapshot,
  scrollY: number,
): SearchPageSnapshot {
  return {
    activeEntityType: searchPageState.activeEntityType,
    filters: cloneSearchFilters(searchPageState.filters),
    filtersOpen: searchPageState.filtersOpen,
    remoteFilterOptions: cloneRemoteFilterOptionsSnapshot(remoteFilterOptions),
    scrollY,
    searchQuery: searchPageState.searchQuery,
    sortState: { ...searchPageState.sortState },
    submittedSearch: cloneSubmittedSearch(searchPageState.submittedSearch),
    visibleFilterWidgets: [...searchPageState.visibleFilterWidgets],
  };
}

export function restoreSubmittedSearch(snapshot: LegacySearchPageSnapshot | null) {
  if (!snapshot) {
    return null;
  }

  if (
    snapshot.submittedSearch
    && snapshot.submittedSearch.appliedFilters
    && snapshot.submittedSearch.appliedSearchQuery !== undefined
    && snapshot.submittedSearch.optionValueLookup
  ) {
    return {
      appliedFilters: cloneSearchFilters(snapshot.submittedSearch.appliedFilters),
      appliedSearchQuery: snapshot.submittedSearch.appliedSearchQuery,
      entityType: normalizeSearchTabEntityType(
        snapshot.submittedSearch.entityType,
      ),
      optionValueLookup: cloneSearchOptionValueLookup(
        snapshot.submittedSearch.optionValueLookup,
      ),
      sortState: normalizeSearchSortState(
        snapshot.submittedSearch.sortState
        ?? snapshot.submittedSearch.selectedSorts,
      ),
    };
  }

  const appliedFilters = snapshot.appliedFilters
    ? cloneSearchFilters(snapshot.appliedFilters)
    : cloneSearchFilters(initialFilters);
  const appliedSearchQuery = snapshot.appliedSearchQuery || "";
  const entityType = normalizeSearchTabEntityType(
    snapshot.entityType
    || snapshot.activeEntityType
    || "works",
  );

  if (!appliedSearchQuery && countActiveFilters(entityType, appliedFilters) === 0) {
    return null;
  }

  return {
    appliedFilters,
    appliedSearchQuery,
    entityType,
    optionValueLookup: cloneSearchOptionValueLookup(
      snapshot.optionValueLookup || emptySearchOptionValueLookup,
    ),
    sortState: normalizeSearchSortState(
      snapshot.sortState ?? snapshot.selectedSorts ?? snapshot.selectedSort,
    ),
  };
}

export function persistSearchPageSnapshot(snapshot: SearchPageSnapshot) {
  try {
    window.sessionStorage.setItem(
      searchPageStateStorageKey,
      JSON.stringify(snapshot),
    );
  } catch {
    // Ignore storage failures so search still works in restricted browsers.
  }
}

export function readPersistedSearchPageSnapshot(): SearchPageSnapshot | null {
  try {
    const storedSnapshot = window.sessionStorage.getItem(
      searchPageStateStorageKey,
    );

    if (!storedSnapshot) {
      return null;
    }

    const parsedSnapshot = JSON.parse(storedSnapshot) as LegacySearchPageSnapshot;
    const filters = parsedSnapshot.filters
      ? cloneSearchFilters(parsedSnapshot.filters)
      : parsedSnapshot.appliedFilters
        ? cloneSearchFilters(parsedSnapshot.appliedFilters)
        : cloneSearchFilters(initialFilters);
    const remoteFilterOptions = normalizeRemoteFilterOptionsSnapshot(
      parsedSnapshot.remoteFilterOptions,
      parsedSnapshot.filterOptions,
      parsedSnapshot.optionValueLookup,
    );

    return {
      activeEntityType: normalizeSearchTabEntityType(
        parsedSnapshot.activeEntityType
        || parsedSnapshot.entityType
        || "works",
      ),
      filters,
      filtersOpen: Boolean(parsedSnapshot.filtersOpen),
      remoteFilterOptions,
      scrollY: Number(parsedSnapshot.scrollY) || 0,
      searchQuery: parsedSnapshot.searchQuery || "",
      sortState: normalizeSearchSortState(
        parsedSnapshot.sortState
        ?? parsedSnapshot.selectedSorts
        ?? parsedSnapshot.selectedSort,
      ),
      submittedSearch: restoreSubmittedSearch(parsedSnapshot),
      visibleFilterWidgets: normalizeSearchFilterWidgetKeys(
        parsedSnapshot.visibleFilterWidgets || [],
      ),
    };
  } catch {
    return null;
  }
}

function normalizeRemoteFilterOptionsSnapshot(
  remoteFilterOptions: RemoteFilterOptionsSnapshot | undefined,
  legacyFilterOptions: SearchFilterOptions | undefined,
  legacyOptionValueLookup: SearchOptionValueLookup | undefined,
) {
  if (!remoteFilterOptions) {
    return {
      filterOptions: cloneSearchFilterOptions(
        legacyFilterOptions || emptySearchFilterOptions,
      ),
      hasMoreFilterOptions: createRemoteOptionState(false),
      optionValueLookup: cloneSearchOptionValueLookup(
        legacyOptionValueLookup || emptySearchOptionValueLookup,
      ),
      remoteOptionKeywords: createRemoteOptionState(""),
      remoteOptionPages: createRemoteOptionState(SEARCH_DEFAULT_PAGE),
    };
  }

  return {
    filterOptions: cloneSearchFilterOptions(
      remoteFilterOptions.filterOptions || emptySearchFilterOptions,
    ),
    hasMoreFilterOptions: {
      ...createRemoteOptionState(false),
      ...remoteFilterOptions.hasMoreFilterOptions,
    },
    optionValueLookup: cloneSearchOptionValueLookup(
      remoteFilterOptions.optionValueLookup || emptySearchOptionValueLookup,
    ),
    remoteOptionKeywords: {
      ...createRemoteOptionState(""),
      ...remoteFilterOptions.remoteOptionKeywords,
    },
    remoteOptionPages: {
      ...createRemoteOptionState(SEARCH_DEFAULT_PAGE),
      ...remoteFilterOptions.remoteOptionPages,
    },
  };
}
