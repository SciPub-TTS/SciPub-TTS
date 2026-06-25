import { useEffect, useState } from "react";
import { topicService } from "@/features/dashboard/topic/services/topic-service.ts";
import type {TopicApiRequestBody, TopicData, TopicMetadata} from "@/features/dashboard/topic/types/topic.ts";
import {useAppDispatch} from "@/store";
import {setTopicList} from "@/features/dashboard/topic/store/storeTopicList.tsx";

export function useTopicRanking({ startDate, endDate, fieldId, formula }: TopicApiRequestBody) {
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<TopicData[]>([]);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();

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

                const metadata: TopicMetadata[] = data.map(topic => ({
                    id: topic.topicId,
                    name: topic.name,
                }));

                dispatch(setTopicList(metadata));

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