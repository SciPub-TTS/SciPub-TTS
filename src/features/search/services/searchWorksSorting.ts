import type { PaperResult, SearchSortState } from "../types";

export function sortPaperResults(
  works: PaperResult[],
  sortState: SearchSortState,
): PaperResult[] {
  if (sortState.sortBy === "relevance") {
    return [...works];
  }

  const sortedWorks = [...works];

  sortedWorks.sort((left, right) => {
    if (sortState.sortBy === "citation") {
      return sortState.sortDirection === "asc"
        ? compareNumbers(left.citations, right.citations)
          || compareNumbers(right.year, left.year)
          || compareText(left.title, right.title)
        : compareNumbers(right.citations, left.citations)
          || compareNumbers(right.year, left.year)
          || compareText(left.title, right.title);
    }

    return sortState.sortDirection === "asc"
      ? compareNumbers(left.year, right.year)
        || compareNumbers(right.citations, left.citations)
        || compareText(left.title, right.title)
      : compareNumbers(right.year, left.year)
        || compareNumbers(right.citations, left.citations)
        || compareText(left.title, right.title);
  });

  return sortedWorks;
}

function compareNumbers(left: number, right: number) {
  return left - right;
}

function compareText(left: string, right: string) {
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}
