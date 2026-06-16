export type TopicTimelineMetrics = {
    startDate: string;
    endDate: string;
    velocity: number;
    accelerate: number;
    citationDecay: number;
    newComerAuthor: number;
    institution: number;
};

export type TopicHeatmapItem = {
    topicId: string;
    name: string;
    weeks: TopicTimelineMetrics[];
};

export type TopicHeatmapData = {
    topics: TopicHeatmapItem[];
};

export type TopicHeatmapApiResponse = {
    status: number;
    message: string;
    data: TopicHeatmapData;
};