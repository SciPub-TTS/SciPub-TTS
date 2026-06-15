import { useEffect, useRef } from "react";

/**
 * Gắn IntersectionObserver vào sentinel element.
 * Khi sentinel vào viewport → gọi onLoadMore.
 */
export function useInfiniteScroll(
    onLoadMore: () => void,
    enabled: boolean,
) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onLoadMore();
                }
            },
            { rootMargin: "200px" }, // Trigger sớm 200px trước khi đến cuối
        );

        const el = sentinelRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [onLoadMore, enabled]);

    return sentinelRef;
}
