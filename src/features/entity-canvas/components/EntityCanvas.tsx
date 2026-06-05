import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Link2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router";
import { formatCompactNumber } from "@/features/search/utils";
import MetadataBadge from "@/layout/components/MetadataBadge";

import { getCanvasEntityTopWorks, getOpenAlexEntity } from "../services";
import type {
  EntityCanvasEntry,
  OpenAlexEntity,
} from "../types";
import { formatEntityTypeLabel, normalizeOpenAlexId } from "../utils";
import type {
  EntityRef,
  SummaryItem,
  WorkItem,
} from "../view-model";
import {
  buildEntityCanvasState,
  mapWorks,
} from "../view-model";
import EntityCanvasLink from "./EntityCanvasLink";

type EntityCanvasProps = {
  stack: EntityCanvasEntry[];
  onClose: () => void;
  onBack: () => void;
  onJumpTo: (index: number) => void;
  isFollowed: (entry: EntityCanvasEntry) => boolean;
  onToggleFollow: (entry: EntityCanvasEntry) => void;
};

export default function EntityCanvas({
  stack,
  onClose,
  onBack,
  onJumpTo,
  isFollowed,
  onToggleFollow,
}: EntityCanvasProps) {
  if (stack.length === 0) {
    return null;
  }

  const activeIndex = stack.length - 1;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close entity canvas"
        className="absolute inset-0 bg-slate-900/35"
        onClick={onClose}
      />

      <div className="absolute inset-0 overflow-hidden">
        {stack.map((entry, index) => {
          const isActive = index === activeIndex;
          const panelOffset = Math.min((activeIndex - index) * 56, 168);

          return (
            <aside
              key={`${entry.type}-${entry.id}-${index}`}
              className={[
                "absolute bottom-0 top-0 flex w-full max-w-[780px] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl transition-all duration-200 md:w-[50vw] md:min-w-[360px]",
                isActive ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
              style={{
                opacity: isActive ? 1 : 0.92,
                right: `${panelOffset}px`,
                zIndex: 80 + index,
              }}
            >
              <EntityCanvasPanel
                activeIndex={index}
                breadcrumbs={stack}
                entry={entry}
                canGoBack={index > 0}
                isActive={isActive}
                isFollowed={isFollowed}
                onBack={onBack}
                onClose={onClose}
                onJumpTo={onJumpTo}
                onToggleFollow={onToggleFollow}
              />
            </aside>
          );
        })}
      </div>
    </div>
  );
}

function EntityCanvasPanel({
  activeIndex,
  breadcrumbs,
  entry,
  canGoBack,
  isActive,
  isFollowed,
  onBack,
  onClose,
  onJumpTo,
  onToggleFollow,
}: {
  activeIndex: number;
  breadcrumbs: EntityCanvasEntry[];
  entry: EntityCanvasEntry;
  canGoBack: boolean;
  isActive: boolean;
  isFollowed: (entry: EntityCanvasEntry) => boolean;
  onBack: () => void;
  onClose: () => void;
  onJumpTo: (index: number) => void;
  onToggleFollow: (entry: EntityCanvasEntry) => void;
}) {
  const [entity, setEntity] = useState<OpenAlexEntity | null>(null);
  const [topWorks, setTopWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEntity() {
      setIsLoading(true);
      setErrorMessage("");
      setEntity(null);

      if (!entry.type) {
        setErrorMessage("Entity type is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getOpenAlexEntity(entry.type, entry.id);

        if (!mounted) {
          return;
        }

        setEntity(data);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setEntity(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Cannot load entity details right now.",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadEntity();

    return () => {
      mounted = false;
    };
  }, [entry.id, entry.type]);

  useEffect(() => {
    let mounted = true;

    async function loadTopWorks() {
      if (!entry.type) {
        setTopWorks([]);
        return;
      }

      try {
        const results = await getCanvasEntityTopWorks({
          entityId: entry.id,
          entityType: entry.type,
          perPage: 3,
          sort: "cited_by_count:desc",
        });

        if (!mounted) {
          return;
        }

        setTopWorks(mapWorks(results));
      } catch {
        if (!mounted) {
          return;
        }

        setTopWorks([]);
      }
    }

    void loadTopWorks();

    return () => {
      mounted = false;
    };
  }, [entry.id, entry.type]);

  const resolvedType = entry.type || "author";
  const typeLabel = formatEntityTypeLabel(resolvedType);
  const followActive = isFollowed(entry);
  const allowFollow = resolvedType === "author" || resolvedType === "topic";

  const canvasState = useMemo(() => {
    if (!entity) {
      return null;
    }

    return buildEntityCanvasState(entity, resolvedType, topWorks, entry.label);
  }, [entity, entry.label, resolvedType, topWorks]);

  const breadcrumbsToRender = breadcrumbs.slice(0, activeIndex + 1);

  if (isLoading) {
    return (
      <CanvasLoadingState
        activeIndex={activeIndex}
        breadcrumbs={breadcrumbsToRender}
        canGoBack={canGoBack}
        isActive={isActive}
        onBack={onBack}
        onClose={onClose}
        onJumpTo={onJumpTo}
      />
    );
  }

  if (!canvasState) {
    return (
      <CanvasErrorState
        activeIndex={activeIndex}
        breadcrumbs={breadcrumbsToRender}
        canGoBack={canGoBack}
        isActive={isActive}
        message={errorMessage || "Unable to load entity details."}
        onBack={onBack}
        onClose={onClose}
        onJumpTo={onJumpTo}
      />
    );
  }

  return (
    <>
      <CanvasHeader
        activeIndex={activeIndex}
        breadcrumbs={breadcrumbsToRender}
        canGoBack={canGoBack}
        isActive={isActive}
        onBack={onBack}
        onClose={onClose}
        onJumpTo={onJumpTo}
        openAlexId={canvasState.openAlexId}
        subtitle={typeLabel}
        title={canvasState.title}
      />

      <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
        <div className="space-y-6">
          {canvasState.description ? (
            <SectionCard title="Overview">
              <p className="text-sm leading-7 text-slate-700">
                {canvasState.description}
              </p>
            </SectionCard>
          ) : null}

          {canvasState.overviewItems.length > 0 ? (
            <SectionCard title="Overview">
              <SummaryGrid items={canvasState.overviewItems} />
            </SectionCard>
          ) : null}

          {canvasState.keyStats.length > 0 ? (
            <SectionCard title="Key Statistics">
              <StatsGrid items={canvasState.keyStats} />
            </SectionCard>
          ) : null}

          {canvasState.activityItems.length > 0 ? (
            <SectionCard title="Publication Activity">
              <SummaryGrid items={canvasState.activityItems} />
            </SectionCard>
          ) : null}

          {canvasState.topics.length > 0 ? (
            <SectionCard title="Topics">
              <EntityTagList items={canvasState.topics} tone="topic" />
            </SectionCard>
          ) : null}

          {canvasState.fields.length > 0 ? (
            <SectionCard title="Main Fields">
              <StaticTagList items={canvasState.fields} tone="default" />
            </SectionCard>
          ) : null}

          {canvasState.institutions.length > 0 ? (
            <SectionCard title="Institutions">
              <EntityList items={canvasState.institutions} />
            </SectionCard>
          ) : null}

          {canvasState.relatedEntities.length > 0 ? (
            <SectionCard title={canvasState.relatedEntitiesTitle}>
              <EntityList items={canvasState.relatedEntities} />
            </SectionCard>
          ) : null}

          {canvasState.topWorks.length > 0 ? (
            <SectionCard title="Top Works">
              <WorkList
                items={canvasState.topWorks}
                onNavigateToWork={onClose}
              />
            </SectionCard>
          ) : null}

          {canvasState.quickLinks.length > 0 ? (
            <SectionCard title="Metadata & Quick Links">
              <QuickLinksList items={canvasState.quickLinks} />
            </SectionCard>
          ) : null}
        </div>
      </div>

      {allowFollow && isActive ? (
        <CanvasFooter>
          <button
            type="button"
            onClick={() => onToggleFollow(entry)}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
              followActive
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
            ].join(" ")}
          >
            {followActive ? "Following" : `+ Follow ${typeLabel}`}
          </button>
        </CanvasFooter>
      ) : null}
    </>
  );
}

function CanvasHeader({
  activeIndex,
  breadcrumbs,
  canGoBack,
  isActive,
  onBack,
  onClose,
  onJumpTo,
  openAlexId,
  subtitle,
  title,
}: {
  activeIndex: number;
  breadcrumbs: EntityCanvasEntry[];
  canGoBack: boolean;
  isActive: boolean;
  onBack: () => void;
  onClose: () => void;
  onJumpTo: (index: number) => void;
  openAlexId: string;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            {canGoBack && isActive ? (
              <button
                type="button"
                onClick={onBack}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : null}

            <BreadcrumbTrail
              activeIndex={activeIndex}
              breadcrumbs={breadcrumbs}
              onJumpTo={onJumpTo}
            />
          </div>

          <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {subtitle}
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>

          {openAlexId ? (
            <p className="mt-1 text-xs font-semibold text-slate-400">
              OpenAlex - {openAlexId}
            </p>
          ) : null}
        </div>

        {isActive ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function BreadcrumbTrail({
  activeIndex,
  breadcrumbs,
  onJumpTo,
}: {
  activeIndex: number;
  breadcrumbs: EntityCanvasEntry[];
  onJumpTo: (index: number) => void;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-slate-500">
      {breadcrumbs.map((item, index) => {
        const label = item.label?.trim() || normalizeOpenAlexId(item.id);
        const isLast = index === activeIndex;

        return (
          <div
            key={`${item.type}-${item.id}-${index}`}
            className="inline-flex min-w-0 items-center"
          >
            {index > 0 ? <ChevronRight className="mx-1 h-3.5 w-3.5" /> : null}
            {isLast ? (
              <span className="truncate font-semibold text-slate-900">{label}</span>
            ) : (
              <button
                type="button"
                onClick={() => onJumpTo(index)}
                className="truncate transition hover:text-slate-700"
              >
                {label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CanvasFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4">
      {children}
    </div>
  );
}

function CanvasLoadingState({
  activeIndex,
  breadcrumbs,
  canGoBack,
  isActive,
  onBack,
  onClose,
  onJumpTo,
}: {
  activeIndex: number;
  breadcrumbs: EntityCanvasEntry[];
  canGoBack: boolean;
  isActive: boolean;
  onBack: () => void;
  onClose: () => void;
  onJumpTo: (index: number) => void;
}) {
  return (
    <>
      <CanvasHeader
        activeIndex={activeIndex}
        breadcrumbs={breadcrumbs}
        canGoBack={canGoBack}
        isActive={isActive}
        onBack={onBack}
        onClose={onClose}
        onJumpTo={onJumpTo}
        openAlexId=""
        subtitle="Entity"
        title="Loading"
      />
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <p className="text-sm font-semibold text-slate-500">
          Loading entity data...
        </p>
      </div>
    </>
  );
}

function CanvasErrorState({
  activeIndex,
  breadcrumbs,
  canGoBack,
  isActive,
  message,
  onBack,
  onClose,
  onJumpTo,
}: {
  activeIndex: number;
  breadcrumbs: EntityCanvasEntry[];
  canGoBack: boolean;
  isActive: boolean;
  message: string;
  onBack: () => void;
  onClose: () => void;
  onJumpTo: (index: number) => void;
}) {
  return (
    <>
      <CanvasHeader
        activeIndex={activeIndex}
        breadcrumbs={breadcrumbs}
        canGoBack={canGoBack}
        isActive={isActive}
        onBack={onBack}
        onClose={onClose}
        onJumpTo={onJumpTo}
        openAlexId=""
        subtitle="Error"
        title="Entity"
      />
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <p className="text-sm font-semibold text-rose-600">{message}</p>
      </div>
    </>
  );
}

function SectionCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 space-y-4">{children}</div>
    </article>
  );
}

function SummaryGrid({ items }: { items: SummaryItem[] }) {
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

function StatsGrid({ items }: { items: SummaryItem[] }) {
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

function StaticTagList({
  items,
  tone,
}: {
  items: string[];
  tone: "default" | "topic";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <MetadataBadge key={item} tone={tone} label={item} />
      ))}
    </div>
  );
}

function EntityTagList({
  items,
  tone,
}: {
  items: EntityRef[];
  tone: "default" | "topic";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <EntityCanvasLink
          key={`${item.type}-${item.id}`}
          entityId={item.id}
          entityType={item.type}
          label={item.label}
          className="rounded-full transition hover:opacity-90"
        >
          <MetadataBadge tone={tone} label={item.label} />
        </EntityCanvasLink>
      ))}
    </div>
  );
}

function EntityList({ items }: { items: EntityRef[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <EntityCanvasLink
          key={`${item.type}-${item.id}`}
          entityId={item.id}
          entityType={item.type}
          label={item.label}
          className="flex items-center gap-2 text-left text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <Link2 className="h-4 w-4" />
          {item.label}
        </EntityCanvasLink>
      ))}
    </div>
  );
}

function WorkList({
  items,
  onNavigateToWork,
}: {
  items: WorkItem[];
  onNavigateToWork: () => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <Link
            to={routePaths.paperDetail(item.id)}
            onClick={onNavigateToWork}
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

function QuickLinksList({ items }: { items: SummaryItem[] }) {
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
