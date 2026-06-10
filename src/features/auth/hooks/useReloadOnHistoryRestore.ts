import { useEffect } from "react";

export function useReloadOnHistoryRestore() {
    useEffect(() => {
        function handlePageShow(event: PageTransitionEvent) {
            const navigationEntry = performance
                .getEntriesByType("navigation")
                .find(
                    (entry): entry is PerformanceNavigationTiming =>
                        entry instanceof PerformanceNavigationTiming,
                );

            if (event.persisted || navigationEntry?.type === "back_forward") {
                window.location.reload();
            }
        }

        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);
}
