import {topicMetrics} from "@/features/dashboard/constants/topic-data.ts";

const metricMap = [
    "Velocity",
    "Acceleration",
    "Citation",
    "InstitutionDivers",
    "AuthorNewcomerRatio",
] as const;

const years = ["2021", "2022", "2023", "2024", "2025", "2026"];

export const topicHeatmaps = Object.fromEntries(
    topicMetrics.map((topic) => [
        topic.topic,
        metricMap.map((metric) => {
            const finalValue = topic[metric];

            return {
                id:
                    metric === "InstitutionDivers"
                        ? "Institution Diversity"
                        : metric === "AuthorNewcomerRatio"
                            ? "Newcomer Ratio"
                            : metric,
                data: years.map((year, index) => {
                    // Tăng dần tới giá trị hiện tại
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