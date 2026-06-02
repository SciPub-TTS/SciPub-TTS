import type {MetricResponse} from "@/features/dashboard/types/metric.ts";

const USE_MOCK = true;

export const MOCK_METRICS_RESPONSE: MetricResponse[] = [
    {
        title: "TOTAL PAPERS",
        value: `${Math.floor(Math.random() * 900000 + 100000)}`,
        changes: `+${(Math.random() * 30).toFixed(1)}% YoY`
    },
    {
        title: "ACTIVE TRENDING TOPICS",
        value: `${Math.floor(Math.random() * 80 + 20)}`,
        changes: `+${Math.floor(Math.random() * 10 + 1)} this week`
    },
    {
        title: "RISING KEYWORDS",
        value: `${Math.floor(Math.random() * 300 + 50)}`,
        changes: `+${Math.floor(Math.random() * 25 + 5)} this week`
    },
    {
        title: "AVERAGE GROWTH RATE",
        value: `+${(Math.random() * 40).toFixed(1)}%`,
        changes: "vs last quarter"
    },
    {
        title: "CITATION IMPACT",
        value: (Math.random() * 10).toFixed(2),
        changes: `${(Math.random() * 3 + 1).toFixed(1)}-yr mean citedness`
    },
    {
        title: "TOP FIELD",
        value: [
            "Computer Science",
            "Artificial Intelligence",
            "Data Science",
            "Medicine",
            "Physics"
        ][Math.floor(Math.random() * 5)],
        changes: `${Math.floor(Math.random() * 50000 + 10000).toLocaleString()} papers`
    },
    {
        title: "NEW PAPERS THIS WEEK",
        value: `${Math.floor(Math.random() * 5000 + 500)}`,
        changes: `+${Math.floor(Math.random() * 15 + 1)}% vs last week`
    },
    {
        title: "LAST SYNC",
        value: new Date().toLocaleString(),
        changes: "OpenAlex Active"
    }
];

export const statisticService = {
    getMetricList: async():Promise<MetricResponse[]> => {
        if(USE_MOCK) {
            return MOCK_METRICS_RESPONSE;
        }

        // TODO: Replace with API call
        return [];
    },
}