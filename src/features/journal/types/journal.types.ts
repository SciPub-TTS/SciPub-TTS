export type JournalArticle = {
  id: string;
  externalId?: string;
  title: string;
  author: string;
  publishedDate: string;
  tags: string[];
  thumbnailUrl: string;
  summary: string;
  sourceUrl: string;
  webUrl: string;
  category: string;
};
