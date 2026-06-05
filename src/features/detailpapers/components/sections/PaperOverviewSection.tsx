import { BookOpenText } from "lucide-react";

import type { PaperOverviewSectionData } from "../../view-models/overviewSection";
import DetailSectionCard from "./DetailSectionCard";

export default function PaperOverviewSection({
  section,
}: {
  section: PaperOverviewSectionData;
}) {
  return (
    <DetailSectionCard
      icon={<BookOpenText className="h-5 w-5" />}
      title="Paper Overview"
    >
      <p className="text-sm leading-7 text-slate-700">{section.abstractText}</p>
    </DetailSectionCard>
  );
}
