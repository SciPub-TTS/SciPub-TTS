import { useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import {
  getTrendingKeywords,
  getTrendingTopics,
} from "@/features/search/services";

const TRENDING_TOPICS_LIMIT = 12;
const TRENDING_KEYWORDS_LIMIT = 16;

export function useTrendingSnapshotState() {
  const [trendingTopicsQuery, trendingKeywordsQuery] = useQueries({
    queries: [
      {
        queryFn: () => getTrendingTopics(undefined, TRENDING_TOPICS_LIMIT),
        queryKey: ["searchTrendingTopics", TRENDING_TOPICS_LIMIT],
      },
      {
        queryFn: () => getTrendingKeywords(undefined, TRENDING_KEYWORDS_LIMIT),
        queryKey: ["searchTrendingKeywords", TRENDING_KEYWORDS_LIMIT],
      },
    ],
  });

  useEffect(() => {
    if (trendingTopicsQuery.error) {
      console.error("Cannot load trending topics:", trendingTopicsQuery.error);
    }
  }, [trendingTopicsQuery.error]);

  useEffect(() => {
    if (trendingKeywordsQuery.error) {
      console.error("Cannot load trending keywords:", trendingKeywordsQuery.error);
    }
  }, [trendingKeywordsQuery.error]);

  const trendingTopicNames = useMemo(
    () =>
      uniqueNonEmptyLabels(
        (trendingTopicsQuery.data?.topics || []).map((item) => item.name),
      ),
    [trendingTopicsQuery.data?.topics],
  );
  const trendingKeywordNames = useMemo(
    () =>
      uniqueNonEmptyLabels(
        (trendingKeywordsQuery.data?.keywords || []).map((item) => item.name),
      ),
    [trendingKeywordsQuery.data?.keywords],
  );

  return {
    hasLoadedTrendSnapshot:
      trendingTopicsQuery.status !== "pending"
      && trendingKeywordsQuery.status !== "pending",
    topicHotSearches: trendingTopicNames.slice(0, 8),
    trendingKeywordNames,
    trendingTopicNames,
  };
}

function uniqueNonEmptyLabels(labels: string[]) {
  const seenLabels = new Set<string>();
  const result: string[] = [];

  for (const label of labels) {
    const normalizedLabel = label.trim();

    if (!normalizedLabel || seenLabels.has(normalizedLabel)) {
      continue;
    }

    seenLabels.add(normalizedLabel);
    result.push(normalizedLabel);
  }

  return result;
}
