import PaperDetailHeader from "./PaperDetailHeader";
import PaperContributorsSection from "./sections/PaperContributorsSection";
import {
  PaperDetailErrorState,
  PaperDetailLoadingState,
} from "./sections/PaperDetailFeedbackState";
import PaperImpactSection from "./sections/PaperImpactSection";
import PaperOverviewSection from "./sections/PaperOverviewSection";
import PaperQuickLinksSection from "./sections/PaperQuickLinksSection";
import PaperSourceAccessSection from "./sections/PaperSourceAccessSection";

import { usePaperDetailPageState } from "../hooks";
import { buildPaperContributorsSection } from "../view-models/contributorsSection";
import { buildPaperImpactSection } from "../view-models/impactSection";
import { buildPaperOverviewSection } from "../view-models/overviewSection";
import { buildPaperQuickLinksSection } from "../view-models/quickLinksSection";
import { buildPaperSourceAccessSection } from "../view-models/sourceAccessSection";

export default function PaperDetailPage() {
  const { errorMessage, isLoading, paperDetail } = usePaperDetailPageState();

  if (isLoading) {
    return <PaperDetailLoadingState />;
  }

  if (errorMessage || !paperDetail) {
    return <PaperDetailErrorState message={errorMessage} />;
  }

  const overviewSection = buildPaperOverviewSection(paperDetail);
  const contributorsSection = buildPaperContributorsSection(paperDetail);
  const sourceAccessSection = buildPaperSourceAccessSection(paperDetail);
  const impactSection = buildPaperImpactSection(paperDetail);
  const quickLinksSection = buildPaperQuickLinksSection(paperDetail);

  return (
    <section className="space-y-6">
      <PaperDetailHeader paperDetail={paperDetail} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <PaperOverviewSection section={overviewSection} />
          <PaperContributorsSection section={contributorsSection} />
          <PaperSourceAccessSection section={sourceAccessSection} />
        </div>

        <div className="space-y-6 xl:col-span-1">
          <PaperImpactSection section={impactSection} />
          <PaperQuickLinksSection section={quickLinksSection} />
        </div>
      </div>
    </section>
  );
}
