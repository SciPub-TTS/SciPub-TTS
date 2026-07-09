import {useMemo} from "react";
import type {KeywordMetric} from "@/features/dashboard/keyword/types/metric.ts";
import {
    KEYWORD_COLORS
} from "@/features/dashboard/keyword/constants/metric-data.ts";
import type {KeywordsMetric} from "@/features/dashboard/keyword/types/keyword.ts";

export const useGeneralsMetric = (keywordList:KeywordsMetric[]) => {
    const metricList = useMemo<KeywordMetric[]>(() => {
        return keywordList.map((keyword, index) => ({
            keyword: keyword.name,

            cagr: keyword.cagr,

            publicationShare: keyword.ps,

            recentPapers: keyword.worksCount,

            hotScore: Number(
                (keyword.score * 100).toFixed(1),
            ),

            color:
                KEYWORD_COLORS[
                index % KEYWORD_COLORS.length
                    ],
        }));
    }, [keywordList]);

    return {
        metricList,
    };
};