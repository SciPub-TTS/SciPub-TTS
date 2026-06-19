import { defaultSearchSortState } from "../services";
import type {
  SearchEntityType,
  SearchFilters,
  SearchFilterWidgetKey,
} from "../types";
import { countActiveFilters } from "../utils";
import type { SearchPageSnapshot } from "./types";

const authorFilterWidgets: SearchFilterWidgetKey[] = [
  "institution",
  "country",
  "primaryTopic",
];

const topicFilterWidgets: SearchFilterWidgetKey[] = [
  "subField",
  "field",
];

export function getSearchMutationErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  return error instanceof Error ? error.message : fallbackMessage;
}

export function shouldClearSearchState(
  entityType: SearchEntityType,
  searchQuery: string,
  filters: SearchFilters,
) {
  return !searchQuery && countActiveFilters(entityType, filters) === 0;
}

export function getVisibleFilterWidgets(
  entityType: SearchEntityType,
  visibleFilterWidgets: SearchFilterWidgetKey[],
) {
  switch (entityType) {
    case "authors":
      return authorFilterWidgets;
    case "topics":
      return topicFilterWidgets;
    default:
      return visibleFilterWidgets;
  }
}

export function getNextSortStateForEntityType(
  currentEntityType: SearchEntityType,
  nextEntityType: SearchEntityType,
  currentSortState: SearchPageSnapshot["sortState"],
) {
  const isCrossingWorkBoundary =
    (currentEntityType === "works") !== (nextEntityType === "works");

  return isCrossingWorkBoundary
    ? { ...defaultSearchSortState }
    : currentSortState;
}

