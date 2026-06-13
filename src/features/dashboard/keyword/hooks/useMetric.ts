import {useEffect, useState} from "react";
import {keywordService} from "@/features/dashboard/keyword/services/keyword-service.ts";
import type {KeywordMetricUI} from "@/features/dashboard/keyword/types/metric.ts";
import {
    KEYWORD_COLORS
} from "@/features/dashboard/keyword/constants/metric-data.ts";

export const useGeneralsMetric = () => {
    const [loading, setLoading] = useState(false);
    const [metricList, setMetricList] = useState<KeywordMetricUI[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetricList = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await keywordService.getMetricList();

                const mergedMetrics = data.map((item, index) => ({
                    ...item,
                    color:
                        KEYWORD_COLORS[index % KEYWORD_COLORS.length],
                }));

                setMetricList(mergedMetrics);

            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load metrics"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMetricList();
    }, []);

    return { loading, metricList, error };
};