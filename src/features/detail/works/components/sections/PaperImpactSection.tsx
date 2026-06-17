import { ChartColumnBig } from "lucide-react";

import type { PaperDetailMetric } from "../../types";
import type { PaperImpactSectionData } from "../../view-models/impactSection";
import DetailSectionCard from "./DetailSectionCard";

type PaperImpactSectionProps = {
  section: PaperImpactSectionData;
};

type MetricGridProps = {
  items: PaperDetailMetric[];
};

export default function PaperImpactSection(props: PaperImpactSectionProps) {
  const { section } = props;

  return (
    <DetailSectionCard
      icon={<ChartColumnBig className="h-5 w-5" />}
      title="Impact Statistics"
    >
      <MetricGrid items={section.items} />
    </DetailSectionCard>
  );
}

function MetricGrid(props: MetricGridProps) {
  const { items } = props;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-h-[132px] flex-col overflow-hidden rounded-2xl border-2 border-[#3c8534] bg-white p-4"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a6700]">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-black">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
