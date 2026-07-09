import { buildDetailTrailUrl } from "@/features/detail/detailTrail";
import ListWorkLayout from "@/layout/global/ListWorkLayout";

import type { FeedArticle } from "../types";

type FeedArticleCardProps = {
  article: FeedArticle;
};

export function FeedArticleCard({ article }: FeedArticleCardProps) {
  return (
    <ListWorkLayout
      abstractText={article.abstract}
      authors={article.authors}
      authorRefs={article.authorRefs}
      citations={article.citations}
      detailHref={buildDetailTrailUrl("works", article.id, [], "newfeed")}
      detailOrigin="newfeed"
      doi={article.doi}
      field={article.field}
      feedReasonText={article.reason}
      isSaved={article.saved}
      isTrendTopic={Boolean(article.isTrendTopic)}
      keywords={article.keywords}
      pdfUrl={article.pdfUrl}
      preserveSearchStateOnDetailClick={false}
      subField={article.subField}
      title={article.title}
      topic={article.topic}
      topicRef={article.topicRef}
      trendingKeywords={[]}
      source={article.source}
      workId={article.id}
      year={article.year}
    />
  );
}
