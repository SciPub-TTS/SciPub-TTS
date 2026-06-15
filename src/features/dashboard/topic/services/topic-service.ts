import type {MetricApiResponse, MetricItem} from "@/features/dashboard/topic/types/metric.ts";
import type {PublicationTrend, PublicationTrendApiResponse} from "@/features/dashboard/topic/types/publication.ts";
import type {
    TopicAnalystApiRequestBody,
    TopicApiRequestBody,
    TopicApiResponse,
    TopicData
} from "@/features/dashboard/topic/types/topic.ts";
import {LIST_TOPICS, topicGrowthMetrics, topicMetrics} from "@/features/dashboard/topic/constants/topic-data.ts";
import type {Momentum, TopicMomentumApiResponse} from "@/features/dashboard/topic/types/momentum.ts";
import type {TopicRadarApiResponse, TopicRadarData, TopicRadarMetrics} from "@/features/dashboard/topic/types/radar.ts";

const USE_MOCK = true;

export const MOCK_METRICS_RESPONSE: MetricItem[] = [
    {
        title: "TOTAL PAPERS",
        value: Math.floor(Math.random() * 900000 + 100000),
        change: Number((Math.random() * 30 - 10).toFixed(2))
    },
    {
        title: "ACTIVE TRENDING TOPICS",
        value: Math.floor(Math.random() * 80 + 20),
        change: Number((Math.random() * 20 - 5).toFixed(2))
    },
    {
        title: "RISING KEYWORDS",
        value: Math.floor(Math.random() * 300 + 50),
        change: Number((Math.random() * 25 - 5).toFixed(2))
    },
    {
        title: "AVERAGE GROWTH RATE",
        value: Number((Math.random() * 40).toFixed(2)),
        change: Number((Math.random() * 15 - 5).toFixed(2))
    },
    {
        title: "CITATION IMPACT",
        value: Number((Math.random() * 10).toFixed(2)),
        change: Number((Math.random() * 10 - 3).toFixed(2))
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
        change: Number((Math.random() * 1000000).toFixed(0))
    },
    {
        title: "NEW PAPERS THIS WEEK",
        value: Math.floor(Math.random() * 5000 + 500),
        change: Number((Math.random() * 30 - 5).toFixed(2))
    },
    {
        title: "LAST SYNC",
        value: new Date().toLocaleString(),
        change: 0
    }
];

export const MOCK_PUBLICATION_TRENDING: PublicationTrend[] = [
    {
        year: 2005,
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: 2006,
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: 2007,
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: 2008,
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: 2009,
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: 2010,
        publications: Math.floor(Math.random() * 7000 + 2000)
    },
    {
        year: 2011,
        publications: Math.floor(Math.random() * 7000 + 3000)
    },
    {
        year: 2012,
        publications: Math.floor(Math.random() * 8000 + 4000)
    },
    {
        year: 2013,
        publications: Math.floor(Math.random() * 9000 + 5000)
    },
    {
        year: 2014,
        publications: Math.floor(Math.random() * 10000 + 6000)
    },
    {
        year: 2015,
        publications: Math.floor(Math.random() * 11000 + 7000)
    },
    {
        year: 2016,
        publications: Math.floor(Math.random() * 12000 + 8000)
    },
    {
        year: 2017,
        publications: Math.floor(Math.random() * 13000 + 9000)
    },
    {
        year: 2018,
        publications: Math.floor(Math.random() * 14000 + 10000)
    },
    {
        year: 2019,
        publications: Math.floor(Math.random() * 15000 + 11000)
    },
    {
        year: 2020,
        publications: Math.floor(Math.random() * 16000 + 12000)
    },
    {
        year: 2021,
        publications: Math.floor(Math.random() * 17000 + 13000)
    },
    {
        year: 2022,
        publications: Math.floor(Math.random() * 18000 + 14000)
    },
    {
        year: 2023,
        publications: Math.floor(Math.random() * 19000 + 15000)
    },
    {
        year: 2024,
        publications: Math.floor(Math.random() * 20000 + 16000)
    }
];

const apiBaseUrl = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");

async function requestData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json() as Promise<T>;
}

export const topicService = {

    getMetricList: async(startDate?: string, endDate?: string):Promise<MetricItem[]> => {
        if(!USE_MOCK) {
            return MOCK_METRICS_RESPONSE;
        }

        if (!startDate || !endDate) {
            return MOCK_METRICS_RESPONSE;
        }

        const endpoint = new URL(`${apiBaseUrl}/api/data/metrics`);
        endpoint.searchParams.append("startTime", startDate);
        endpoint.searchParams.append("endTime", endDate);

        const response = await requestData<MetricApiResponse>(
            endpoint.toString()
        );

        return response.data.metricList;
    },

    getPublicationTrend: async(startYear?: number, endYear?: number):Promise<PublicationTrend[]> => {
        if(!USE_MOCK) {
            return MOCK_PUBLICATION_TRENDING;
        }

        if(!startYear || !endYear) {
            return [];
        }

        const endpoint = new URL(`${apiBaseUrl}/api/data/publication-trends/filter`);
        endpoint.searchParams.append("startYear", String(startYear));
        endpoint.searchParams.append("endYear", String(endYear));

        const response = await requestData<PublicationTrendApiResponse>(
            endpoint.toString()
        );

        return response.data.publicationTrends;
    },

    getRankedTopics: async({startDate, endDate, formula, fieldId}:TopicApiRequestBody):Promise<TopicData[]> => {
        if (!USE_MOCK) {
            return LIST_TOPICS;
        }

        const endpoint = new URL(
            `${apiBaseUrl}/api/data/topicScore-all`
        );

        endpoint.searchParams.append("startTime", startDate);
        endpoint.searchParams.append("endTime", endDate);
        endpoint.searchParams.append("fieldId", fieldId);
        endpoint.searchParams.append("formula", formula);

        const response = await requestData<TopicApiResponse>(
            endpoint.toString()
        );

        return response.data.topics;
    },

    getTopicsMomentum: async ({ startDate, endDate, formula, fieldId }: TopicApiRequestBody): Promise<Momentum[]> => {
        if (!USE_MOCK) {
            return topicGrowthMetrics;
        }

        const endpoint = new URL(`${apiBaseUrl}/api/data/topic-momentum`);
        endpoint.searchParams.append("startTime", startDate);
        endpoint.searchParams.append("endTime", endDate);
        endpoint.searchParams.append("fieldId", fieldId);
        endpoint.searchParams.append("formula", formula);

        const response = await requestData<TopicMomentumApiResponse>(endpoint.toString());
        return response.data.topicGrowthMetrics;
    },

    getTopicRadar: async ({ startDate, endDate, fieldId }: TopicAnalystApiRequestBody): Promise<TopicRadarData> => {
        if (!USE_MOCK) {
            return {
                average: {} as TopicRadarMetrics,
                topics: topicMetrics
            };
        }

        const endpoint = new URL(`${apiBaseUrl}/api/data/topic-radar`);

        endpoint.searchParams.append("startTime", startDate);
        endpoint.searchParams.append("endTime", endDate);
        endpoint.searchParams.append("fieldId", String(fieldId));

        const response = await requestData<TopicRadarApiResponse>(endpoint.toString());

        return response.data;
    },
}