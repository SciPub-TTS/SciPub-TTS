import { useEffect, useState } from "react";
import { topicService } from "@/features/dashboard/topic/services/topic-service.ts";
import type { TopicAnalystApiRequestBody } from "@/features/dashboard/topic/types/topic.ts";
import type { TopicRadarData } from "@/features/dashboard/topic/types/radar.ts"; // Bạn sửa lại path cho đúng file chứa type nhé

export function useTopicRadar(params?: TopicAnalystApiRequestBody) {
    const [loading, setLoading] = useState<boolean>(false);
    const [radarData, setRadarData] = useState<TopicRadarData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const fieldId = params?.fieldId;

    useEffect(() => {
        if (!startDate || !endDate || !fieldId) return;

        const controller = new AbortController();

        const fetchRadar = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await topicService.getTopicRadar({
                    startDate,
                    endDate,
                    fieldId
                });

                if (!controller.signal.aborted) {
                    setRadarData(data);
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                setError(err instanceof Error ? err.message : "Failed to load topic radar data");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchRadar();

        return () => {
            controller.abort();
        };
    }, [startDate, endDate, fieldId]);

    return { loading, radarData, error };
}