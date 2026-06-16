import { topicMetrics } from "@/features/dashboard/topic/constants/topic-data.ts";
import type { TopicHeatmapData } from "@/features/dashboard/topic/types/heatmap.ts";

const metricMap = [
    "velocity",
    "accelerate",
    "citationDecay",
    "institution",
    "newComerAuthor",
] as const;

function generateMockWeeks(endDateStr: string, baseValues: Record<typeof metricMap[number], number>) {
    return Array.from({ length: 5 }, (_, i) => {
        const end = new Date(endDateStr);
        end.setDate(end.getDate() - (4 - i) * 7);

        const start = new Date(end);
        start.setFullYear(start.getFullYear() - 5);

        const ratio = 0.55 + i * 0.09;

        return {
            startDate: start.toISOString().slice(0, 10),
            endDate:   end.toISOString().slice(0, 10),
            velocity:      Math.round(baseValues.velocity      * ratio * 100) / 100,
            accelerate:    Math.round(baseValues.accelerate    * ratio * 100) / 100,
            citationDecay: Math.round(baseValues.citationDecay * ratio * 100) / 100,
            newComerAuthor:Math.round(baseValues.newComerAuthor* ratio * 100) / 100,
            institution:   Math.round(baseValues.institution   * ratio * 100) / 100,
        };
    });
}

export function buildMockHeatmapData(endDate: string): TopicHeatmapData {
    return {
        topics: topicMetrics.map((topic, index) => ({
            topicId: `https://openalex.org/T${10000 + index}`,
            name: topic.name,
            weeks: generateMockWeeks(endDate, {
                velocity:       topic.velocity,
                accelerate:     topic.accelerate,
                citationDecay:  topic.citationDecay,
                institution:    topic.institution,
                newComerAuthor: topic.newComerAuthor,
            }),
        })),
    };
}