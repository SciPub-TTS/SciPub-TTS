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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-[#9a6700]">
            {item.value}
          </p>
          {item.badgeLabel ? (
            <div className="mt-auto pt-4">
              <span
                className={[
                  "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]",
                  item.tone === "positive"
                    ? "border-[#3c8534] bg-[#ECFFF5] text-[#2c6b26]"
                    : "border-[#9a6700] bg-[#fff8e7] text-[#9a6700]",
                ].join(" ")}
              >
                {item.badgeLabel}
              </span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
