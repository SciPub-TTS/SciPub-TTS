import { ExternalLink, FileText, Link2 } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router/routes";
import { formatCompactNumber } from "@/features/search/utils";
import MetadataBadge from "@/layout/components/MetadataBadge";

import { useOpenAlexEntityDetailPageState } from "../hooks/useOpenAlexEntityDetailPageState";
import type { EntityRef, SummaryItem, WorkItem } from "../view-model";
import OpenAlexEntityLink from "./OpenAlexEntityLink";

type SectionCardProps = {
  children: ReactNode;
  title: string;
};

type SummaryGridProps = {
  items: SummaryItem[];
};

type StatsGridProps = {
  items: SummaryItem[];
};

type StaticTagListProps = {
  items: string[];
  tone: "default" | "topic";
};

type EntityTagListProps = {
  items: EntityRef[];
  tone: "default" | "topic";
};

type EntityListProps = {
  items: EntityRef[];
};

type WorkListProps = {
  items: WorkItem[];
};

type QuickLinksListProps = {
  items: SummaryItem[];
};

export default function OpenAlexEntityDetailPage() {
  const {
    allowFollow,
    entityDetailState,
    errorMessage,
    isFollowed,
    isLoading,
    toggleFollow,
    typeLabel,
  } = useOpenAlexEntityDetailPageState();

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageStateCard
          title="Loading entity"
          message="Loading entity data..."
          tone="default"
        />
      </section>
    );
  }

  if (errorMessage || !entityDetailState) {
    return (
      <section className="space-y-6">
        <PageStateCard
          title="Entity unavailable"
          message={errorMessage || "Unable to load entity details."}
          tone="error"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {typeLabel}
        </div>

        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          {entityDetailState.title}
        </h1>

        {entityDetailState.openAlexId ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            OpenAlex {entityDetailState.openAlexId}
          </p>
        ) : null}

        {entityDetailState.description ? (
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-700">
            {entityDetailState.description}
          </p>
        ) : null}

        {allowFollow ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={toggleFollow}
              className={[
                "inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition",
                isFollowed
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              {isFollowed ? "Following" : `+ Follow ${typeLabel}`}
            </button>
          </div>
        ) : null}
      </article>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {entityDetailState.overviewItems.length > 0 ? (
            <SectionCard title="Overview">
              <SummaryGrid items={entityDetailState.overviewItems} />
            </SectionCard>
          ) : null}

          {entityDetailState.activityItems.length > 0 ? (
            <SectionCard title="Publication Activity">
              <SummaryGrid items={entityDetailState.activityItems} />
            </SectionCard>
          ) : null}

          {entityDetailState.topics.length > 0 ? (
            <SectionCard title="Topics">
              <EntityTagList items={entityDetailState.topics} tone="topic" />
            </SectionCard>
          ) : null}

          {entityDetailState.relatedEntities.length > 0 ? (
            <SectionCard title={entityDetailState.relatedEntitiesTitle}>
              <EntityList items={entityDetailState.relatedEntities} />
            </SectionCard>
          ) : null}

          {entityDetailState.topWorks.length > 0 ? (
            <SectionCard title="Top Works">
              <WorkList items={entityDetailState.topWorks} />
            </SectionCard>
          ) : null}
        </div>

        <div className="space-y-6 xl:col-span-1">
          {entityDetailState.keyStats.length > 0 ? (
            <SectionCard title="Key Statistics">
              <StatsGrid items={entityDetailState.keyStats} />
            </SectionCard>
          ) : null}

          {entityDetailState.fields.length > 0 ? (
            <SectionCard title="Main Fields">
              <StaticTagList items={entityDetailState.fields} tone="default" />
            </SectionCard>
          ) : null}

          {entityDetailState.institutions.length > 0 ? (
            <SectionCard title="Institutions">
              <EntityList items={entityDetailState.institutions} />
            </SectionCard>
          ) : null}

          {entityDetailState.quickLinks.length > 0 ? (
            <SectionCard title="Metadata & Quick Links">
              <QuickLinksList items={entityDetailState.quickLinks} />
            </SectionCard>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function PageStateCard(props: {
  title: string;
  message: string;
  tone: "default" | "error";
}) {
  const { message, title, tone } = props;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      <p
        className={[
          "mt-3 text-sm font-semibold",
          tone === "error" ? "text-rose-600" : "text-slate-500",
        ].join(" ")}
      >
        {message}
      </p>
    </article>
  );
}

function SectionCard(props: SectionCardProps) {
  const { children, title } = props;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 space-y-4">{children}</div>
    </article>
  );
}

function SummaryGrid(props: SummaryGridProps) {
  const { items } = props;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="flex items-center justify-between gap-4 text-sm"
        >
          <span className="font-semibold text-slate-600">{item.label}</span>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
            >
              {item.value}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-right font-semibold text-slate-900">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function StatsGrid(props: StatsGridProps) {
  const { items } = props;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {item.label}
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function StaticTagList(props: StaticTagListProps) {
  const { items, tone } = props;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <MetadataBadge key={item} tone={tone} label={item} />
      ))}
    </div>
  );
}

function EntityTagList(props: EntityTagListProps) {
  const { items, tone } = props;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <OpenAlexEntityLink
          key={`${item.type}-${item.id}`}
          entityId={item.id}
          entityType={item.type}
          label={item.label}
          className="rounded-full transition hover:opacity-90"
        >
          <MetadataBadge tone={tone} label={item.label} />
        </OpenAlexEntityLink>
      ))}
    </div>
  );
}

function EntityList(props: EntityListProps) {
  const { items } = props;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <OpenAlexEntityLink
          key={`${item.type}-${item.id}`}
          entityId={item.id}
          entityType={item.type}
          label={item.label}
          className="flex items-center gap-2 text-left text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <Link2 className="h-4 w-4" />
          {item.label}
        </OpenAlexEntityLink>
      ))}
    </div>
  );
}

function WorkList(props: WorkListProps) {
  const { items } = props;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <Link
            to={routePaths.paperDetail(item.id)}
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            {item.title}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            {item.year ? <span>{item.year}</span> : null}
            {item.source ? <span>{item.source}</span> : null}
            {item.citations !== null && item.citations !== undefined ? (
              <span>{formatCompactNumber(item.citations)} citations</span>
            ) : null}
            {item.pdfUrl ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                <FileText className="h-3.5 w-3.5" />
                PDF
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickLinksList(props: QuickLinksListProps) {
  const { items } = props;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <span className="font-semibold text-slate-700">{item.label}</span>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
            >
              {item.value}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="font-semibold text-slate-500">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
