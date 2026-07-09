export type Keyword = {
    name: string;
    id: string;
    score: number;
    worksCount: number;
}

export type KeywordsMetric = {
    id: number;
    keywordId: string;
    name: string;
    fieldId: string;
    score: number;
    cagr: number;
    ps: number;
    worksCount: number;
    citedByCount: number;
};

export type KeywordApiResponse = {
    status: number;
    message: string;
    data: {
        keywordList: KeywordsMetric[];
    };
};

export type KeywordFormulaType =
    | "balanced"
    | "trending"
    | "emerging"
    | "dominant";

export type KeywordApiRequest = {
    recentStart: string;
    recentEnd: string;

    fieldId: string;

    formula: KeywordFormulaType;
};