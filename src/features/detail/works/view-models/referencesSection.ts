import type { PaperDetailData, PaperDetailWorkLink } from "../types";

export type PaperReferencesSectionData = {
  references: PaperDetailWorkLink[];
  relatedWorks: PaperDetailWorkLink[];
};

export function buildPaperReferencesSection(
  paperDetail: PaperDetailData,
): PaperReferencesSectionData {
  return {
    references: paperDetail.referencedWorks,
    relatedWorks: paperDetail.relatedWorks,
  };
}
