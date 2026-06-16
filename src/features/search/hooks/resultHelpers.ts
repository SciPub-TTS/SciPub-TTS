import { SEARCH_NEXT_QUERY_TRIGGER_OFFSET, SEARCH_WORKS_PER_PAGE } from "../constants";
import { sortPaperResults } from "../services";
import type { SearchResultsPage } from "../services";
import type {
  PaperResult,
  SearchEntityType,
  SearchResultItem,
  SearchSortState,
} from "../types";

export function mergeUniqueStrings(existing: string[], incoming: string[]) {
  const seen = new Set(existing);
  const merged = [...existing];

  for (const value of incoming) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    merged.push(value);
  }

  return merged;
}

export function flattenSearchResultPages(
  pages: SearchResultsPage[],
  entityType: SearchEntityType,
  sortState: SearchSortState,
) {
  let mergedResults: SearchResultItem[] = [];

  for (const page of pages) {
    const pageItems = getPageItems(page);
    mergedResults = mergeUniqueSearchResults(mergedResults, pageItems);
  }

  if (entityType !== "works") {
    return mergedResults;
  }

  return sortPaperResults(mergedResults as PaperResult[], sortState);
}

export function getNextSearchResultsPage(
  lastPage: SearchResultsPage,
  allPages: SearchResultsPage[],
) {
  if (!isWorksResultsPage(lastPage)) {
    return lastPage.hasMore ? lastPage.page + 1 : undefined;
  }

  const loadedResultCount = allPages.reduce((totalCount, page) => {
    const pageItems = getPageItems(page);
    return totalCount + pageItems.length;
  }, 0);
  const lastPageItems = getPageItems(lastPage);

  if (lastPageItems.length === 0) {
    return undefined;
  }

  if (loadedResultCount >= lastPage.totalCount) {
    return undefined;
  }

  return lastPage.page + 1;
}

export function getSearchResponseTime(pages: SearchResultsPage[]) {
  if (pages.length === 0) {
    return 0;
  }

  return pages[pages.length - 1].responseTimeSeconds;
}

export function getAutoLoadAnchorIndex(
  hasSearched: boolean,
  hasMoreResults: boolean,
  loadedPageCount: number,
) {
  if (!hasSearched || !hasMoreResults || loadedPageCount <= 0) {
    return -1;
  }

  return (
    (loadedPageCount - 1) * SEARCH_WORKS_PER_PAGE
    + SEARCH_NEXT_QUERY_TRIGGER_OFFSET
    - 1
  );
}

function mergeUniqueSearchResults(
  existing: SearchResultItem[],
  incoming: SearchResultItem[],
) {
  const seenIds = new Set<string>();
  const merged: SearchResultItem[] = [];

  for (const item of existing) {
    seenIds.add(`${item.entityType}:${item.id}`);
    merged.push(item);
  }

  for (const item of incoming) {
    const itemKey = `${item.entityType}:${item.id}`;

    if (!seenIds.has(itemKey)) {
      seenIds.add(itemKey);
      merged.push(item);
    }
  }

  return merged;
}

function getPageItems(page: SearchResultsPage): SearchResultItem[] {
  if ("works" in page && Array.isArray(page.works)) {
    return page.works;
  }

  if ("items" in page && Array.isArray(page.items)) {
    return page.items;
  }

  return [];
}

function isWorksResultsPage(page: SearchResultsPage): page is Extract<SearchResultsPage, { entityType: "works" }> {
  return page.entityType === "works" && "works" in page && Array.isArray(page.works);
}
