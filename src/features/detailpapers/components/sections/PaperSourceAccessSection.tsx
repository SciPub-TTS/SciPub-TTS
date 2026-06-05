import type { ReactNode } from "react";

import { Globe2, Landmark, Tag } from "lucide-react";

import EntityCanvasLink from "@/features/entity-canvas/components/EntityCanvasLink";
import MetadataBadge from "@/layout/components/MetadataBadge";

import type {
  PaperDetailEntityRef,
  PaperDetailSummaryItem,
} from "../../types";
import type { PaperSourceAccessSectionData } from "../../view-models/sourceAccessSection";
import DetailSectionCard from "./DetailSectionCard";

export default function PaperSourceAccessSection({
  section,
}: {
  section: PaperSourceAccessSectionData;
}) {
  return (
    <DetailSectionCard
      icon={<Landmark className="h-5 w-5" />}
      title="Source & Access"
    >
      <div className="space-y-2 text-sm text-slate-700">
        {section.source ? (
          <EntityCanvasLink
            entityId={section.source.id}
            entityType={section.source.type}
            label={section.source.name}
            className="text-left text-base font-semibold text-blue-700 hover:text-blue-900"
          >
            {section.source.name}
          </EntityCanvasLink>
        ) : (
          <p className="font-semibold text-slate-900">{section.sourceName}</p>
        )}
        <p>{section.sourceType}</p>
        {section.sourceHostOrganization ? (
          <p>{section.sourceHostOrganization}</p>
        ) : null}
      </div>

      <EntityTagCluster
        title="Topics"
        items={section.topics}
        icon={<Tag className="h-4 w-4" />}
      />

      <SummaryGrid items={section.accessItems} />

      <TagCluster
        title="Indexed in"
        items={section.indexedIn}
        icon={<Globe2 className="h-4 w-4" />}
      />

      <TagCluster
        title="Keywords"
        items={section.keywords}
        icon={<Tag className="h-4 w-4" />}
      />
    </DetailSectionCard>
  );
}

function SummaryGrid({ items }: { items: PaperDetailSummaryItem[] }) {
  return (
    <div className="grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="min-w-0 space-y-1"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            {item.label}
          </p>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden break-all text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              {item.value}
            </a>
          ) : (
            <p className="break-words text-sm font-medium text-slate-800">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TagCluster({
  icon,
  items,
  title,
}: {
  icon: ReactNode;
  items: string[];
  title: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
        {icon}
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <MetadataBadge key={item} tone="default" label={item} />
        ))}
      </div>
    </div>
  );
}

function EntityTagCluster({
  icon,
  items,
  title,
}: {
  icon: ReactNode;
  items: PaperDetailEntityRef[];
  title: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
        {icon}
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <EntityCanvasLink
            key={`${item.type}-${item.id}`}
            entityId={item.id}
            entityType={item.type}
            label={item.name}
            className="rounded-full transition hover:opacity-90"
          >
            <MetadataBadge tone="topic" label={item.name} />
          </EntityCanvasLink>
        ))}
      </div>
    </div>
  );
}
