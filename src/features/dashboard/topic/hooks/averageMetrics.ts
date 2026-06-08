import {topicMetrics} from "@/features/dashboard/topic/constants/topic-data.ts";

export const metricKeys = [
    "Velocity",
    "Acceleration",
    "Citation",
    "InstitutionDivers",
    "AuthorNewcomerRatio",
] as const;

export const averageMetrics = metricKeys.reduce((acc, key) => {
    acc[key] =
        topicMetrics.reduce((sum, topic) => sum + topic[key], 0) /
        topicMetrics.length;

    return acc;
}, {} as Record<(typeof metricKeys)[number], number>);