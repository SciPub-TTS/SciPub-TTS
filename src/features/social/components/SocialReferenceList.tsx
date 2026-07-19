import { useState } from "react";
import { Link } from "react-router-dom";

import {
  buildDetailTrailUrl,
  persistRootDetailNavigation,
} from "@/features/detail/detailTrail";
import type { SocialPostReferenceInfo } from "@/features/social/types/social.types";

function formatReferenceMetadata(authors: string, year: number | null) {
  if (authors && year) {
    return `${authors} • ${year}`;
  }

  if (authors) {
    return authors;
  }

  if (year) {
    return String(year);
  }

  return "Bookmarked paper";
}

function normalizeReferenceEntityId(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  const segments = normalizedValue.split("/");

  return segments[segments.length - 1].toUpperCase();
}

function buildReferenceAuthorEntries(reference: SocialPostReferenceInfo) {
  const authorNames = reference.authorsSnapshot

    .split(",")

    .map((author) => author.trim())

    .filter((author) => author.length > 0);

  return authorNames.map((name, index) => ({
    id: normalizeReferenceEntityId(reference.authorOpenAlexIdsSnapshot[index]),

    name,
  }));
}

function buildSocialDetailHref(
  entityType: "authors" | "topics" | "works",

  entityId: string,
) {
  return buildDetailTrailUrl(entityType, entityId, "social-hub");
}

function SocialReferenceCard({
  reference,

  titleClassName,
}: {
  reference: SocialPostReferenceInfo;

  titleClassName: string;
}) {
  const [showAllAuthors, setShowAllAuthors] = useState(false);

  const authorEntries = buildReferenceAuthorEntries(reference);

  const hasAuthors = authorEntries.length > 0;

  const visibleAuthors = showAllAuthors
    ? authorEntries
    : authorEntries.slice(0, 3);

  const hasMoreAuthors = authorEntries.length > 3;

  const workTypeLabel = reference.workTypeSnapshot?.trim() || null;

  const topicLabel = reference.topicSnapshot?.trim() || null;

  const topicId = normalizeReferenceEntityId(reference.topicOpenAlexIdSnapshot);

  const workTitle = reference.titleSnapshot?.trim() || reference.openalexId;

  const hasMetadataBadges = Boolean(topicLabel || workTypeLabel);

  const topicBadgeClassName =
    "inline-flex items-center rounded-full border border-[#D6B37A] bg-[#FFF7ED] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A16207] transition hover:border-[#B45309] hover:text-[#92400E]";

  const typeBadgeClassName =
    "inline-flex items-center rounded-full border border-[#14532D]/35 bg-[#F0FDF4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#14532D]";

  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      {hasMetadataBadges ? (
        <div className="flex flex-wrap gap-2">
          {topicLabel ? (
            topicId ? (
              <Link
                to={buildSocialDetailHref("topics", topicId)}
                onClick={() => {
                  persistRootDetailNavigation("topics", topicId, "social-hub");
                }}
                className={topicBadgeClassName}
              >
                {topicLabel}
              </Link>
            ) : (
              <span className={topicBadgeClassName}>{topicLabel}</span>
            )
          ) : null}

          {workTypeLabel ? (
            <span className={typeBadgeClassName}>{workTypeLabel}</span>
          ) : null}
        </div>
      ) : null}

      <p className={`${hasMetadataBadges ? "mt-2" : ""} ${titleClassName}`}>
        <Link
          to={buildSocialDetailHref("works", reference.openalexId)}
          onClick={() => {
            persistRootDetailNavigation(
              "works",
              reference.openalexId,
              "social-hub",
            );
          }}
          className="transition hover:text-[#0EA5E9] hover:underline"
        >
          {workTitle}
        </Link>
      </p>

      <div className="font-subtext mt-1 flex flex-wrap items-baseline gap-x-1 gap-y-1 text-sm leading-5 text-[#A16207]">
        {hasAuthors
          ? visibleAuthors.map((author, index) => (
              <span key={`${reference.id}-author-${author.name}-${index}`}>
                {author.id ? (
                  (() => {
                    const authorId = author.id;

                    return (
                      <Link
                        to={buildSocialDetailHref("authors", authorId)}
                        onClick={() => {
                          persistRootDetailNavigation(
                            "authors",
                            authorId,
                            "social-hub",
                          );
                        }}
                        className="transition hover:text-[#92400E] hover:underline"
                      >
                        {author.name}
                      </Link>
                    );
                  })()
                ) : (
                  <span className="text-inherit">{author.name}</span>
                )}

                {index < visibleAuthors.length - 1 ? ", " : ""}
              </span>
            ))
          : null}
        {hasMoreAuthors ? (
          <button
            type="button"
            onClick={() => setShowAllAuthors((previous) => !previous)}
            className="ml-1 inline-flex items-center self-center whitespace-nowrap text-xs font-bold leading-none text-[#14532D] underline-offset-2 hover:text-[#15803D] hover:underline"
          >
            {showAllAuthors ? "Show less" : "Show more"}
          </button>
        ) : null}
        {hasAuthors && reference.yearSnapshot ? (
          <span aria-hidden="true">•</span>
        ) : null}
        {hasAuthors && reference.yearSnapshot ? (
          <span>{reference.yearSnapshot}</span>
        ) : null}
        {!hasAuthors ? (
          <span>
            {formatReferenceMetadata(
              reference.authorsSnapshot,

              reference.yearSnapshot,
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function SocialReferenceList({
  references,

  titleClassName,

  wrapperClassName,
}: {
  references: SocialPostReferenceInfo[];

  titleClassName: string;

  wrapperClassName: string;
}) {
  if (references.length === 0) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#005CB9]">
        Papers added
      </p>

      <div className="mt-3">
        {references.map((reference, index) => (
          <div key={reference.id}>
            <SocialReferenceCard
              reference={reference}
              titleClassName={titleClassName}
            />

            {index < references.length - 1 ? (
              <div className="mx-3 my-3 h-px bg-linear-to-r from-transparent via-[#D6B37A] to-transparent" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
