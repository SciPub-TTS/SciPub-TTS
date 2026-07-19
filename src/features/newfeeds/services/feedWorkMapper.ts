import {
  extractPathId,
  normalizeDoiValue,
  toPlainText,
} from "@/lib/resourceFormatting";
import type { PaperResult, PaperResultEntityRef } from "@/features/search/types";

export type FeedWorkApiItem = {
  id: string;
  title: string;
  abstractText: string | null;
  doi: string | null;
  publicationYear: number | null;
  citedByCount: number | null;
  openAccess: boolean | null;
  hasPdf: boolean | null;
  pdfUrl: string | null;
  hasOrcid: boolean | null;
  type: string | null;
  topic: string | null;
  subFieldName: string | null;
  sourceId: string | null;
  sourceName: string | null;
  authors: string[];
  authorRefs?: Array<{
    id: string | null;
    displayName: string;
  }> | null;
  keywords: string[];
  topicRef?: {
    id: string | null;
    displayName: string;
  } | null;
};

export function mapFeedWorkToPaperResult(work: FeedWorkApiItem): PaperResult {
  const title = toPlainText(work.title) || "Untitled";
  const normalizedType = normalizeTypeLabel(work.type);
  const normalizedSource = toPlainText(work.sourceName) || "Unknown source";
  const topicRef = mapEntityRef(work.topicRef);
  const normalizedTopic =
    topicRef?.name || toPlainText(work.topic) || normalizedSource;
  const normalizedSubField =
    toPlainText(work.subFieldName) || "Unknown subfield";
  const currentYear = new Date().getFullYear();
  const publicationYear = normalizePublicationYear(
    work.publicationYear,
    currentYear,
  );
  const citedByCount = work.citedByCount || 0;
  const normalizedAbstract =
    work.abstractText === null
      ? "Null"
      : toPlainText(work.abstractText);
  const summary =
    normalizedAbstract || `OpenAlex result from ${normalizedSource}.`;
  const authorRefs = mapAuthorRefs(work.authorRefs, work.authors);
  const authors =
    authorRefs.length > 0
      ? authorRefs.map((authorRef) => authorRef.name)
      : mapAuthorNames(work.authors);
  const keywords = buildKeywords(
    work.keywords,
    normalizedSubField,
    normalizedTopic,
  );

  return {
    id: extractPathId(work.id),
    entityType: "works",
    title,
    authors,
    authorRefs,
    source: normalizedSource,
    citations: citedByCount,
    year: publicationYear,
    abstract: summary,
    fullText: summary,
    doi: normalizeDoiValue(work.doi),
    pdfUrl: work.pdfUrl,
    keywords,
    field: normalizedType,
    topic: normalizedTopic,
    topicRef,
    subField: normalizedSubField,
    growthPercent: 0,
    saved: false,
  };
}

function normalizePublicationYear(
  publicationYear: number | null,
  currentYear: number,
) {
  if (!publicationYear) {
    return currentYear;
  }

  if (publicationYear > currentYear) {
    return currentYear;
  }

  return publicationYear;
}

function normalizeTypeLabel(type: string | null) {
  const normalizedType = toPlainText(type);

  if (!normalizedType) {
    return "Work";
  }

  const segments = normalizedType.split("-");
  const normalizedSegments: string[] = [];

  for (const segment of segments) {
    normalizedSegments.push(segment.charAt(0).toUpperCase() + segment.slice(1));
  }

  return normalizedSegments.join(" ");
}

function buildKeywords(
  rawKeywords: string[] | null | undefined,
  subField: string,
  topicName: string,
) {
  const keywords: string[] = [];

  for (const rawKeyword of rawKeywords || []) {
    const normalizedKeyword = toPlainText(rawKeyword);

    if (normalizedKeyword.length > 0 && !keywords.includes(normalizedKeyword)) {
      keywords.push(normalizedKeyword);
    }

    if (keywords.length === 8) {
      return keywords;
    }
  }

  const fallbackValues = [subField, topicName];

  for (const value of fallbackValues) {
    if (value.trim().length > 0 && !keywords.includes(value)) {
      keywords.push(value.trim());
    }

    if (keywords.length === 8) {
      break;
    }
  }

  return keywords;
}

function mapAuthorNames(authorNames: string[]) {
  const result: string[] = [];

  for (const authorName of authorNames) {
    const normalizedName = toPlainText(authorName);

    if (normalizedName.length > 0) {
      result.push(normalizedName);
    }
  }

  return result;
}

function mapAuthorRefs(
  rawAuthorRefs: FeedWorkApiItem["authorRefs"],
  fallbackAuthorNames: string[],
) {
  const authorRefs: PaperResultEntityRef[] = [];

  for (const rawAuthorRef of rawAuthorRefs || []) {
    const normalizedName = toPlainText(rawAuthorRef?.displayName);

    if (!normalizedName) {
      continue;
    }

    authorRefs.push({
      id: normalizeEntityId(rawAuthorRef?.id),
      name: normalizedName,
    });
  }

  if (authorRefs.length > 0) {
    return authorRefs;
  }

  return mapAuthorNames(fallbackAuthorNames).map((authorName) => ({
    id: null,
    name: authorName,
  }));
}

function mapEntityRef(
  rawEntityRef: FeedWorkApiItem["topicRef"],
): PaperResultEntityRef | null {
  const normalizedName = toPlainText(rawEntityRef?.displayName);

  if (!normalizedName) {
    return null;
  }

  return {
    id: normalizeEntityId(rawEntityRef?.id),
    name: normalizedName,
  };
}

function normalizeEntityId(value: string | null | undefined) {
  const normalizedValue = extractPathId(value);
  return normalizedValue || null;
}
