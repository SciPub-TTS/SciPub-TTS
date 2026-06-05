import type { PaperDetailData, PaperDetailMetric } from "../types";

export type PaperImpactSectionData = {
  metrics: PaperDetailMetric[];
};

export function buildPaperImpactSection(
  paperDetail: PaperDetailData,
): PaperImpactSectionData {
  return {
    metrics: paperDetail.metrics,
  };
}
