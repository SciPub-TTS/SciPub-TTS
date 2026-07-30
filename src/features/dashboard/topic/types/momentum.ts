export type MomentumPoint = {
    name: string;
    average: number;
};

export type Momentum = {
    name: string;
    history: MomentumPoint[];
};

export type TopicMomentumApiResponse = {
    status: number;
    message: string;
    data: {
        topicGrowthMetrics: Momentum[];
    };
};