import type { PaperResult } from "../types";
import type { SearchWorksApiItem } from "./types";

export function mapApiWorkToPaperResult(work: SearchWorksApiItem): PaperResult {
  const title = sanitizePlainText(work.title) || "Untitled";
  const normalizedType = normalizeTypeLabel(work.type);
  const normalizedSource =
    sanitizePlainText(work.sourceName) || "Unknown source";
  const normalizedTopic =
    sanitizePlainText(work.topic).trim() || normalizedSource;
  const normalizedSubField =
    sanitizePlainText(work.subFieldName).trim() || "Unknown subfield";
  const currentYear = new Date().getFullYear();
  const publicationYear = normalizePublicationYear(
    work.publicationYear,
    currentYear,
  );
  const citedByCount = work.citedByCount || 0;
  const normalizedAbstract =
    work.abstractText === null
      ? "Null"
      : sanitizePlainText(work.abstractText).trim();
  const summary =
    normalizedAbstract || `OpenAlex result from ${normalizedSource}.`;
  const authors = mapAuthorNames(work.authors);
  const keywords = buildKeywords(work.keywords, normalizedSubField, normalizedTopic);

  return {
    id: extractLastSegment(work.id),
    title,
    authors,
    venue: normalizedSource,
    citations: citedByCount,
    year: publicationYear,
    abstract: summary,
    fullText: summary,
    doi: normalizeDoi(work.doi),
    pdfUrl: work.pdfUrl,
    keywords,
    field: normalizedType,
    topic: normalizedTopic,
    subField: normalizedSubField,
    matchesTrendingKeyword: Boolean(work.matchesTrendingKeyword),
    matchesTrendingTopic: Boolean(work.matchesTrendingTopic),
    trendingScore: work.trendingScore || 0,
    growthPercent: 0,
    isTrendTopic: false,
    saved: false,
    trend: false,
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
  const normalizedType = sanitizePlainText(type).trim();

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

function normalizeDoi(doi: string | null) {
  if (!doi) {
    return "";
  }

  return doi.replace(/^https?:\/\//, "");
}

function buildKeywords(
  rawKeywords: string[] | null | undefined,
  subField: string,
  topicName: string,
) {
  const keywords: string[] = [];

  for (const rawKeyword of rawKeywords || []) {
    const normalizedKeyword = sanitizePlainText(rawKeyword);

    if (normalizedKeyword.length > 0 && !keywords.includes(normalizedKeyword)) {
      keywords.push(normalizedKeyword);
    }

    if (keywords.length === 3) {
      return keywords;
    }
  }

  const fallbackValues = [subField, topicName];

  for (const value of fallbackValues) {
    if (value.trim().length > 0 && !keywords.includes(value)) {
      keywords.push(value);
    }

    if (keywords.length === 3) {
      break;
    }
  }

  return keywords;
}

function extractLastSegment(value: string) {
  const lastSlashIndex = value.lastIndexOf("/");

  if (lastSlashIndex === -1 || lastSlashIndex === value.length - 1) {
    return value;
  }

  return value.slice(lastSlashIndex + 1);
}

function mapAuthorNames(authorNames: string[]) {
  const result: string[] = [];

  for (const authorName of authorNames) {
    const normalizedName = sanitizePlainText(authorName);

    if (normalizedName.length > 0) {
      result.push(normalizedName);
    }
  }

  return result;
}

let htmlEntityDecoder: HTMLTextAreaElement | null = null;

function sanitizePlainText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const decodedText = decodeHtmlEntities(value);
  const withoutHtmlTags = decodedText.replace(/<[^>]*>/g, " ");

  return withoutHtmlTags.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string) {
  if (!value.includes("&")) {
    return value;
  }

  if (typeof document === "undefined") {
    return value;
  }

  if (!htmlEntityDecoder) {
    htmlEntityDecoder = document.createElement("textarea");
  }

  htmlEntityDecoder.innerHTML = value;
  return htmlEntityDecoder.value;
}
