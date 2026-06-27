import { routePaths } from "@/app/router";
import type { PaperResultCardProps } from "@/features/search/types";
import {
  buildNormalizedTrendLabelSet,
  isExactTrendMatch,
} from "@/features/search/utils";
import ListWorkLayout from "@/layout/global/ListWorkLayout";

export function PaperResultCard({
  paper,
  trendingKeywordNames,
  trendingTopicNames,
}: PaperResultCardProps) {
  const normalizedTrendingTopics = buildNormalizedTrendLabelSet(trendingTopicNames);
  const normalizedTrendingKeywords = buildNormalizedTrendLabelSet(trendingKeywordNames);
  const topicLabel = (paper.topicRef?.name || paper.topic).trim();
  const isTrendTopic = isExactTrendMatch(topicLabel, normalizedTrendingTopics);
  const trendingKeywords = paper.keywords.filter((keyword) =>
    isExactTrendMatch(keyword, normalizedTrendingKeywords),
  );

  return (
    <ListWorkLayout
      abstractText={paper.abstract}
      authors={paper.authors}
      authorRefs={paper.authorRefs}
      citations={paper.citations}
      detailHref={routePaths.paperDetail(paper.id)}
      doi={paper.doi}
      field={paper.field}
      isSaved={paper.saved}
      isTrendTopic={isTrendTopic}
      keywords={paper.keywords}
      pdfUrl={paper.pdfUrl}
      subField={paper.subField}
      title={paper.title}
      topic={paper.topic}
      topicRef={paper.topicRef}
      trendingKeywords={trendingKeywords}
      source={paper.source}
      workId={paper.id}
      year={paper.year}
    />
  );
}

