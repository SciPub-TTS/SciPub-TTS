import type {
  PaperDetailData,
  PaperDetailEntityRef,
  PaperDetailSummaryItem,
} from "../types";

export type PaperSourceAccessSectionData = {
  accessItems: PaperDetailSummaryItem[];
  awards: string[];
  indexedIn: string[];
  keywords: string[];
  source: PaperDetailEntityRef | null;
  sourceHostOrganization: string | null;
  sourceName: string;
  sourceType: string;
  topics: PaperDetailEntityRef[];
};

export function buildPaperSourceAccessSection(
  paperDetail: PaperDetailData,
): PaperSourceAccessSectionData {
  return {
    accessItems: paperDetail.accessItems,
    awards: paperDetail.awards,
    indexedIn: paperDetail.indexedIn,
    keywords: paperDetail.keywords,
    source: paperDetail.source,
    sourceHostOrganization: paperDetail.sourceHostOrganization,
    sourceName: paperDetail.sourceName,
    sourceType: paperDetail.sourceType,
    topics: paperDetail.topics,
  };
}
