import { useState, type ReactNode } from "react";

import {
  AlertCircle,
  Bookmark,
  BookOpenText,
  CalendarDays,
  ChartColumnBig,
  ExternalLink,
  FileText,
  Globe2,
  Landmark,
  ScrollText,
  Tag,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { routePaths } from "@/app/router";
import MetadataBadge from "@/layout/components/MetadataBadge";

import { usePaperDetailPageState } from "../hooks";
import type {
  PaperDetailAuthor,
  PaperDetailData,
  PaperDetailInstitution,
  PaperDetailMetric,
  PaperDetailQuickLink,
  PaperDetailSummaryItem,
} from "../types";

export default function PaperDetailPage() {
  const { errorMessage, isLoading, paperDetail } = usePaperDetailPageState();

  if (isLoading) {
    return <PaperDetailLoadingState />;
  }

  if (errorMessage || !paperDetail) {
    return <PaperDetailErrorState message={errorMessage} />;
  }

  return (
    <section className="space-y-6">
      <PaperDetailHeader paperDetail={paperDetail} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <InfoCard
            icon={<BookOpenText className="h-5 w-5" />}
            title="Paper Overview"
          >
            <p className="text-sm leading-7 text-slate-700">
              {paperDetail.abstractText}
            </p>
          </InfoCard>

          <InfoCard
            icon={<Users className="h-5 w-5" />}
            title="Authors & Institutions"
          >
            <AuthorList authors={paperDetail.authors} />
            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Institutions
              </h3>
              <InstitutionList institutions={paperDetail.institutions} />
            </div>
          </InfoCard>

          <InfoCard
            icon={<Landmark className="h-5 w-5" />}
            title="Source & Access"
          >
            <div className="space-y-2 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {paperDetail.sourceName}
              </p>
              <p>{paperDetail.sourceType}</p>
              {paperDetail.sourceHostOrganization ? (
                <p>{paperDetail.sourceHostOrganization}</p>
              ) : null}
            </div>
            <SummaryGrid items={paperDetail.accessItems} />
            <TagCluster
              title="Indexed in"
              items={paperDetail.indexedIn}
              icon={<Globe2 className="h-4 w-4" />}
            />
            <TagCluster
              title="Keywords"
              items={paperDetail.keywords}
              icon={<Tag className="h-4 w-4" />}
            />
          </InfoCard>
        </div>

        <div className="space-y-6">
          <InfoCard
            icon={<ChartColumnBig className="h-5 w-5" />}
            title="Impact Statistics"
          >
            <MetricGrid metrics={paperDetail.metrics} />
          </InfoCard>

          <InfoCard
            icon={<ExternalLink className="h-5 w-5" />}
            title="Quick Links"
          >
            <QuickLinksList links={paperDetail.quickLinks} />
          </InfoCard>
        </div>
      </div>
    </section>
  );
}

function PaperDetailHeader({ paperDetail }: { paperDetail: PaperDetailData }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const hasPdfUrl = Boolean(paperDetail.pdfUrl?.trim());

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {paperDetail.headerBadges.map((badge) => (
          <MetadataBadge
            key={badge.label}
            label={badge.label}
            tone={badge.tone}
          />
        ))}
      </div>

      <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950">
        {paperDetail.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
        {paperDetail.publishedLabel ? (
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {paperDetail.publishedLabel}
          </span>
        ) : null}

        {paperDetail.languageLabel ? (
          <span className="inline-flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-slate-400" />
            {paperDetail.languageLabel}
          </span>
        ) : null}

        {paperDetail.doiHref ? (
          <a
            href={paperDetail.doiHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
          >
            <ExternalLink className="h-4 w-4" />
            {paperDetail.doiLabel}
          </a>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setIsBookmarked((currentState) => !currentState)}
          className={[
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
            isBookmarked
              ? "border-emerald-700 bg-emerald-700 text-white"
              : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
          ].join(" ")}
        >
          <Bookmark className="h-4 w-4" />
          {isBookmarked ? "Saved" : "Bookmark"}
        </button>

        <Link
          to={routePaths.report()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          <FileText className="h-4 w-4" />
          Add to Report Page
        </Link>

        {hasPdfUrl ? (
          <a
            href={paperDetail.pdfUrl || undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#16A34A] bg-[#A3E635]/20 px-3 py-2 text-xs font-bold text-[#14532D] transition hover:bg-[#A3E635]/35"
          >
            <FileText className="h-4 w-4" />
            PDF
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-slate-400 bg-slate-100 px-3 py-2 text-xs font-bold text-black"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
        )}
      </div>
    </article>
  );
}

function InfoCard({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="mt-5 space-y-5">{children}</div>
    </article>
  );
}

function SummaryGrid({ items }: { items: PaperDetailSummaryItem[] }) {
  return (
    <div className="grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            {item.label}
          </p>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              {item.value}
            </a>
          ) : (
            <p className="text-sm font-medium text-slate-800">{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function AuthorList({ authors }: { authors: PaperDetailAuthor[] }) {
  if (authors.length === 0) {
    return <p className="text-sm text-slate-500">Author information is not available.</p>;
  }

  return (
    <div className="space-y-4">
      {authors.map((author) => (
        <div
          key={author.id}
          className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-700"
        >
          <span className="text-[1.02rem] font-semibold text-blue-700">
            {author.name}
          </span>
          {author.position ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {formatAuthorPosition(author.position)}
            </span>
          ) : null}
          {author.isCorresponding ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Corresponding
            </span>
          ) : null}
          {author.isFollowed ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Following
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function InstitutionList({
  institutions,
}: {
  institutions: PaperDetailInstitution[];
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {institutions.map((institution) => (
        <span
          key={institution.id}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
        >
          {institution.name}
          {institution.countryCode ? ` (${institution.countryCode})` : ""}
        </span>
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

function MetricGrid({ metrics }: { metrics: PaperDetailMetric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={[
            "rounded-2xl border p-4",
            metric.tone === "positive"
              ? "border-emerald-200 bg-emerald-50"
              : "border-slate-200 bg-slate-50",
          ].join(" ")}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            {metric.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
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
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <span className="font-semibold text-blue-700">{link.label}</span>
          <span className="inline-flex items-center gap-2 text-slate-500">
            {link.value}
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      ))}
    </div>
  );
}

function PaperDetailLoadingState() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3 text-slate-700">
        <ScrollText className="h-5 w-5" />
        <p className="text-lg font-semibold">Loading paper detail...</p>
      </div>
    </section>
  );
}

function PaperDetailErrorState({ message }: { message: string }) {
  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 shadow-sm">
      <div className="flex items-center gap-3 text-rose-700">
        <AlertCircle className="h-5 w-5" />
        <p className="text-lg font-semibold">Cannot load paper detail</p>
      </div>
      <p className="mt-3 text-sm text-rose-700">
        {message || "Something went wrong while loading this paper."}
      </p>
    </section>
  );
}

function formatAuthorPosition(position: string) {
  const normalizedPosition = position.trim().toLowerCase();

  if (normalizedPosition === "first") {
    return "First author";
  }

  if (normalizedPosition === "last") {
    return "Last author";
  }

  if (normalizedPosition === "middle") {
    return "Author";
  }

  return position;
}
