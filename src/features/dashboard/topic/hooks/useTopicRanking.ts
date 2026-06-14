import { useEffect, useState } from "react";
import { topicService } from "@/features/dashboard/topic/services/topic-service.ts";
import type { TopicApiRequestBody, TopicData } from "@/features/dashboard/topic/types/topic.ts";

export function useTopicRanking({ startDate, endDate, fieldId, formula }: TopicApiRequestBody) {
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<TopicData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await topicService.getRankedTopics({
                    startDate,
                    endDate,
                    fieldId,
                    formula
                });
                setTopics(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load topic ranking");
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [startDate, endDate, fieldId, formula]);

    return { loading, topics, error };
}