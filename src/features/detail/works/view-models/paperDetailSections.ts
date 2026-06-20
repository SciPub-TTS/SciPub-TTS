import type { PaperDetailData } from "../types";
import { buildPaperContributorsSection } from "./contributorsSection";
import { buildPaperImpactSection } from "./impactSection";
import { buildPaperOverviewSection } from "./overviewSection";
import { buildPaperQuickLinksSection } from "./quickLinksSection";
import { buildPaperReferencesSection } from "./referencesSection";
import { buildPaperSourceAccessSection } from "./sourceAccessSection";

// The detail page renders six section cards, all built from the same paper
// payload. Aggregating them here makes the page component read top-to-bottom.
export function buildPaperDetailSections(paperDetail: PaperDetailData) {
  return {
    contributors: buildPaperContributorsSection(paperDetail),
    impact: buildPaperImpactSection(paperDetail),
    overview: buildPaperOverviewSection(paperDetail),
    quickLinks: buildPaperQuickLinksSection(paperDetail),
    references: buildPaperReferencesSection(paperDetail),
    sourceAccess: buildPaperSourceAccessSection(paperDetail),
  };
}

