export type Momentum = {
    name: string;
    currentAverage: number;
    pastAverage: number;
    growthPercentage: number;
};

export type TopicMomentumApiResponse = {
    status: number;
    message: string;
    data: {
        topicGrowthMetrics: Momentum[];
    };
};