import { useEffect, useState } from "react";
import { topicService } from "@/features/dashboard/topic/services/topic-service.ts";
import type { TopicAnalystApiRequestBody } from "@/features/dashboard/topic/types/topic.ts";
import type { TopicHeatmapData } from "@/features/dashboard/topic/types/heatmap.ts";
import { transformToNivoHeatmap, type NivoHeatmapRow } from "@/features/dashboard/topic/utils/heatmap-transform.ts";

export function useTopicHeatmap(params?: TopicAnalystApiRequestBody, selectedTopic?: string) {
    const [loading, setLoading] = useState(false);
    const [rawData, setRawData] = useState<TopicHeatmapData | null>(null);
    const [nivoData, setNivoData] = useState<NivoHeatmapRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    const startDate = params?.startDate;
    const endDate   = params?.endDate;
    const fieldId   = params?.fieldId;

    // Fetch khi params thay đổi
    useEffect(() => {
        if (!startDate || !endDate || !fieldId) return;
        const controller = new AbortController();

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await topicService.getTopicHeatmap({ startDate, endDate, fieldId });
                if (!controller.signal.aborted) setRawData(data);
            } catch (err) {
                if (!controller.signal.aborted)
                    setError(err instanceof Error ? err.message : "Failed to load heatmap");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [startDate, endDate, fieldId]);

    // Transform khi rawData hoặc selectedTopic thay đổi
    useEffect(() => {
        if (!rawData || !selectedTopic) return;
        setNivoData(transformToNivoHeatmap(rawData, selectedTopic));
    }, [rawData, selectedTopic]);

    return { loading, nivoData, error };
}