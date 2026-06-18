import { useEffect, useState } from "react";
import type {KeywordApiRequest, KeywordsMetric} from "@/features/dashboard/keyword/types/keyword.ts";
import {keywordService} from "@/features/dashboard/keyword/services/keyword-service.ts";


export function useHotKeyword({ recentStart, recentEnd, fieldId, formula }: KeywordApiRequest) {
    const [keywordList, setKeywordList] = useState<KeywordsMetric[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchKeywords() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await keywordService.getKeywordTrend({ recentStart, recentEnd, fieldId, formula });
                if (isMounted) {
                    setKeywordList(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error("Failed to fetch keywords"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchKeywords();

        return () => {
            isMounted = false;
        };
    }, [recentStart, recentEnd, fieldId, formula]);

    return {keywordList, isLoading, error};
}