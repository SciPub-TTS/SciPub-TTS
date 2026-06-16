import { Link2 } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  buildNextDetailUrl,
} from "@/features/detail/detailTrail";

import type { PaperDetailWorkLink } from "../../types";
import type { PaperReferencesSectionData } from "../../view-models/referencesSection";
import DetailSectionCard from "./DetailSectionCard";

type PaperReferencesSectionProps = {
  section: PaperReferencesSectionData;
};

type WorkReferenceListProps = {
  emptyLabel: string;
  items: PaperDetailWorkLink[];
  title: string;
};

export default function PaperReferencesSection(
  props: PaperReferencesSectionProps,
) {
  const { section } = props;

  if (section.references.length === 0 && section.relatedWorks.length === 0) {
    return null;
  }

  return (
    <DetailSectionCard
      icon={<Link2 className="h-5 w-5" />}
      title="References & Related Works"
    >
      <div className="space-y-4">
        <WorkReferenceList
          title="References"
          items={section.references}
          emptyLabel="No referenced works available."
        />
        <WorkReferenceList
          title="Related Works"
          items={section.relatedWorks}
          emptyLabel="No related works available."
        />
      </div>
    </DetailSectionCard>
  );
}

function WorkReferenceList(props: WorkReferenceListProps) {
  const { emptyLabel, items, title } = props;
  const location = useLocation();
  const { paperId = "" } = useParams();

  return (
    <div className="rounded-2xl border border-black bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a6700]">
          {title}
        </h3>
        <span className="text-sm font-semibold text-black">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm font-semibold text-slate-500">{emptyLabel}</p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-white to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-white via-white/80 to-transparent" />

            <div className="max-h-[26rem] space-y-2 overflow-y-auto pr-2">
              {items.map((item) => (
                <Link
                  key={`${title}-${item.id}`}
                  to={buildNextDetailUrl(
                    location.search,
                    "works",
                    paperId,
                    "works",
                    item.id,
                  )}
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-black transition hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
