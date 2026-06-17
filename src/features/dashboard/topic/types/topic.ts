export type TopicData = {
    name: string;
    topicId: string;
    works: number;
    citations: number;
    score: number;
    change: number;
    state: string;
    isFollowed: boolean;
}

export type TopicApiResponse = {
    status: number;
    message: string;
    data: {
        topics: TopicData[];
    };
};

export type TopicApiRequestBody = {
    startDate: string;
    endDate: string;
    fieldId: string;
    formula: string;
};

export type TopicAnalystApiRequestBody = {
    startDate: string;
    endDate: string;
    fieldId: string | number;
}