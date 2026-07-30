import { useEffect, useState } from "react";
import { topicService } from "@/features/dashboard/topic/services/topic-service.ts";
import type { TopicApiRequestBody } from "@/features/dashboard/topic/types/topic.ts";
import type { Momentum } from "@/features/dashboard/topic/types/momentum.ts";

export function useTopicMomentum(params?: TopicApiRequestBody) {
    const [loading, setLoading] = useState(false);
    const [momentumData, setMomentumData] = useState<Momentum[]>([]);
    const [error, setError] = useState<string | null>(null);

    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const fieldId = params?.fieldId;
    const formula = params?.formula;

    useEffect(() => {
        if (!startDate || !endDate || !fieldId || !formula) {
            return;
        }

        const controller = new AbortController();

        const fetchMomentum = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await topicService.getTopicsMomentum({
                    startDate,
                    endDate,
                    fieldId,
                    formula,
                });

                if (!controller.signal.aborted) {
                    setMomentumData(data);
                }
            } catch (err) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load topic momentum data"
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchMomentum();

        return () => controller.abort();
    }, [startDate, endDate, fieldId, formula]);

    return {
        loading,
        momentumData,
        error,
    };
}