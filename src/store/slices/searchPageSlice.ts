import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  defaultVisibleFilterWidgets,
  initialFilters,
} from "@/features/search/constants";
import type { SearchOptionValueLookup } from "@/features/search/services";
import {
  defaultSearchSortState,
  normalizeSearchSortState,
  normalizeSearchTabEntityType,
} from "@/features/search/services";
import type {
  SearchEntityType,
  SearchFilters,
  SearchFilterWidgetKey,
  SearchSortState,
} from "@/features/search/types";
import {
  cloneSearchFilters,
  cloneSearchOptionValueLookup,
  restoreSubmittedSearch,
} from "@/features/search/hooks/stateHelpers";
import type {
  SearchPageSnapshot,
  SubmittedSearch,
} from "@/features/search/hooks/types";
import { normalizeSearchFilterWidgetKeys } from "@/features/search/utils";
import type { RootState } from "../appStore";

type SearchPageState = {
  activeEntityType: SearchEntityType;
  filters: SearchFilters;
  filtersOpen: boolean;
  searchQuery: string;
  sortState: SearchSortState;
  submittedSearch: SubmittedSearch | null;
  visibleFilterWidgets: SearchFilterWidgetKey[];
};

type UpdateSearchFilterPayload = {
  key: keyof SearchFilters;
  value: SearchFilters[keyof SearchFilters];
};

type SubmitSearchPayload = {
  appliedFilters: SearchFilters;
  appliedSearchQuery: string;
  entityType: SearchEntityType;
  optionValueLookup: SearchOptionValueLookup;
  sortState: SearchSortState;
};

const initialState: SearchPageState = createDefaultSearchPageState();

const searchPageSlice = createSlice({
  name: "searchPage",
  initialState,
  reducers: {
    resetSearchPageState() {
      return createDefaultSearchPageState();
    },
    hydrateSearchPageState(_, action: PayloadAction<SearchPageSnapshot>) {
      return createStateFromSnapshot(action.payload);
    },
    setActiveEntityType(state, action: PayloadAction<SearchEntityType>) {
      state.activeEntityType = normalizeSearchTabEntityType(action.payload);
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFiltersOpen(state, action: PayloadAction<boolean>) {
      state.filtersOpen = action.payload;
    },
    updateSearchFilter(state, action: PayloadAction<UpdateSearchFilterPayload>) {
      const { key, value } = action.payload;

      state.filters = {
        ...state.filters,
        [key]: value,
      };
    },
    setSortState(state, action: PayloadAction<SearchSortState>) {
      state.sortState = { ...action.payload };
    },
    submitSearch(state, action: PayloadAction<SubmitSearchPayload>) {
      state.submittedSearch = {
        appliedFilters: cloneSearchFilters(action.payload.appliedFilters),
        appliedSearchQuery: action.payload.appliedSearchQuery,
        entityType: normalizeSearchTabEntityType(action.payload.entityType),
        optionValueLookup: cloneSearchOptionValueLookup(
          action.payload.optionValueLookup,
        ),
        sortState: { ...action.payload.sortState },
      };
    },
    clearSearchResults(state) {
      state.submittedSearch = null;
    },
    toggleVisibleFilterWidget(
      state,
      action: PayloadAction<SearchFilterWidgetKey>,
    ) {
      const widgetKey = action.payload;

      if (state.visibleFilterWidgets.includes(widgetKey)) {
        state.visibleFilterWidgets = state.visibleFilterWidgets.filter(
          (currentWidget) => currentWidget !== widgetKey,
        );
        return;
      }

      state.visibleFilterWidgets = normalizeSearchFilterWidgetKeys([
        ...state.visibleFilterWidgets,
        widgetKey,
      ]);
    },
    resetSearchFilters(state) {
      state.filters = cloneSearchFilters(initialFilters);
    },
  },
});

export const {
  clearSearchResults,
  hydrateSearchPageState,
  resetSearchFilters,
  resetSearchPageState,
  setActiveEntityType,
  setFiltersOpen,
  setSearchQuery,
  setSortState,
  submitSearch,
  toggleVisibleFilterWidget,
  updateSearchFilter,
} = searchPageSlice.actions;

export const searchPageReducer = searchPageSlice.reducer;

export function selectSearchPageState(state: RootState) {
  return state.searchPage;
}

function createDefaultSearchPageState(): SearchPageState {
  return {
    activeEntityType: "works",
    filters: cloneSearchFilters(initialFilters),
    filtersOpen: false,
    searchQuery: "",
    sortState: { ...defaultSearchSortState },
    submittedSearch: null,
    visibleFilterWidgets: [...defaultVisibleFilterWidgets],
  };
}

function createStateFromSnapshot(snapshot: SearchPageSnapshot): SearchPageState {
  return {
    activeEntityType: normalizeSearchTabEntityType(snapshot.activeEntityType),
    filters: cloneSearchFilters(snapshot.filters),
    filtersOpen: snapshot.filtersOpen,
    searchQuery: snapshot.searchQuery,
    sortState: normalizeSearchSortState(snapshot.sortState),
    submittedSearch: restoreSubmittedSearch(snapshot),
    visibleFilterWidgets: normalizeSearchFilterWidgetKeys(
      snapshot.visibleFilterWidgets,
    ),
  };
}
