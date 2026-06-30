import {
  CalendarDays,
  Check,
  Eye,
  FolderTree,
  MoreHorizontal,
  Quote,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import type {
  BookmarkCollectionResponse,
  BookmarkResponse,
} from "@/features/bookmarks/types/bookmark.types";
import {
  formatAuthors,
  formatCitationCount,
  formatSavedAt,
} from "@/features/bookmarks/utils/bookmark.utils";
import { buildDetailTrailUrl } from "@/features/detail/detailTrail";

interface BookmarkCardProps {
  availableCollections: BookmarkCollectionResponse[];
  bookmark: BookmarkResponse;
  isCollectionMutating: boolean;
  onAddToCollection: (bookmarkId: string, collectionId: string) => Promise<void>;
  onDelete: (id: string) => void;
  onRemoveFromCollection: (
    bookmarkId: string,
    collectionId: string,
  ) => Promise<void>;
  selectedCollectionId: string | null;
}

const TOPIC_COLORS: Record<string, string> = {
  "Artificial Intelligence": "bg-[#FFF1E8] text-[#F37021]",
  "Machine Learning": "bg-[#FFF1E8] text-[#F37021]",
  Medicine: "bg-[#EEF9EC] text-[#7AC143]",
  Environmental: "bg-[#EEF9EC] text-[#7AC143]",
  Education: "bg-[#E8F8FF] text-[#00AEEF]",
  Economics: "bg-[#FFF6E8] text-[#8B5E34]",
  Engineering: "bg-[#FFF1E8] text-[#F37021]",
  Physics: "bg-[#E8F8FF] text-[#00AEEF]",
  Biology: "bg-[#EEF9EC] text-[#7AC143]",
};

function getTopicColor(topic: string): string {
  return TOPIC_COLORS[topic] ?? "bg-[#FFF6E8] text-[#8B5E34]";
}

function getWorkTypeLabel(workType: string | null | undefined) {
  const normalizedWorkType = workType?.trim();
  return normalizedWorkType && normalizedWorkType.length > 0
    ? normalizedWorkType
    : "Work";
}

async function copyText(value: string) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(value);
  }
}

export function BookmarkCard({
  availableCollections,
  bookmark,
  isCollectionMutating,
  onAddToCollection,
  onDelete,
  onRemoveFromCollection,
  selectedCollectionId,
}: BookmarkCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [pendingCollectionId, setPendingCollectionId] = useState<string | null>(
    null,
  );
  const [shareLabel, setShareLabel] = useState("Share");
  const shareResetTimer = useRef<number | null>(null);
  const detailPath = useMemo(
    () => buildDetailTrailUrl("works", bookmark.openAlexId, [], "bookmarks"),
    [bookmark.openAlexId],
  );

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && shareResetTimer.current !== null) {
        window.clearTimeout(shareResetTimer.current);
      }
    },
    [],
  );

  async function handleShare() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      await copyText(new URL(detailPath, window.location.origin).toString());
      setShareLabel("Copied");
    } catch {
      setShareLabel("Copy failed");
    }

    if (shareResetTimer.current !== null) {
      window.clearTimeout(shareResetTimer.current);
    }

    shareResetTimer.current = window.setTimeout(() => {
      setShareLabel("Share");
      shareResetTimer.current = null;
    }, 2400);
  }

  async function handleCollectionToggle(
    collectionId: string,
    isMember: boolean,
  ) {
    setPendingCollectionId(collectionId);

    try {
      if (isMember) {
        await onRemoveFromCollection(bookmark.id, collectionId);
      } else {
        await onAddToCollection(bookmark.id, collectionId);
      }
    } finally {
      setPendingCollectionId(null);
    }
  }

  return (
    <div className="group relative flex h-full flex-col gap-4 rounded-[1.8rem] border border-black bg-[radial-gradient(circle_at_top_left,_rgba(243,112,33,0.08),_transparent_34%),white] p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.08)]">
      {(showMenu || showCollectionMenu) && (
        <button
          type="button"
          aria-label="Close card menus"
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowMenu(false);
            setShowCollectionMenu(false);
          }}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8B5E34]">
            {getWorkTypeLabel(bookmark.workType)}
          </span>

          {bookmark.topic || bookmark.collections.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {bookmark.topic ? (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${getTopicColor(
                    bookmark.topic,
                  )}`}
                >
                  {bookmark.topic}
                </span>
              ) : null}

              {bookmark.collections.map((collection) => {
                const isActiveCollection = collection.id === selectedCollectionId;

                return (
                  <span
                    key={collection.id}
                    className={[
                      "inline-flex items-center rounded-md border border-black bg-black px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_12px_24px_rgba(0,0,0,0.22)]",
                      isActiveCollection
                        ? "ring-2 ring-[#F37021]/30"
                        : "",
                    ].join(" ")}
                  >
                    {collection.name}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onDelete(bookmark.id)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black bg-white text-[#14532D] transition hover:border-red-500 hover:text-red-500"
          title="Remove bookmark"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      <h3 className="font-title line-clamp-3 text-[1.28rem] font-bold leading-snug text-black">
        {bookmark.title}
      </h3>

      <p className="font-subtext text-[15px] font-semibold leading-7 text-[#6F4B2A]">
        {formatAuthors(bookmark.authors, 82)}
      </p>

      <div className="font-subtext flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-semibold text-black">
        {bookmark.publicationYear ? (
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-[17px] w-[17px] text-[#F37021]" />
            {bookmark.publicationYear}
          </span>
        ) : null}

        {bookmark.authors ? (
          <span className="inline-flex items-center gap-2 text-black/75">
            <Users className="h-[17px] w-[17px] text-[#00AEEF]" />
            {bookmark.authors.split(",").filter(Boolean).length || 1} authors
          </span>
        ) : null}

        {bookmark.citationCount != null ? (
          <span className="inline-flex items-center gap-2 text-black/85">
            <Quote className="h-[17px] w-[17px] text-[#7AC143]" />
            {formatCitationCount(bookmark.citationCount)} citations
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-3">
        <span className="font-subtext shrink-0 whitespace-nowrap text-[13px] font-semibold text-black/65">
          {formatSavedAt(bookmark.createdAt)}
        </span>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link
            to={detailPath}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-black bg-white px-3.5 text-[13px] font-semibold text-black transition hover:bg-black hover:text-white"
            title="View detail"
          >
            <Eye className="h-4 w-4" />
            View Detail
          </Link>

          <button
            type="button"
            onClick={() => {
              void handleShare();
            }}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-black bg-white px-3.5 text-[13px] font-semibold text-black transition hover:bg-black hover:text-white"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
            {shareLabel}
          </button>

          <div className="relative z-20">
            <button
              type="button"
              onClick={() => {
                setShowCollectionMenu((value) => !value);
                setShowMenu(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black bg-white text-black transition hover:bg-black hover:text-white"
              title="Manage collections"
            >
              <FolderTree className="h-4.5 w-4.5" />
            </button>

            {showCollectionMenu ? (
              <div className="absolute bottom-12 right-0 z-30 w-72 rounded-[1.4rem] border border-black bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                <div className="mb-2">
                  <p className="font-subtext text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00AEEF]">
                    Collections
                  </p>
                  <p className="font-subtext mt-1 text-sm text-black/65">
                    Add or remove this work from your saved collections.
                  </p>
                </div>

                {availableCollections.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black/30 bg-[#FFF6E8] px-4 py-3">
                    <p className="font-subtext text-sm text-[#8B5E34]">
                      Create your first collection from the toolbar above, then
                      come back here to sort this work.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableCollections.map((collection) => {
                      const isMember = bookmark.collections.some(
                        (item) => item.id === collection.id,
                      );
                      const isPending =
                        pendingCollectionId === collection.id ||
                        isCollectionMutating;

                      return (
                        <button
                          key={collection.id}
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            void handleCollectionToggle(collection.id, isMember);
                          }}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition",
                            isMember
                              ? "border-black bg-[#EEF9EC]"
                              : "border-black/20 bg-white hover:border-black hover:bg-[#E8F8FF]",
                            isPending ? "cursor-not-allowed opacity-60" : "",
                          ].join(" ")}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-black">
                              {collection.name}
                            </p>
                            <p className="font-subtext text-xs text-black/55">
                              {collection.workCount} works
                            </p>
                          </div>
                          <span
                            className={[
                              "inline-flex h-7 w-7 items-center justify-center rounded-full border",
                              isMember
                                ? "border-[#14532D] bg-[#14532D] text-white"
                                : "border-black/20 bg-white text-black/35",
                            ].join(" ")}
                          >
                            <Check className="h-4 w-4" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="relative z-20">
            <button
              type="button"
              onClick={() => {
                setShowMenu((value) => !value);
                setShowCollectionMenu(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black bg-white text-black transition hover:bg-black hover:text-white"
              title="More actions"
            >
              <MoreHorizontal className="h-4.5 w-4.5" />
            </button>

            {showMenu ? (
              <div className="absolute bottom-12 right-0 z-30 w-44 rounded-[1.4rem] border border-black bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(bookmark.id);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
