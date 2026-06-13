import {useEffect, useState} from "react";
import type {MetricData, MetricResponse} from "@/features/dashboard/topic/types/metric.ts";
import {topicService} from "@/features/dashboard/topic/services/topic-service.ts";
import {MENU_METRICS} from "@/features/dashboard/topic/constants/metric-data.ts";

export function useGeneralMetrics(){
    const [loading, setLoading] = useState<boolean>(false);
    const [metricList, setMetricList] = useState<MetricData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetricList = async () => {
            setLoading(true);
            setError(null);

            try {
                const data: MetricResponse[] =
                    await topicService.getMetricList();

                const mergedMetrics: MetricData[] = MENU_METRICS.map(
                    (metric) => {
                        const responseMetric = data.find(
                            (item) => item.title === metric.title
                        );

                        return {
                            ...metric,
                            value: responseMetric?.value ?? "-",
                            changes: responseMetric?.changes ?? "",
                        };
                    }
                );

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
    },[])

    return { loading, metricList, error };
}