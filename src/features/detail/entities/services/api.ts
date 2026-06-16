import { mapApiWorkToPaperResult } from "@/features/search/services/searchWorksMapper";
import { publicHttp } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type {
  AuthorDetailData,
  EntityDetailApiResponse,
  EntityDetailRelatedItem,
  EntityDetailTypeBreakdownItem,
  EntityDetailYearStat,
  TopicDetailData,
} from "../types";

export async function getAuthorDetail(authorId: string): Promise<AuthorDetailData> {
  const normalizedAuthorId = authorId.trim();

  if (!normalizedAuthorId) {
    throw new Error("Author ID is missing.");
  }

  const response = await publicHttp.get<ApiResponse<EntityDetailApiResponse>>(
    `/api/authors/${encodeURIComponent(normalizedAuthorId)}`,
  );
  const data = response.data.data;

  return mapAuthorDetail(data);
}

export async function getTopicDetail(topicId: string): Promise<TopicDetailData> {
  const normalizedTopicId = topicId.trim();

  if (!normalizedTopicId) {
    throw new Error("Topic ID is missing.");
  }

  const response = await publicHttp.get<ApiResponse<EntityDetailApiResponse>>(
    `/api/topics/${encodeURIComponent(normalizedTopicId)}`,
  );
  const data = response.data.data;

  return mapTopicDetail(data);
}

function mapAuthorDetail(data: EntityDetailApiResponse): AuthorDetailData {
  return {
    entityType: "authors",
    id: normalizeIdentifier(data.id),
    displayName: normalizeText(data.displayName) || "Unknown author",
    worksCount: Math.max(data.worksCount || 0, 0),
    citedByCount: Math.max(data.citedByCount || 0, 0),
    works: (data.works || []).map(mapApiWorkToPaperResult),
    countsByYear: normalizeYearStats(data.countsByYear),
    hIndex: normalizeNullableNumber(data.hIndex),
    i10Index: normalizeNullableNumber(data.i10Index),
    observedInstitutions: normalizeTextList(data.observedInstitutions),
    observedNames: normalizeTextList(data.observedNames),
    orcid: normalizeText(data.orcid),
    primaryInstitutionName: normalizeText(data.primaryInstitutionName),
    topicHighlights: normalizeRelatedItems(data.topicHighlights),
  };
}

function mapTopicDetail(data: EntityDetailApiResponse): TopicDetailData {
  return {
    entityType: "topics",
    id: normalizeIdentifier(data.id),
    displayName: normalizeText(data.displayName) || "Unknown topic",
    worksCount: Math.max(data.worksCount || 0, 0),
    citedByCount: Math.max(data.citedByCount || 0, 0),
    works: (data.works || []).map(mapApiWorkToPaperResult),
    countsByYear: normalizeYearStats(data.countsByYear),
    description: normalizeText(data.description),
    domainName: normalizeText(data.domainName),
    fieldName: normalizeText(data.fieldName),
    siblingTopics: normalizeRelatedItems(data.siblingTopics),
    subfieldName: normalizeText(data.subfieldName),
    typeBreakdown: normalizeTypeBreakdown(data.typeBreakdown),
  };
}

function normalizeYearStats(values: EntityDetailYearStat[] | null | undefined) {
  return (values || [])
    .filter((value) => Number.isFinite(value.year) && value.year > 0)
    .map((value) => ({
      year: value.year,
      worksCount: Math.max(value.worksCount || 0, 0),
      citedByCount: Math.max(value.citedByCount || 0, 0),
    }))
    .sort((leftValue, rightValue) => leftValue.year - rightValue.year);
}

function normalizeRelatedItems(
  values: EntityDetailRelatedItem[] | null | undefined,
) {
  return (values || [])
    .map((value) => ({
      id: normalizeIdentifier(value.id),
      displayName: normalizeText(value.displayName) || "",
      count: normalizeNullableNumber(value.count),
    }))
    .filter((value) => Boolean(value.id) && Boolean(value.displayName));
}

function normalizeTypeBreakdown(
  values: EntityDetailTypeBreakdownItem[] | null | undefined,
) {
  return (values || [])
    .map((value) => ({
      value: normalizeIdentifier(value.value),
      label: normalizeText(value.label) || "",
      count: Math.max(value.count || 0, 0),
    }))
    .filter((value) => Boolean(value.label));
}

function normalizeTextList(values: string[] | null | undefined) {
  const uniqueValues = new Set<string>();

  for (const value of values || []) {
    const normalizedValue = normalizeText(value);

    if (normalizedValue) {
      uniqueValues.add(normalizedValue);
    }
  }

  return [...uniqueValues];
}

function normalizeText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue || null;
}

function normalizeIdentifier(value: string | null | undefined) {
  return normalizeText(value) || "";
}

function normalizeNullableNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  return value;
}
