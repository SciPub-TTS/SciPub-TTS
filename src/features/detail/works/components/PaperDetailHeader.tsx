import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { routePaths } from "@/app/router";
import {
  buildNextDetailUrl,
  getDetailContextFromRouteParams,
} from "@/features/detail/detailTrail";
import {
  Bookmark,
  CalendarDays,
  ExternalLink,
  FileText,
  Globe2,
} from "lucide-react";
import MetadataBadge from "@/layout/components/MetadataBadge";

import type { PaperDetailData } from "../types";

type PaperDetailHeaderProps = {
  paperDetail: PaperDetailData;
};

export default function PaperDetailHeader(props: PaperDetailHeaderProps) {
  const { paperDetail } = props;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const location = useLocation();
  const currentDetailContext = getDetailContextFromRouteParams(useParams());
  const hasPdfUrl = Boolean(paperDetail.pdfUrl?.trim());

  return (
    <article className="rounded-3xl border border-black bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {paperDetail.headerBadges.map((badge) => (
          badge.entityType === "topic" && badge.entityId ? (
            <Link
              key={`${badge.entityType}-${badge.entityId}`}
              to={
                currentDetailContext
                  ? buildNextDetailUrl(
                      location.search,
                      currentDetailContext.entityType,
                      currentDetailContext.entityId,
                      "topics",
                      badge.entityId,
                    )
                  : routePaths.topicDetail(badge.entityId)
              }
              className="transition hover:-translate-y-0.5"
            >
              <MetadataBadge
                label={badge.label}
                tone={badge.tone}
              />
            </Link>
          ) : (
            <MetadataBadge
              key={badge.entityId ? `${badge.entityType}-${badge.entityId}` : badge.label}
              label={badge.label}
              tone={badge.tone}
            />
          )
        ))}
      </div>

      <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950">
        {paperDetail.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
        {paperDetail.publishedLabel ? (
          <span className="inline-flex items-center gap-2 text-black">
            <CalendarDays className="h-5 w-5 text-black" />
            {paperDetail.publishedLabel}
          </span>
        ) : null}

        {paperDetail.languageLabel ? (
          <span className="inline-flex items-center gap-2 text-black">
            <Globe2 className="h-5 w-5 text-black" />
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
              ? "border-black bg-black text-white"
              : "border-black bg-white text-slate-800 hover:bg-slate-50",
          ].join(" ")}
        >
          <Bookmark className="h-4 w-4" />
          {isBookmarked ? "Saved" : "Bookmark"}
        </button>

        {hasPdfUrl ? (
          <a
            href={paperDetail.pdfUrl || undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#000000] bg-[#ffffff] px-4 py-2.5 text-sm font-semibold text-[#2ca31f] transition hover:bg-[#a3f8a0] hover:text-black"
          >
            <FileText className="h-4 w-4" />
            PDF
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl border border-slate-400 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-black"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
        )}
      </div>
    </article>
  );
}
