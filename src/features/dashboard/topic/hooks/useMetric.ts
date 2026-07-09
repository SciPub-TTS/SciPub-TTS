import {useEffect, useState} from "react";
import type {MetricData, MetricItem} from "@/features/dashboard/topic/types/metric.ts";
import {topicService} from "@/features/dashboard/topic/services/topic-service.ts";
import {MENU_METRICS} from "@/features/dashboard/topic/constants/metric-data.ts";

export function useGeneralMetrics(startDate?: string, endDate?: string){
    const [loading, setLoading] = useState<boolean>(false);
    const [metricList, setMetricList] = useState<MetricData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetricList = async () => {
            setLoading(true);
            setError(null);

            try {
                const data: MetricItem[] =
                    await topicService.getMetricList(startDate, endDate);

                const mergedMetrics: MetricData[] = MENU_METRICS.map(
                    (metric) => {
                        const responseMetric = data.find(
                            (item) => item.title === metric.title
                        );

                        const formattedChange =
                            responseMetric?.change != null
                                ? `${metric.title !== "TOP FIELD" && Number(responseMetric.change) >= 0 ? "+" : ""}${Number(responseMetric.change).toFixed(2)} ${metric.changeSuffix}`
                                : "";

                        return {
                            ...metric,
                            value: responseMetric?.value ?? "-",
                            change: formattedChange,
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
    },[startDate, endDate])

    return { loading, metricList, error };
}