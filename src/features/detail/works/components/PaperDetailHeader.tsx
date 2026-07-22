import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { routePaths } from "@/app/router";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useWorkBookmark } from "@/features/bookmarks/hooks/useWorkBookmark";
import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import {
  buildNextDetailUrl,
  getDetailContextFromRouteParams,
  persistNextDetailNavigation,
  persistRootDetailNavigation,
} from "@/features/detail/detailTrail";
import {
  Bookmark,
  CalendarDays,
  ExternalLink,
  FileText,
  Globe2,
} from "lucide-react";
import MetadataBadge from "@/layout/global/MetadataBadge";
import { SafeActionDialog } from "@/layout/global/SafeActionDialog";
import WorkBookmarkCollectionDialog from "@/layout/global/WorkBookmarkCollectionDialog";

import type { PaperDetailData } from "../types";

type PaperDetailHeaderProps = {
  paperDetail: PaperDetailData;
};

export default function PaperDetailHeader(props: PaperDetailHeaderProps) {
  const { paperDetail } = props;
  const location = useLocation();
  const currentDetailContext = getDetailContextFromRouteParams(useParams());
  const { accessToken } = useAuthSession();
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showRemoveBookmarkDialog, setShowRemoveBookmarkDialog] = useState(false);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const hasPdfUrl = Boolean(paperDetail.pdfUrl?.trim());
  const collectionsQuery = useQuery({
    enabled: Boolean(accessToken) && showBookmarkDialog,
    queryFn: async () => {
      const response = await bookmarkApi.getCollections();
      return response.data;
    },
    queryKey: bookmarkQueryKeys.collections(),
    staleTime: 60_000,
  });
  const {
    bookmarkButtonLabel,
    handleBookmarkClick,
    isBookmarkActionPending,
    isSaved,
  } = useWorkBookmark({
    authors: paperDetail.authors.map((author) => author.name),
    authorOpenAlexIds: paperDetail.authors.map((author) => author.entityId),
    citations: paperDetail.citationCount,
    knownCollections: collectionsQuery.data ?? [],
    openAlexId: paperDetail.openAlexId,
    source: paperDetail.sourceName,
    title: paperDetail.title,
    topic: paperDetail.topics[0]?.name || "",
    topicOpenAlexId: paperDetail.topics[0]?.id ?? null,
    workType: paperDetail.workType,
    year: paperDetail.publicationYear,
  });
  const bookmarkClassName = isSaved
    ? "border border-[#14532D] bg-[#14532D] text-white hover:border-[#0f3d22] hover:bg-[#0f3d22] hover:text-white"
    : "border border-black bg-white text-black hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";

  async function handleBookmarkButtonClick() {
    if (isSaved) {
      setShowRemoveBookmarkDialog(true);
      return;
    }

    if (!accessToken) {
      void handleBookmarkClick();
      return;
    }

    setSelectedCollectionIds([]);
    setShowBookmarkDialog(true);
  }

  async function handleBookmarkConfirm() {
    const didSave = await handleBookmarkClick(selectedCollectionIds);

    if (didSave) {
      setShowBookmarkDialog(false);
      setSelectedCollectionIds([]);
    }
  }

  async function handleRemoveBookmarkConfirm() {
    const didRemove = await handleBookmarkClick();

    if (didRemove) {
      setShowRemoveBookmarkDialog(false);
    }
  }

  function toggleCollectionSelection(collectionId: string) {
    setSelectedCollectionIds((currentCollectionIds) =>
      currentCollectionIds.includes(collectionId)
        ? currentCollectionIds.filter((id) => id !== collectionId)
        : [...currentCollectionIds, collectionId],
    );
  }

  return (
    <>
    <article className="rounded-3xl border border-black bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {paperDetail.headerBadges.map((badge) => (
          badge.entityType === "topic" && badge.entityId ? (
            <Link
              key={`${badge.entityType}-${badge.entityId}`}
              onClick={() => {
                if (!badge.entityId) {
                  return;
                }

                if (currentDetailContext) {
                  persistNextDetailNavigation(
                    location.search,
                    currentDetailContext.entityType,
                    currentDetailContext.entityId,
                    "topics",
                    badge.entityId,
                  );
                  return;
                }

                persistRootDetailNavigation("topics", badge.entityId);
              }}
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
        <div className="relative">
          {showBookmarkDialog ? (
            <WorkBookmarkCollectionDialog
              collections={collectionsQuery.data}
              isError={collectionsQuery.isError}
              isLoading={collectionsQuery.isPending}
              isPending={isBookmarkActionPending}
              onCancel={() => {
                setShowBookmarkDialog(false);
                setSelectedCollectionIds([]);
              }}
              onConfirm={() => {
                void handleBookmarkConfirm();
              }}
              onToggleCollection={toggleCollectionSelection}
              panelClassName="absolute left-0 top-[calc(100%+0.75rem)]"
              selectedCollectionIds={selectedCollectionIds}
            />
          ) : null}

          <button
            type="button"
            disabled={isBookmarkActionPending}
            onClick={() => {
              void handleBookmarkButtonClick();
            }}
            title={isSaved ? "Remove bookmark" : "Save bookmark"}
            className={[
              "relative z-20 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
              bookmarkClassName,
            ].join(" ")}
          >
            <Bookmark className="h-4 w-4" />
            {bookmarkButtonLabel}
          </button>
        </div>

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

    <SafeActionDialog
      confirmLabel="Delete bookmark"
      description={
        <>
          <p>Remove "{paperDetail.title}" from your bookmark library?</p>
          <p>This action cannot be undone.</p>
        </>
      }
      eyebrow="Safe delete"
      isPending={isBookmarkActionPending}
      onClose={() => {
        if (!isBookmarkActionPending) {
          setShowRemoveBookmarkDialog(false);
        }
      }}
      onConfirm={handleRemoveBookmarkConfirm}
      open={showRemoveBookmarkDialog}
      pendingLabel="Deleting bookmark..."
      title="Delete this bookmark?"
      variant="danger"
    />
    </>
  );
}
