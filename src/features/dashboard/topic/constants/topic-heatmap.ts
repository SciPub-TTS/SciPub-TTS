import { topicMetrics } from "@/features/dashboard/topic/constants/topic-data.ts";

const metricMap = [
    "velocity",
    "accelerate",
    "citationDecay",
    "institution",
    "newComerAuthor",
] as const;

const years = ["2021", "2022", "2023", "2024", "2025", "2026"];

const metricLabelMap: Record<typeof metricMap[number], string> = {
    velocity: "Velocity",
    accelerate: "Acceleration",
    citationDecay: "Citation Decay",
    institution: "Institution Diversity",
    newComerAuthor: "Newcomer Ratio",
};

export const topicHeatmaps = Object.fromEntries(
    topicMetrics.map((topic) => [
        topic.name,
        metricMap.map((metric) => {
            const finalValue = topic[metric];

            return {
                id: metricLabelMap[metric],
                data: years.map((year, index) => {
                    const ratio = 0.55 + index * 0.09;

                    return {
                        x: year,
                        y: Math.round(finalValue * ratio),
                    };
                }),
            };
        }),
    ])
);