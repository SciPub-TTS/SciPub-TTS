export type KeywordTrendPoint = {
    year: number;
    count: number;
};

export type KeywordTrend = {
    keyword: string;
    color: string;
    yearly: KeywordTrendPoint[];
};