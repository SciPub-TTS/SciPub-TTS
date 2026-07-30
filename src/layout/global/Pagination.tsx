import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  maxPage?: number;
  pageSize: number;
  showLastPageShortcut?: boolean;
  totalItems: number;
  onPageChange: (page: number) => void;
};

type PaginationItem = number | "ellipsis";

const SIBLING_COUNT = 1;
const pageButtonClassName =
  "h-9 min-w-9 rounded-lg border border-black px-3 text-sm font-bold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";
const iconButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-black text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-black disabled:hover:bg-white disabled:hover:text-black";

export default function Pagination({
  currentPage,
  maxPage,
  pageSize,
  showLastPageShortcut = true,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const safePageSize = Math.max(1, pageSize);
  const rawTotalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const totalPages = Math.max(
    1,
    Math.min(rawTotalPages, maxPage ?? rawTotalPages),
  );
  const normalizedCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const canGoPrevious = normalizedCurrentPage > 1;
  const canGoNext = normalizedCurrentPage < totalPages;
  const startItem =
    totalItems === 0 ? 0 : (normalizedCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(normalizedCurrentPage * safePageSize, totalItems);
  const pageItems = getPaginationItems(
    normalizedCurrentPage,
    totalPages,
    showLastPageShortcut,
  );

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages || page === normalizedCurrentPage) {
      return;
    }

    onPageChange(page);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-black px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-black">
        Showing {startItem}-{endItem} of {totalItems}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          aria-label="Previous page"
          className={iconButtonClassName}
          disabled={!canGoPrevious}
          onClick={() => handlePageChange(normalizedCurrentPage - 1)}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 min-w-9 items-center justify-center px-2 text-sm font-bold text-black"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              aria-current={item === normalizedCurrentPage ? "page" : undefined}
              className={[
                pageButtonClassName,
                item === normalizedCurrentPage
                  ? "border-[#14532D] bg-[#14532D] text-white"
                  : "",
              ].join(" ")}
              onClick={() => handlePageChange(item)}
              type="button"
            >
              {item}
            </button>
          ),
        )}

        <button
          aria-label="Next page"
          className={iconButtonClassName}
          disabled={!canGoNext}
          onClick={() => handlePageChange(normalizedCurrentPage + 1)}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
  showLastPageShortcut: boolean,
): PaginationItem[] {
  const totalVisibleSlots = SIBLING_COUNT * 2 + 5;

  if (totalPages <= totalVisibleSlots) {
    return createPageRange(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - SIBLING_COUNT, 1);
  const rightSibling = Math.min(currentPage + SIBLING_COUNT, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leadingRange = createPageRange(1, 3 + SIBLING_COUNT * 2);

    return showLastPageShortcut
      ? [...leadingRange, "ellipsis", totalPages]
      : [...leadingRange, "ellipsis"];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [
      1,
      "ellipsis",
      ...createPageRange(totalPages - (2 + SIBLING_COUNT * 2), totalPages),
    ];
  }

  return [
    1,
    "ellipsis",
    ...createPageRange(leftSibling, rightSibling),
    "ellipsis",
    ...(showLastPageShortcut ? [totalPages] : []),
  ];
}

function createPageRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
