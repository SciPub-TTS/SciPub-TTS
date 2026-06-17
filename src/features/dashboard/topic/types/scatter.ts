import type {TopicData} from "@/features/dashboard/topic/types/topic.ts";

export type TopicBubble = TopicData & {
    color: string;
}

export type UseTopicsMetricReturn = {
    topicList: TopicBubble[];
    isLoading: boolean;
    error: string | null;
}