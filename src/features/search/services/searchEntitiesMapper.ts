import type {
  AuthorResult,
  TopicResult,
} from "../types";
import type { SearchEntityApiItem } from "./types";

export function mapApiEntityToResult(
  entity: SearchEntityApiItem,
): AuthorResult | TopicResult {
  switch (entity.entityType) {
    case "authors":
      return {
        id: extractLastSegment(entity.id),
        entityType: "authors",
        displayName: sanitizePlainText(entity.displayName) || "Unknown author",
        primaryInstitutionName: sanitizeOptionalText(
          entity.primaryInstitutionName,
        ),
        primaryTopicName: sanitizeOptionalText(entity.primaryTopicName),
        worksCount: Math.max(entity.worksCount || 0, 0),
      };
    case "topics":
      return {
        id: extractLastSegment(entity.id),
        entityType: "topics",
        displayName: sanitizePlainText(entity.displayName) || "Unknown topic",
        subfieldName: sanitizeOptionalText(entity.subfieldName),
        fieldName: sanitizeOptionalText(entity.fieldName),
        domainName: sanitizeOptionalText(entity.domainName),
        worksCount: Math.max(entity.worksCount || 0, 0),
      };
  }
}

function extractLastSegment(value: string) {
  const lastSlashIndex = value.lastIndexOf("/");

  if (lastSlashIndex === -1 || lastSlashIndex === value.length - 1) {
    return value;
  }

  return value.slice(lastSlashIndex + 1);
}

function sanitizeOptionalText(value: string | null) {
  const normalizedValue = sanitizePlainText(value);
  return normalizedValue || null;
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
