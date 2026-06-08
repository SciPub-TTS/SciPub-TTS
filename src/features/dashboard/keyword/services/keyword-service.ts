import type {KeywordMetric} from "@/features/dashboard/keyword/types/metric.ts";

const USE_MOCK = true;


const MOCK_KEYWORDS: KeywordMetric[] = [
    {
        keyword: "LLM",
        pgr: 180,
        cagr: 54,
        recentPapers: 9600,
        pastPapers: 3400,
        publicationShare: 12.8,
        hotScore: 91,
        yearly: [],
    },
    {
        keyword: "RAG",
        pgr: 220,
        cagr: 72,
        recentPapers: 4400,
        pastPapers: 1300,
        publicationShare: 6.2,
        hotScore: 95,
        yearly: [],
    },
    {
        keyword: "AI Agents",
        pgr: 145,
        cagr: 48,
        recentPapers: 6200,
        pastPapers: 2600,
        publicationShare: 8.4,
        hotScore: 84,
        yearly: [],
    },
    {
        keyword: "GraphRAG",
        pgr: 165,
        cagr: 61,
        recentPapers: 3800,
        pastPapers: 1400,
        publicationShare: 5.3,
        hotScore: 88,
        yearly: [],
    },
    {
        keyword: "Multimodal AI",
        pgr: 135,
        cagr: 44,
        recentPapers: 8400,
        pastPapers: 3900,
        publicationShare: 11.2,
        hotScore: 86,
        yearly: [],
    },
    {
        keyword: "Prompt Engineering",
        pgr: 90,
        cagr: 29,
        recentPapers: 5100,
        pastPapers: 2700,
        publicationShare: 7.5,
        hotScore: 72,
        yearly: [],
    },
    {
        keyword: "MoE",
        pgr: 210,
        cagr: 67,
        recentPapers: 2700,
        pastPapers: 700,
        publicationShare: 3.9,
        hotScore: 93,
        yearly: [],
    },
    {
        keyword: "AI Safety",
        pgr: 125,
        cagr: 36,
        recentPapers: 7100,
        pastPapers: 3400,
        publicationShare: 9.7,
        hotScore: 80,
        yearly: [],
    },
    {
        keyword: "TinyML",
        pgr: 82,
        cagr: 24,
        recentPapers: 3300,
        pastPapers: 2200,
        publicationShare: 4.5,
        hotScore: 66,
        yearly: [],
    },
    {
        keyword: "Agentic Workflow",
        pgr: 195,
        cagr: 69,
        recentPapers: 2400,
        pastPapers: 650,
        publicationShare: 2.7,
        hotScore: 90,
        yearly: [],
    },
];

const apiBaseUrl = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");

async function requestData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json() as Promise<T>;
}

export const keywordService = {
    getMetricList: async():Promise<KeywordMetric[]> => {
        if(USE_MOCK) {
            return MOCK_KEYWORDS;
        }
        return await requestData<KeywordMetric[]>(`${apiBaseUrl}/api/statistic/keywords`);
    }
}