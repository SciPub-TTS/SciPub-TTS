import {useEffect, useState} from "react";
import type {PublicationTrend} from "@/features/dashboard/topic/types/publication.ts";
import {topicService} from "@/features/dashboard/topic/services/topic-service.ts";

export function usePublicationTrend(startYear?: number, endYear?: number) {
    const [loading, setLoading] = useState<boolean>(false);
    const [publicationTrend, setPublicationTrend] = useState<PublicationTrend[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublicationTrend = async () =>{
            setLoading(true);
            setError(null);

            try {
                const data:PublicationTrend[] = await topicService.getPublicationTrend(startYear, endYear);
                setPublicationTrend(data);
            }catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load publication trend"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPublicationTrend();
    },[startYear, endYear])

    return {loading, publicationTrend, error};
}