import { ChartColumnBig } from "lucide-react";

import type { PaperDetailMetric } from "../../types";
import type { PaperImpactSectionData } from "../../view-models/impactSection";
import DetailSectionCard from "./DetailSectionCard";

export default function PaperImpactSection({
  section,
}: {
  section: PaperImpactSectionData;
}) {
  return (
    <DetailSectionCard
      icon={<ChartColumnBig className="h-5 w-5" />}
      title="Impact Statistics"
    >
      <MetricGrid metrics={section.metrics} />
    </DetailSectionCard>
  );
}

function MetricGrid({ metrics }: { metrics: PaperDetailMetric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex min-h-[132px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            {metric.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metric.value}
          </p>
          {metric.badgeLabel ? (
            <div className="mt-auto pt-4">
              <span
                className={[
                  "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]",
                  metric.tone === "positive"
                    ? "border-[#00A859] bg-[#ECFFF5] text-[#007A41]"
                    : "border-slate-300 bg-white text-slate-600",
                ].join(" ")}
              >
                {metric.badgeLabel}
              </span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
