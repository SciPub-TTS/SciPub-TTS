export type TopicRadarMetrics = {
    name: string;
    velocity: number;
    accelerate: number;
    citationDecay: number;
    newComerAuthor: number;
    institution: number;
};

export type TopicRadarApiResponse = {
    status: number;
    message: string;
    data: {
        average: TopicRadarMetrics;
        topics: TopicRadarMetrics[];
    };
};

export type TopicRadarData = {
    average: TopicRadarMetrics;
    topics: TopicRadarMetrics[];
};