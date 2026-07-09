import type {KeywordMetric} from "@/features/dashboard/keyword/types/metric.ts";
import type {
    KeywordApiRequest,
    KeywordApiResponse,
    KeywordsMetric
} from "@/features/dashboard/keyword/types/keyword.ts";
import {KEYWORD_COLORS} from "@/features/dashboard/keyword/constants/metric-data.ts";

const USE_MOCK = true;

export const MOCK_KEYWORDS: KeywordMetric[] = [
    {
        keyword: "LLM",
        cagr: 54,
        recentPapers: 9600,
        publicationShare: 12.8,
        hotScore: 91,
        color: KEYWORD_COLORS[0],
    },
    {
        keyword: "RAG",
        cagr: 72,
        recentPapers: 4400,
        publicationShare: 6.2,
        hotScore: 95,
        color: KEYWORD_COLORS[1],
    },
    {
        keyword: "AI Agents",
        cagr: 48,
        recentPapers: 6200,
        publicationShare: 8.4,
        hotScore: 84,
        color: KEYWORD_COLORS[2],
    },
    {
        keyword: "GraphRAG",
        cagr: 61,
        recentPapers: 3800,
        publicationShare: 5.3,
        hotScore: 88,
        color: KEYWORD_COLORS[3],
    },
    {
        keyword: "Multimodal AI",
        cagr: 44,
        recentPapers: 8400,
        publicationShare: 11.2,
        hotScore: 86,
        color: KEYWORD_COLORS[4],
    },
    {
        keyword: "Prompt Engineering",
        cagr: 29,
        recentPapers: 5100,
        publicationShare: 7.5,
        hotScore: 72,
        color: KEYWORD_COLORS[5],
    },
    {
        keyword: "MoE",
        cagr: 67,
        recentPapers: 2700,
        publicationShare: 3.9,
        hotScore: 93,
        color: KEYWORD_COLORS[6],
    },
    {
        keyword: "AI Safety",
        cagr: 36,
        recentPapers: 7100,
        publicationShare: 9.7,
        hotScore: 80,
        color: KEYWORD_COLORS[7],
    },
    {
        keyword: "TinyML",
        cagr: 24,
        recentPapers: 3300,
        publicationShare: 4.5,
        hotScore: 66,
        color: KEYWORD_COLORS[8],
    },
    {
        keyword: "Agentic Workflow",
        cagr: 69,
        recentPapers: 2400,
        publicationShare: 2.7,
        hotScore: 90,
        color: KEYWORD_COLORS[9],
    },
];

export const MOCK_TOP_KEYWORDS = [
    {
        id: 72,
        keywordId: "https://openalex.org/keywords/enzyme",
        name: "Enzyme",
        fieldId: "22",
        score: 0.8416935457723318,
        cagr: 40,
        ps: 117.34,
        worksCount: 2741251,
        citedByCount: 73989300
    },
    {
        id: 78,
        keywordId: "https://openalex.org/keywords/in-vitro",
        name: "In vitro",
        fieldId: "22",
        score: 0.8362747008309428,
        cagr: 33.97,
        ps: 115.23,
        worksCount: 1791611,
        citedByCount: 44568555
    },
    {
        id: 77,
        keywordId: "https://openalex.org/keywords/cognitive-psychology",
        name: "Cognitive psychology",
        fieldId: "22",
        score: 0.7602265440604524,
        cagr: 36.52,
        ps: 86.09,
        worksCount: 1489915,
        citedByCount: 46767322
    },
    {
        id: 80,
        keywordId: "https://openalex.org/keywords/anesthesia",
        name: "Anesthesia",
        fieldId: "22",
        score: 0.7485229469267014,
        cagr: 40,
        ps: 94.46,
        worksCount: 2403354,
        citedByCount: 41449600
    },
    {
        id: 75,
        keywordId: "https://openalex.org/keywords/condensed-matter-physics",
        name: "Condensed matter physics",
        fieldId: "22",
        score: 0.7284538485188714,
        cagr: 10.32,
        ps: 105.8,
        worksCount: 2152348,
        citedByCount: 48005389
    },
    {
        id: 81,
        keywordId: "https://openalex.org/keywords/environmental-chemistry",
        name: "Environmental chemistry",
        fieldId: "22",
        score: 0.6996309645142886,
        cagr: 33.19,
        ps: 101.5,
        worksCount: 1678180,
        citedByCount: 41244923
    },
    {
        id: 71,
        keywordId: "https://openalex.org/keywords/philosophy",
        name: "Philosophy",
        fieldId: "22",
        score: 0.6742211867221295,
        cagr: 34.87,
        ps: 97.81,
        worksCount: 23450876,
        citedByCount: 95342061
    },
    {
        id: 84,
        keywordId: "https://openalex.org/keywords/quality",
        name: "Quality (philosophy)",
        fieldId: "22",
        score: 0.6514267682971899,
        cagr: 40,
        ps: 86.33,
        worksCount: 4070886,
        citedByCount: 19385855
    },
    {
        id: 73,
        keywordId: "https://openalex.org/keywords/chromatography",
        name: "Chromatography",
        fieldId: "22",
        score: 0.6485835026117568,
        cagr: 40,
        ps: 71.43,
        worksCount: 3446753,
        citedByCount: 72183961
    },
    {
        id: 83,
        keywordId: "https://openalex.org/keywords/order",
        name: "Order (exchange)",
        fieldId: "22",
        score: 0.6267266012290602,
        cagr: 30.87,
        ps: 65.29,
        worksCount: 5358923,
        citedByCount: 15037461
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

export const keywordService = {
    getTrendList: async (): Promise<KeywordMetric[]> => {
        if (USE_MOCK) {
            return MOCK_KEYWORDS;
        }

        return requestData<KeywordMetric[]>("/api/statistic/keyword-trends");
    },

    getKeywordTrend: async ({recentStart, recentEnd, fieldId, formula}: KeywordApiRequest): Promise<KeywordsMetric[]> => {
        if (!USE_MOCK) {
            return MOCK_TOP_KEYWORDS;
        }

        const endpoint = new URL(`${apiBaseUrl}/api/data/keywordScore-all`);
        endpoint.searchParams.append("startTime", recentStart);
        endpoint.searchParams.append("endTime", recentEnd);
        endpoint.searchParams.append("fieldId", fieldId);
        endpoint.searchParams.append("formula", formula);

        const response = await requestData<KeywordApiResponse>(endpoint.toString());
        return response.data.keywordList;
    }
}
