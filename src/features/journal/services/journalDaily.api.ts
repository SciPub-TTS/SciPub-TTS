import { publicHttp } from "@/services/http";

import type { JournalArticle } from "../types/journal.types";

export type JournalArticlePage = {
  articles: JournalArticle[];
  totalItems: number;
};

type JournalDailyApiArticle = {
  id: number | string;
  externalId?: string | null;
  title?: string | null;
  summary?: string | null;
  author?: string | null;
  thumbnailUrl?: string | null;
  imgUrl?: string | null;
  sourceUrl?: string | null;
  webUrl?: string | null;
  publishedAt?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

type JournalDailyApiPage = {
  content?: JournalDailyApiArticle[];
  totalElements?: number;
};

type FetchJournalArticlesParams = {
  page: number;
  pageSize: number;
  title: string;
};

export async function fetchJournalDailyArticles(
  params: FetchJournalArticlesParams,
): Promise<JournalArticlePage> {
  const queryParams = new URLSearchParams();
  const normalizedTitle = params.title.trim();

  queryParams.set("page", String(Math.max(params.page - 1, 0)));
  queryParams.set("size", String(params.pageSize));

  if (normalizedTitle) {
    queryParams.set("title", normalizedTitle);
  }

  const response = await publicHttp.get<JournalDailyApiPage>(
    "/api/journal-daily/articles/search",
    { params: queryParams },
  );
  const data = response.data;
  const content = Array.isArray(data.content) ? data.content : [];

  return {
    articles: content.map(mapJournalArticle),
    totalItems: data.totalElements ?? content.length,
  };
}

function mapJournalArticle(article: JournalDailyApiArticle): JournalArticle {
  const sourceUrl = article.sourceUrl || article.webUrl || "";
  const publishedAt = article.publishedAt || "";

  return {
    id: String(article.id),
    externalId: article.externalId || undefined,
    title: article.title || "Untitled article",
    author: article.author || "The Guardian",
    publishedDate: publishedAt,
    tags: Array.isArray(article.tags) ? article.tags.filter(Boolean) : [],
    thumbnailUrl: article.thumbnailUrl || article.imgUrl || "/trending.png",
    summary: article.summary || "No summary available.",
    sourceUrl,
    webUrl: article.webUrl || sourceUrl,
    category: article.category || "Science",
  };
}
