import { SEARCH_NEXT_QUERY_TRIGGER_OFFSET, SEARCH_WORKS_PER_PAGE } from "../constants";
import { sortPaperResults } from "../services";
import type { PaperResult, SearchSortState } from "../types";
import type { SearchWorksState } from "../services";

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
  pages: SearchWorksState[],
  sortState: SearchSortState,
) {
  let mergedResults: PaperResult[] = [];

  for (const page of pages) {
    mergedResults = mergeUniquePaperResults(mergedResults, page.works);
  }

  return sortPaperResults(mergedResults, sortState);
}

export function getNextSearchResultsPage(
  lastPage: SearchWorksState,
  allPages: SearchWorksState[],
) {
  const loadedResultCount = allPages.reduce(
    (totalCount, page) => totalCount + page.works.length,
    0,
  );

  if (lastPage.works.length === 0) {
    return undefined;
  }

  if (loadedResultCount >= lastPage.totalCount) {
    return undefined;
  }

  return lastPage.page + 1;
}

export function getSearchResponseTime(pages: SearchWorksState[]) {
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

function mergeUniquePaperResults(
  existing: PaperResult[],
  incoming: PaperResult[],
) {
  const seenIds = new Set<string>();
  const merged: PaperResult[] = [];

  for (const paper of existing) {
    seenIds.add(paper.id);
    merged.push(paper);
  }

  for (const paper of incoming) {
    if (!seenIds.has(paper.id)) {
      seenIds.add(paper.id);
      merged.push(paper);
    }
  }

  return merged;
}
