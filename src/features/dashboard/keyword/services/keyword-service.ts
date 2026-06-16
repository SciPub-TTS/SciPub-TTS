import type {KeywordMetric} from "@/features/dashboard/keyword/types/metric.ts";
import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

const USE_MOCK = import.meta.env.VITE_ENABLE_DASHBOARD_MOCKS === "true";

const generateYearly = (recentPapers: number) => [
    {
        year: 2021,
        count: Math.floor(recentPapers * 0.08),
    },
    {
        year: 2022,
        count: Math.floor(recentPapers * 0.18),
    },
    {
        year: 2023,
        count: Math.floor(recentPapers * 0.35),
    },
    {
        year: 2024,
        count: Math.floor(recentPapers * 0.62),
    },
    {
        year: 2025,
        count: recentPapers,
    },
];

export const MOCK_KEYWORDS: KeywordMetric[] = [
    {
        keyword: "LLM",
        pgr: 180,
        cagr: 54,
        recentPapers: 9600,
        pastPapers: 3400,
        publicationShare: 12.8,
        hotScore: 91,
        yearly: generateYearly(9600),
    },

    {
        keyword: "RAG",
        pgr: 220,
        cagr: 72,
        recentPapers: 4400,
        pastPapers: 1300,
        publicationShare: 6.2,
        hotScore: 95,
        yearly: generateYearly(4400),
    },

    {
        keyword: "AI Agents",
        pgr: 145,
        cagr: 48,
        recentPapers: 6200,
        pastPapers: 2600,
        publicationShare: 8.4,
        hotScore: 84,
        yearly: generateYearly(6200),
    },

    {
        keyword: "GraphRAG",
        pgr: 165,
        cagr: 61,
        recentPapers: 3800,
        pastPapers: 1400,
        publicationShare: 5.3,
        hotScore: 88,
        yearly: generateYearly(3800),
    },

    {
        keyword: "Multimodal AI",
        pgr: 135,
        cagr: 44,
        recentPapers: 8400,
        pastPapers: 3900,
        publicationShare: 11.2,
        hotScore: 86,
        yearly: generateYearly(8400),
    },

    {
        keyword: "Prompt Engineering",
        pgr: 90,
        cagr: 29,
        recentPapers: 5100,
        pastPapers: 2700,
        publicationShare: 7.5,
        hotScore: 72,
        yearly: generateYearly(5100),
    },

    {
        keyword: "MoE",
        pgr: 210,
        cagr: 67,
        recentPapers: 2700,
        pastPapers: 700,
        publicationShare: 3.9,
        hotScore: 93,
        yearly: generateYearly(2700),
    },

    {
        keyword: "AI Safety",
        pgr: 125,
        cagr: 36,
        recentPapers: 7100,
        pastPapers: 3400,
        publicationShare: 9.7,
        hotScore: 80,
        yearly: generateYearly(7100),
    },

    {
        keyword: "TinyML",
        pgr: 82,
        cagr: 24,
        recentPapers: 3300,
        pastPapers: 2200,
        publicationShare: 4.5,
        hotScore: 66,
        yearly: generateYearly(3300),
    },

    {
        keyword: "Agentic Workflow",
        pgr: 195,
        cagr: 69,
        recentPapers: 2400,
        pastPapers: 650,
        publicationShare: 2.7,
        hotScore: 90,
        yearly: generateYearly(2400),
    },
];

async function requestData<T>(path: string): Promise<T> {
    const response = await publicHttp.get<ApiResponse<T>>(path);
    return response.data.data;
}

export const keywordService = {
    getMetricList: async():Promise<KeywordMetric[]> => {
        if(USE_MOCK) {
            return MOCK_KEYWORDS;
        }
        return await requestData<KeywordMetric[]>("/api/statistic/keywords");
    },

    getTrendList: async (): Promise<KeywordMetric[]> => {
        if (USE_MOCK) {
            return MOCK_KEYWORDS;
        }

        return requestData<KeywordMetric[]>("/api/statistic/keyword-trends");
    },
}
