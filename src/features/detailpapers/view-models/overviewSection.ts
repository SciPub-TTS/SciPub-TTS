import type { PaperDetailData } from "../types";

export type PaperOverviewSectionData = {
  abstractText: string;
};

export function buildPaperOverviewSection(
  paperDetail: PaperDetailData,
): PaperOverviewSectionData {
  return {
    abstractText: paperDetail.abstractText,
  };
}
