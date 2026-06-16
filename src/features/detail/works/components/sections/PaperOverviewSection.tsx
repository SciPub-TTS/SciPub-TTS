import { BookOpenText } from "lucide-react";

import type { PaperOverviewSectionData } from "../../view-models/overviewSection";
import DetailSectionCard from "./DetailSectionCard";

type PaperOverviewSectionProps = {
  section: PaperOverviewSectionData;
};

export default function PaperOverviewSection(props: PaperOverviewSectionProps) {
  const { section } = props;

  return (
    <DetailSectionCard
      icon={<BookOpenText className="h-5 w-5" />}
      title="Paper Overview"
    >
      <p className="text-sm leading-7 text-black font-semibold">
        {section.abstractText}
      </p>
    </DetailSectionCard>
  );
}
