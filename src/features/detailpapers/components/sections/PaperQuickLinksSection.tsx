import { ExternalLink } from "lucide-react";

import type { PaperDetailQuickLink } from "../../types";
import type { PaperQuickLinksSectionData } from "../../view-models/quickLinksSection";
import DetailSectionCard from "./DetailSectionCard";

export default function PaperQuickLinksSection({
  section,
}: {
  section: PaperQuickLinksSectionData;
}) {
  return (
    <DetailSectionCard
      icon={<ExternalLink className="h-5 w-5" />}
      title="Quick Links"
    >
      <QuickLinksList links={section.links} />
    </DetailSectionCard>
  );
}

function QuickLinksList({ links }: { links: PaperDetailQuickLink[] }) {
  if (links.length === 0) {
    return <p className="text-sm text-slate-500">No quick links available.</p>;
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <span className="shrink-0 font-semibold text-blue-700">
            {link.label}
          </span>
          <span className="inline-flex min-w-0 items-start gap-2 text-right text-slate-500">
            <span className="break-all">{link.value}</span>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
          </span>
        </a>
      ))}
    </div>
  );
}
