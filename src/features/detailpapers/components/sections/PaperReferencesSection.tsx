import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router";

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
      <div className="grid gap-4 xl:grid-cols-2">
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

  return (
    <div className="rounded-2xl border border-black bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-black">
          {title}
        </h3>
        <span className="text-sm font-semibold text-[#9a6700]">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm font-semibold text-slate-500">{emptyLabel}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <Link
              key={`${title}-${item.id}`}
              to={routePaths.paperDetail(item.id)}
              className="block text-sm font-semibold text-black transition hover:text-blue-700 hover:underline hover:decoration-blue-700 hover:underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
