import type { TopicHeatmapData } from "@/features/dashboard/topic/types/heatmap.ts";

const METRIC_LABELS = {
    velocity:      "Velocity",
    accelerate:    "Acceleration",
    citationDecay: "Citation Decay",
    institution:   "Institution Diversity",
    newComerAuthor:"Newcomer Ratio",
} as const;

type MetricKey = keyof typeof METRIC_LABELS;

export type NivoHeatmapRow = {
    id: string;
    data: { x: string; y: number }[];
};

// "2026-05-04" → "04/05"
function formatEndDate(dateStr: string): string {
    const [, month, day] = dateStr.split("-");
    return `${day}/${month}`;
}

export function transformToNivoHeatmap(
    heatmapData: TopicHeatmapData,
    topicName: string
): NivoHeatmapRow[] {
    const topic = heatmapData.topics.find((t) => t.name === topicName);
    if (!topic) return [];

    return (Object.keys(METRIC_LABELS) as MetricKey[]).map((metric) => ({
        id: METRIC_LABELS[metric],
        data: topic.weeks.map((week) => ({
            x: formatEndDate(week.endDate),
            y: week[metric],
        })),
    }));
}