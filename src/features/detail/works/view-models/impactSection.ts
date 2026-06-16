import type {
  PaperDetailData,
  PaperDetailImpactChartItem,
  PaperDetailImpactPieChartItem,
  PaperDetailMetric,
} from "../types";

export type PaperImpactSectionData = {
  items: PaperDetailMetric[];
};

export type PaperImpactChartsSectionData = {
  barChartItems: PaperDetailImpactChartItem[];
  pieChartItems: PaperDetailImpactPieChartItem[];
};

export function buildPaperImpactSection(
  paperDetail: PaperDetailData,
): PaperImpactSectionData {
  return {
    items: paperDetail.items,
  };
}

export function buildPaperImpactChartsSection(
  paperDetail: PaperDetailData,
): PaperImpactChartsSectionData {
  return {
    barChartItems: paperDetail.impactChartItems,
    pieChartItems: paperDetail.impactPieChartItems,
  };
}
