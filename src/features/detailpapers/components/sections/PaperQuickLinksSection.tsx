import { ExternalLink } from "lucide-react";

import type { PaperDetailQuickLink } from "../../types";
import type { PaperQuickLinksSectionData } from "../../view-models/quickLinksSection";
import DetailSectionCard from "./DetailSectionCard";

type PaperQuickLinksSectionProps = {
  section: PaperQuickLinksSectionData;
};

type QuickLinksListProps = {
  links: PaperDetailQuickLink[];
};

export default function PaperQuickLinksSection(
  props: PaperQuickLinksSectionProps,
) {
  const { section } = props;

  return (
    <DetailSectionCard
      icon={<ExternalLink className="h-5 w-5" />}
      title="Quick Links"
    >
      <QuickLinksList links={section.links} />
    </DetailSectionCard>
  );
}

function QuickLinksList(props: QuickLinksListProps) {
  const { links } = props;

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href || "missing"}`}
          href={link.href || undefined}
          target={link.href ? "_blank" : undefined}
          rel={link.href ? "noreferrer" : undefined}
          aria-disabled={!link.href}
          className={[
            "group flex items-start justify-between gap-4 rounded-2xl border border-black px-4 py-3 text-sm",
            link.href
              ? "bg-white transition hover:bg-slate-50"
              : "cursor-not-allowed bg-slate-100 text-slate-400 pointer-events-none",
          ].join(" ")}
        >
          <span
            className={[
              "shrink-0 font-semibold",
              link.href
                ? "text-black group-hover:text-blue-700 group-hover:underline group-hover:decoration-blue-700 group-hover:underline-offset-4"
                : "text-slate-400",
            ].join(" ")}
          >
            {link.label}
          </span>
          <span
            className={[
              "inline-flex min-w-0 items-start gap-2 text-right",
              link.href ? "text-black" : "text-slate-400",
            ].join(" ")}
          >
            <span className="break-all">{link.value}</span>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
          </span>
        </a>
      ))}
    </div>
  );
}
