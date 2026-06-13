import { useEffect, useState } from "react";

import { keywordService } from "@/features/dashboard/keyword/services/keyword-service.ts";
import { KEYWORD_TREND_COLORS } from "@/features/dashboard/keyword/constants/trend-data.ts";

import type { KeywordTrend } from "@/features/dashboard/keyword/types/trend.ts";
import type { KeywordMetric } from "@/features/dashboard/keyword/types/metric.ts";

export function useTrend() {
    const [loading, setLoading] = useState(false);
    const [trendList, setTrendList] = useState<KeywordTrend[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrend = async () => {
            setLoading(true);
            setError(null);

            try {
                const data: KeywordMetric[] =
                    await keywordService.getTrendList();

                const merged: KeywordTrend[] = data.map((item, index) => ({
                    keyword: item.keyword,
                    yearly: item.yearly,
                    color: KEYWORD_TREND_COLORS[index],
                }));

                setTrendList(merged);

            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load trend"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchTrend();

    }, []);

    return {
        loading,
        trendList,
        error,
    };
}