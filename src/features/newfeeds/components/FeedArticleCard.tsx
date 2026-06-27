import { routePaths } from "@/app/router";
import ListWorkLayout from "@/layout/global/ListWorkLayout";

import type { FeedArticle, FeedBadge } from "../types";

type FeedArticleCardProps = {
  article: FeedArticle;
};

export function FeedArticleCard({ article }: FeedArticleCardProps) {
  const primaryTopicBadge = article.badges.find((badge) => badge.tone === "topic");
  const authorMatchBadge = article.badges.find((badge) => badge.tone === "author");
  const hasTrendSignal = article.badges.some((badge) => isTrendBadgeTone(badge.tone));

  return (
    <ListWorkLayout
      abstractLabel="Why this paper"
      abstractText={article.reason}
      authors={article.authors.map((author) => author.name)}
      citations={article.citations}
      detailHref={routePaths.paperDetail(article.id)}
      doi=""
      field={`${article.relevance}% relevance`}
      followedAuthors={article.authors
        .filter((author) => author.following)
        .map((author) => author.name)}
      isTrendTopic={hasTrendSignal}
      keywords={article.tags}
      pdfUrl={null}
      preserveSearchStateOnDetailClick={false}
      subField={authorMatchBadge?.label || "Research Feed"}
      title={article.title}
      topic={primaryTopicBadge?.label || article.tags[0] || "Recommended paper"}
      trendingKeywords={hasTrendSignal ? article.tags : []}
      venue={article.venue}
      workId={article.id}
      year={article.year}
    />
  );
}

function isTrendBadgeTone(tone: FeedBadge["tone"]) {
  return tone === "match" || tone === "rising";
}
