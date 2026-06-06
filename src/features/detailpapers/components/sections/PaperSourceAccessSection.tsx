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

type PaperSourceAccessSectionProps = {
  section: PaperSourceAccessSectionData;
};

type SummaryGridProps = {
  items: PaperDetailSummaryItem[];
};

type TagClusterProps = {
  icon: ReactNode;
  items: string[];
  title: string;
};

type EntityTagClusterProps = {
  icon: ReactNode;
  items: PaperDetailEntityRef[];
  title: string;
};

export default function PaperSourceAccessSection(
  props: PaperSourceAccessSectionProps,
) {
  const { section } = props;

  return (
    <DetailSectionCard
      icon={<Landmark className="h-5 w-5" />}
      title="Source & Access"
    >
      <div className="space-y-2 text-sm font-semibold text-[#9a6700]">
        {section.source ? (
          <EntityCanvasLink
            entityId={section.source.id}
            entityType={section.source.type}
            label={section.source.name}
            className="text-left text-base font-bold text-black transition hover:text-blue-700 hover:underline hover:decoration-blue-700 hover:underline-offset-4"
          >
            {section.source.name}
          </EntityCanvasLink>
        ) : (
          <p className="font-bold text-black">{section.sourceName}</p>
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

function SummaryGrid(props: SummaryGridProps) {
  const { items } = props;

  return (
    <div className="grid gap-4 border-t border-black pt-5 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="min-w-0 space-y-1"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
            {item.label}
          </p>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden break-all text-sm font-semibold text-[#9a6700] transition hover:text-blue-700 hover:underline hover:decoration-blue-700 hover:underline-offset-4"
            >
              {item.value}
            </a>
          ) : (
            <p className="break-words text-sm font-semibold text-[#9a6700]">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TagCluster(props: TagClusterProps) {
  const { icon, items, title } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-black pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-black">
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

function EntityTagCluster(props: EntityTagClusterProps) {
  const { icon, items, title } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-black pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-black">
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
