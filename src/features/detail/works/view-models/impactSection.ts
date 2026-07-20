import type {
  PaperDetailData,
  PaperDetailMetric,
} from "../types";

export type PaperImpactSectionData = {
  items: PaperDetailMetric[];
};

export function buildPaperImpactSection(
  paperDetail: PaperDetailData,
): PaperImpactSectionData {
  return {
    items: paperDetail.items,
  };
}
