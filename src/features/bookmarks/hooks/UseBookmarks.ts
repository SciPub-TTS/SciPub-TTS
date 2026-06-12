import { useCallback, useEffect, useRef, useState } from "react";

import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import type {
    BookmarkFilters,
    BookmarkResponse,
    BookmarkStatsResponse,
    FilterOptionsResponse,
} from "@/features/bookmarks/types/bookmark.types";

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: BookmarkFilters = {
    keyword: "",
    topic: "",
    source: "",
    author: "",
    year: null,
    sort: "RECENT",
};

export function useBookmarks() {
    const [items, setItems] = useState<BookmarkResponse[]>([]);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<BookmarkFilters>(DEFAULT_FILTERS);

    const [stats, setStats] = useState<BookmarkStatsResponse | null>(null);
    const [filterOptions, setFilterOptions] =
        useState<FilterOptionsResponse | null>(null);

    /**
     * requestIdRef dùng để chống race condition:
     * request cũ về sau request mới thì không được ghi đè state mới.
     */
    const requestIdRef = useRef(0);

    const loadPage = useCallback(
        async (targetPage: number, append: boolean) => {
            const requestId = ++requestIdRef.current;

            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsRefreshing(true);
                setHasNext(false);
                setPage(0);
                setItems([]);
            }

            try {
                console.log("LOAD", {
                    targetPage,
                    append,
                    filters,
                });
                const res = await bookmarkApi.getList({
                    page: targetPage,
                    size: PAGE_SIZE,
                    keyword: filters.keyword,
                    topic: filters.topic,
                    source: filters.source,
                    author: filters.author,
                    year: filters.year,
                    sort: filters.sort,
                });
                console.log("RESPONSE", {
                    total: res.data.totalElements,
                    count: res.data.items.length,
                    append,
                    titles: res.data.items.map((item) => item.title),
                });
                /**
                 * Nếu đây không phải request mới nhất thì bỏ qua.
                 */
                if (requestId !== requestIdRef.current) {
                    return;
                }

                setTotalElements(res.data.totalElements);
                setHasNext(res.data.hasNext);
                setPage(res.data.page);

                if (append) {
                    setItems((prev) => [...prev, ...res.data.items]);
                } else {
                    setItems(res.data.items);
                }

                setError(null);
            } catch {
                if (requestId === requestIdRef.current) {
                    setError("Cannot load bookmarks. Please try again.");
                }
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsLoadingMore(false);
                    setIsRefreshing(false);
                }
            }
        },
        [filters],
    );

    /**
     * Initial load + reload khi filter/sort thay đổi.
     *
     * setTimeout giúp tránh ESLint react-hooks/set-state-in-effect
     * vì loadPage có setState ở đầu function.
     */
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadPage(0, false);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [loadPage]);

    /**
     * Load metadata một lần.
     */
    useEffect(() => {
        let cancelled = false;

        async function loadMetadata() {
            const [statsResult, filterOptionsResult] = await Promise.allSettled([
                bookmarkApi.getStats(),
                bookmarkApi.getFilterOptions(),
            ]);

            if (cancelled) {
                return;
            }

            if (statsResult.status === "fulfilled") {
                setStats(statsResult.value.data);
            }

            if (filterOptionsResult.status === "fulfilled") {
                setFilterOptions(filterOptionsResult.value.data);
            }
        }

        void loadMetadata();

        return () => {
            cancelled = true;
        };
    }, []);

    const loadMore = useCallback(() => {
        if (!hasNext || isLoadingMore || isRefreshing) {
            return;
        }

        void loadPage(page + 1, true);
    }, [hasNext, isLoadingMore, isRefreshing, page, loadPage]);

    function updateFilter<K extends keyof BookmarkFilters>(
        key: K,
        value: BookmarkFilters[K],
    ) {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function resetFilters() {
        setFilters(DEFAULT_FILTERS);
    }

    async function deleteBookmark(bookmarkId: string) {
        const previousItems = items;
        const previousTotalElements = totalElements;

        setItems((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
        setTotalElements((prev) => Math.max(0, prev - 1));

        try {
            await bookmarkApi.deleteById(bookmarkId);
        } catch {
            setItems(previousItems);
            setTotalElements(previousTotalElements);
            await loadPage(0, false);
        }
    }

    async function updateNote(bookmarkId: string, note: string | null) {
        const previousItems = items;

        setItems((prev) =>
            prev.map((bookmark) =>
                bookmark.id === bookmarkId ? { ...bookmark, note } : bookmark,
            ),
        );

        try {
            await bookmarkApi.updateNote(bookmarkId, {
                note: note ?? "",
            });
        } catch {
            setItems(previousItems);
            await loadPage(0, false);
        }
    }

    const reload = useCallback(() => {
        void loadPage(0, false);
    }, [loadPage]);

    return {
        items,
        totalElements,
        hasNext,
        isLoadingMore,
        isRefreshing,
        error,
        filters,
        stats,
        filterOptions,
        updateFilter,
        resetFilters,
        loadMore,
        deleteBookmark,
        updateNote,
        reload,
    };
}