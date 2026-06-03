import {topicMetrics} from "@/features/dashboard/constants/topic-data.ts";
import {averageMetrics, metricKeys} from "@/features/dashboard/hooks/averageMetrics.ts";

export const buildRadarData = (topicName: string) => {
    const topic = topicMetrics.find(t => t.topic === topicName);

    if (!topic) return [];

    return metricKeys.map(metric => ({
        metric,
        topicValue: topic[metric],
        averageValue: Number(
            averageMetrics[metric].toFixed(1)
        ),
    }));
};