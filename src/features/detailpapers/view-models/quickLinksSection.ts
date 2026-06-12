import type { PaperDetailData, PaperDetailQuickLink } from "../types";

export type PaperQuickLinksSectionData = {
  links: PaperDetailQuickLink[];
};

export function buildPaperQuickLinksSection(
  paperDetail: PaperDetailData,
): PaperQuickLinksSectionData {
  return {
    links: paperDetail.quickLinks,
  };
}
