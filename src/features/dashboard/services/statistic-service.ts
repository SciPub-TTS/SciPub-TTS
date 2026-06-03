import type {MetricResponse} from "@/features/dashboard/types/metric.ts";
import type {PublicationTrend} from "@/features/dashboard/types/publication.ts";

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

export const MOCK_PUBLICATION_TRENDING: PublicationTrend[] = [
    {
        year: "2005",
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: "2006",
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: "2007",
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: "2008",
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: "2009",
        publications: Math.floor(Math.random() * 5000 + 1000)
    },
    {
        year: "2010",
        publications: Math.floor(Math.random() * 7000 + 2000)
    },
    {
        year: "2011",
        publications: Math.floor(Math.random() * 7000 + 3000)
    },
    {
        year: "2012",
        publications: Math.floor(Math.random() * 8000 + 4000)
    },
    {
        year: "2013",
        publications: Math.floor(Math.random() * 9000 + 5000)
    },
    {
        year: "2014",
        publications: Math.floor(Math.random() * 10000 + 6000)
    },
    {
        year: "2015",
        publications: Math.floor(Math.random() * 11000 + 7000)
    },
    {
        year: "2016",
        publications: Math.floor(Math.random() * 12000 + 8000)
    },
    {
        year: "2017",
        publications: Math.floor(Math.random() * 13000 + 9000)
    },
    {
        year: "2018",
        publications: Math.floor(Math.random() * 14000 + 10000)
    },
    {
        year: "2019",
        publications: Math.floor(Math.random() * 15000 + 11000)
    },
    {
        year: "2020",
        publications: Math.floor(Math.random() * 16000 + 12000)
    },
    {
        year: "2021",
        publications: Math.floor(Math.random() * 17000 + 13000)
    },
    {
        year: "2022",
        publications: Math.floor(Math.random() * 18000 + 14000)
    },
    {
        year: "2023",
        publications: Math.floor(Math.random() * 19000 + 15000)
    },
    {
        year: "2024",
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

export const statisticService = {

    getMetricList: async(period?: string):Promise<MetricResponse[]> => {
        if(USE_MOCK) {
            return MOCK_METRICS_RESPONSE;
        }

        if(!period) return [];

        const endpoint = new URL(`${apiBaseUrl}/api/metrics`);
        const startOfDay = new Date(period);
        startOfDay.setHours(0, 0, 0, 0);
        endpoint.searchParams.append("period", startOfDay.toISOString());

        return await requestData<MetricResponse[]>(endpoint.toString());
    },

    getPublicationTrend: async(yearFrom?: number, yearTo?: number):Promise<PublicationTrend[]> => {
        if(USE_MOCK) {
            return MOCK_PUBLICATION_TRENDING;
        }

        if(!yearFrom || !yearTo) {
            return [];
        }

        const endpoint = new URL(`${apiBaseUrl}/api/publication-trends`);
        endpoint.searchParams.append("yearFrom", String(yearFrom));
        endpoint.searchParams.append("yearTo", String(yearTo));

        return await requestData<PublicationTrend[]>(endpoint.toString());
    }
}