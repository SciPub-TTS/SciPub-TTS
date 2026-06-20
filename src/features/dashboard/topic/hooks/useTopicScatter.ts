import { useEffect, useState } from "react";
import type {TopicBubble, UseTopicsMetricReturn} from "@/features/dashboard/topic/types/scatter.ts";
import {topicService} from "@/features/dashboard/topic/services/topic-service.ts";
import type {TopicApiRequestBody} from "@/features/dashboard/topic/types/topic.ts";

const BUBBLE_COLORS = [
    "#6366f1", "#0ea5e9", "#10b981", "#f59e0b",
    "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
    "#f97316", "#84cc16",
];

export function useTopicScatter({ startDate, endDate, fieldId, formula }: TopicApiRequestBody): UseTopicsMetricReturn {
    const [topicList, setTopicList] = useState<TopicBubble[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const raw = await topicService.getRankedTopics({
                    startDate,
                    endDate,
                    fieldId,
                    formula
                });

                if (!cancelled) {
                    const enriched: TopicBubble[] = raw.map((item, index) => ({
                        ...item,
                        color: BUBBLE_COLORS[index % BUBBLE_COLORS.length],
                    }));
                    setTopicList(enriched);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unknown error");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [startDate, endDate, fieldId, formula]);

    return { topicList, isLoading, error };
}