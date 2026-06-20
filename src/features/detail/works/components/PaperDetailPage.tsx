import PaperDetailHeader from "./PaperDetailHeader";
import PaperContributorsSection from "./sections/PaperContributorsSection";
import {
  PaperDetailErrorState,
  PaperDetailLoadingState,
} from "./sections/PaperDetailFeedbackState";
import PaperImpactSection from "./sections/PaperImpactSection";
import PaperOverviewSection from "./sections/PaperOverviewSection";
import PaperQuickLinksSection from "./sections/PaperQuickLinksSection";
import PaperReferencesSection from "./sections/PaperReferencesSection";
import PaperSourceAccessSection from "./sections/PaperSourceAccessSection";

import { usePaperDetailPageState } from "../hooks";
import { buildPaperDetailSections } from "../view-models/paperDetailSections";

export default function PaperDetailPage() {
  const { errorMessage, isLoading, paperDetail } = usePaperDetailPageState();

  if (isLoading) {
    return <PaperDetailLoadingState />;
  }

  if (errorMessage || !paperDetail) {
    return <PaperDetailErrorState message={errorMessage} />;
  }

  const sections = buildPaperDetailSections(paperDetail);

  return (
    <section className="space-y-6">
      <PaperDetailHeader paperDetail={paperDetail} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <PaperOverviewSection section={sections.overview} />
          <PaperContributorsSection section={sections.contributors} />
          <PaperSourceAccessSection section={sections.sourceAccess} />
        </div>

        <div className="space-y-6 xl:col-span-1">
          <PaperReferencesSection section={sections.references} />
          <PaperImpactSection section={sections.impact} />
          <PaperQuickLinksSection section={sections.quickLinks} />
        </div>
      </div>
    </section>
  );
}
