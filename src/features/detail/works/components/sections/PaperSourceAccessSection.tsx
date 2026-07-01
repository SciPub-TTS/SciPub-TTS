import { Globe2, Landmark, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { routePaths } from "@/app/router";
import {
  buildNextDetailUrl,
  getDetailContextFromRouteParams,
} from "@/features/detail/detailTrail";
import MetadataBadge from "@/layout/global/MetadataBadge";

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
  emptyLabel?: string;
  icon?: ReactNode;
  items: string[];
  title: string;
};

type EntityTagClusterProps = {
  icon?: ReactNode;
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
      title="Source, Awards & Access"
    >
      <div className="space-y-2 text-sm font-semibold text-black">
        <p>
          <span className="font-bold text-[#9a6700]">Source:</span>{" "}
          {section.source?.name || section.sourceName}
        </p>
        <p>
          <span className="font-bold text-[#9a6700]">Source type:</span>{" "}
          {section.sourceType}
        </p>
        {section.sourceHostOrganization ? (
          <p>
            <span className="font-bold text-[#9a6700]">Host organization:</span>{" "}
            {section.sourceHostOrganization}
          </p>
        ) : null}
      </div>

      <EntityTagCluster
        title="Topics"
        items={section.topics}
        icon={<Tag className="h-4 w-4" />}
      />

      <SummaryGrid items={section.accessItems} />

      <TagCluster
        title="Awards"
        items={section.awards}
        icon={<Tag className="h-4 w-4" />}
        emptyLabel="Award information is not available."
      />

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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a6700]">
            {item.label}
          </p>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden break-all text-sm font-semibold text-black transition hover:text-blue-700 hover:underline hover:decoration-blue-700 hover:underline-offset-4"
            >
              {item.value}
            </a>
          ) : (
            <p className="break-words text-sm font-semibold text-black">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TagCluster(props: TagClusterProps) {
  const { emptyLabel, icon, items, title } = props;

  return (
    <div className="border-t border-black pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6700]">
        {icon}
        {title}
      </div>
      {items.length === 0 ? (
        emptyLabel ? (
          <p className="mt-3 text-sm font-semibold text-slate-500">
            {emptyLabel}
          </p>
        ) : null
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <MetadataBadge key={item} tone="default" label={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function EntityTagCluster(props: EntityTagClusterProps) {
  const { icon, items, title } = props;
  const location = useLocation();
  const currentDetailContext = getDetailContextFromRouteParams(useParams());

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-black pt-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6700]">
        {icon}
        {title}
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          item.type === "topic" ? (
            <Link
              key={`${item.type}-${item.id}`}
              to={
                currentDetailContext
                  ? buildNextDetailUrl(
                      location.search,
                      currentDetailContext.entityType,
                      currentDetailContext.entityId,
                      "topics",
                      item.id,
                    )
                  : routePaths.topicDetail(item.id)
              }
              className="block text-sm font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
            >
              {item.name}
            </Link>
          ) : (
            <span
              key={`${item.type}-${item.id}`}
              className="block text-sm font-semibold text-black"
            >
              {item.name}
            </span>
          )
        ))}
      </div>
    </div>
  );
}
