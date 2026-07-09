import type {
  OpenAlexWorkDetailApi,
  PaperDetailBadge,
} from "../types";
import { extractLastSegment } from "./paperDetailShared";

export function buildHeaderBadges(
  work: OpenAlexWorkDetailApi,
  normalizedType: string,
) {
  const badges: PaperDetailBadge[] = [];
  const subFieldName = work.primary_topic?.subfield?.display_name?.trim();
  const topicName = work.primary_topic?.display_name?.trim();

  if (subFieldName) {
    badges.push({
      label: subFieldName,
      tone: "accent",
    });
  }

  if (topicName) {
    badges.push({
      entityId: extractLastSegment(work.primary_topic?.id?.trim() || ""),
      entityType: "topic",
      label: topicName,
      tone: "topic",
    });
  }

  badges.push({
    label: normalizedType,
    tone: "default",
  });

  return badges;
}
