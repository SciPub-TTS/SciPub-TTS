export type KeywordMetric = {
    keyword: string;

    // Growth
    pgr: number;
    cagr: number;

    // Volume
    recentPapers: number;
    pastPapers: number;

    // Share
    publicationShare: number;

    // Final score
    hotScore: number;

    // Trend
    yearly: {
        year: number;
        count: number;
        fieldCount?: number;
    }[];
};

export type KeywordMetricUI = KeywordMetric & {
    color: string;
};