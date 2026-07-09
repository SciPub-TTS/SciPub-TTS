import {
  CalendarDays,
  Check,
  Eye,
  FolderTree,
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
import {
  buildDetailTrailUrl,
  persistRootDetailNavigation,
} from "@/features/detail/detailTrail";

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
}: BookmarkCardProps) {
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [draftCollectionIds, setDraftCollectionIds] = useState<string[]>([]);
  const [isSavingCollections, setIsSavingCollections] = useState(false);
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

  useEffect(() => {
    if (!showCollectionMenu) {
      return;
    }

    setDraftCollectionIds(bookmark.collections.map((collection) => collection.id));
  }, [bookmark.collections, showCollectionMenu]);

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

  function handleCollectionToggle(collectionId: string) {
    setDraftCollectionIds((currentCollectionIds) =>
      currentCollectionIds.includes(collectionId)
        ? currentCollectionIds.filter((id) => id !== collectionId)
        : [...currentCollectionIds, collectionId],
    );
  }

  async function handleSaveCollectionChanges() {
    const initialCollectionIds = bookmark.collections.map((collection) => collection.id);
    const collectionIdsToAdd = draftCollectionIds.filter(
      (collectionId) => !initialCollectionIds.includes(collectionId),
    );
    const collectionIdsToRemove = initialCollectionIds.filter(
      (collectionId) => !draftCollectionIds.includes(collectionId),
    );

    if (collectionIdsToAdd.length === 0 && collectionIdsToRemove.length === 0) {
      setShowCollectionMenu(false);
      return;
    }

    setIsSavingCollections(true);

    try {
      await Promise.all([
        ...collectionIdsToAdd.map((collectionId) =>
          onAddToCollection(bookmark.id, collectionId),
        ),
        ...collectionIdsToRemove.map((collectionId) =>
          onRemoveFromCollection(bookmark.id, collectionId),
        ),
      ]);
      setShowCollectionMenu(false);
    } finally {
      setIsSavingCollections(false);
    }
  }

  const initialCollectionIds = bookmark.collections.map((collection) => collection.id);
  const hasPendingCollectionChanges =
    draftCollectionIds.length !== initialCollectionIds.length ||
    draftCollectionIds.some((collectionId) => !initialCollectionIds.includes(collectionId));
  const isCollectionActionPending = isSavingCollections || isCollectionMutating;

  return (
    <div
      className={[
        "group relative isolate flex h-full flex-col gap-4 rounded-[1.8rem] border border-black bg-[radial-gradient(circle_at_top_left,_rgba(243,112,33,0.08),_transparent_34%),white] p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.08)]",
        showCollectionMenu ? "z-50" : "z-0",
      ].join(" ")}
    >
      {showCollectionMenu && (
        <button
          type="button"
          aria-label="Close card menus"
          className="fixed inset-0 z-10"
          onClick={() => {
            if (isCollectionActionPending) {
              return;
            }

            setShowCollectionMenu(false);
          }}
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8B5E34]">
            {getWorkTypeLabel(bookmark.workType)}
          </span>
          <span className="font-subtext shrink-0 whitespace-nowrap pt-1 text-[13px] font-semibold text-black/65">
            {formatSavedAt(bookmark.createdAt)}
          </span>
        </div>

        {bookmark.topic ? (
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <span
              className={`inline-flex max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${getTopicColor(
                bookmark.topic,
              )}`}
              title={bookmark.topic}
            >
              {bookmark.topic}
            </span>
          </div>
        ) : null}

        {bookmark.collections.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {bookmark.collections.map((collection) => {
              return (
                <span
                  key={collection.id}
                  className="inline-flex max-w-full items-center break-words rounded-md border border-black bg-black px-3 py-1.5 text-[11px] font-semibold text-white"
                  title={collection.name}
                >
                  {collection.name}
                </span>
              );
            })}
          </div>
        ) : null}
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

      <div className="mt-auto border-t border-black pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] items-center gap-2">
          <Link
            to={detailPath}
            onClick={() => {
              persistRootDetailNavigation("works", bookmark.openAlexId, "bookmarks");
            }}
            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-black bg-white px-3.5 text-[13px] font-semibold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
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
            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-black bg-white px-3.5 text-[13px] font-semibold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
            {shareLabel}
          </button>

          <div className={["relative shrink-0", showCollectionMenu ? "z-40" : "z-10"].join(" ")}>
            <button
              type="button"
              onClick={() => {
                setShowCollectionMenu((value) => {
                  const nextValue = !value;

                  if (nextValue) {
                    setDraftCollectionIds(
                      bookmark.collections.map((collection) => collection.id),
                    );
                  }

                  return nextValue;
                });
              }}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black bg-white text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
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
                      const isSelected = draftCollectionIds.includes(collection.id);

                      return (
                        <button
                          key={collection.id}
                          type="button"
                          disabled={isCollectionActionPending}
                          onClick={() => {
                            handleCollectionToggle(collection.id);
                          }}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition",
                            isSelected
                              ? "border-black bg-[#EEF9EC]"
                              : "border-black/20 bg-white hover:border-black hover:bg-[#E8F8FF]",
                            isCollectionActionPending ? "cursor-not-allowed opacity-60" : "",
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
                              isSelected
                                ? "border-[#14532D] bg-[#14532D] text-white"
                                : "border-black/20 bg-white text-black/35",
                            ].join(" ")}
                          >
                            <Check className="h-4 w-4" />
                          </span>
                        </button>
                      );
                    })}

                    <div className="flex items-center justify-end gap-2 border-t border-black/10 pt-3">
                      <button
                        type="button"
                        disabled={isCollectionActionPending}
                        onClick={() => {
                          setDraftCollectionIds(
                            bookmark.collections.map((collection) => collection.id),
                          );
                          setShowCollectionMenu(false);
                        }}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-black/20 bg-white px-4 text-sm font-semibold text-black transition hover:border-black hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={!hasPendingCollectionChanges || isCollectionActionPending}
                        onClick={() => {
                          void handleSaveCollectionChanges();
                        }}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-[#14532D] bg-[#14532D] px-4 text-sm font-semibold text-white transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
                      >
                        {isCollectionActionPending ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCollectionMenu(false);
              onDelete(bookmark.id);
            }}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black bg-white text-[#14532D] transition hover:border-red-500 hover:bg-red-500 hover:text-white"
            title="Remove bookmark"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
