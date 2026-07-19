import { Check } from "lucide-react";

import type { BookmarkCollectionResponse } from "@/features/bookmarks/types/bookmark.types";

type WorkBookmarkCollectionDialogProps = {
  collections: BookmarkCollectionResponse[] | undefined;
  isError: boolean;
  isLoading: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onToggleCollection: (collectionId: string) => void;
  panelClassName?: string;
  selectedCollectionIds: string[];
};

export default function WorkBookmarkCollectionDialog(
  props: WorkBookmarkCollectionDialogProps,
) {
  const {
    collections,
    isError,
    isLoading,
    isPending,
    onCancel,
    onConfirm,
    onToggleCollection,
    panelClassName = "absolute bottom-[calc(100%+0.75rem)] left-0",
    selectedCollectionIds,
  } = props;

  return (
    <>
      <button
        type="button"
        aria-label="Close bookmark dialog"
        aria-disabled={isPending}
        className="fixed inset-0 z-10"
        onClick={() => {
          if (!isPending) {
            onCancel();
          }
        }}
      />

      <div
        className={[
          "z-20 w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-black bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)]",
          panelClassName,
        ].join(" ")}
      >
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#14532D]">
          Save bookmark
        </p>
        <p className="mt-1 text-sm font-medium leading-6 text-black/70">
          Choose one or more collections for this paper, or keep it in All
          library.
        </p>

        <div className="mt-3">
          <p className="block text-xs font-bold uppercase tracking-[0.18em] text-black">
            Collections
          </p>

          {collections && collections.length > 0 ? (
            <div className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-1">
              {collections.map((collection) => {
                const isSelected = selectedCollectionIds.includes(
                  collection.id,
                );

                return (
                  <button
                    key={collection.id}
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      onToggleCollection(collection.id);
                    }}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                      isSelected
                        ? "border-[#14532D] bg-[#EEF9EC]"
                        : "border-black/20 bg-white hover:border-black hover:bg-slate-50",
                      isPending ? "cursor-not-allowed opacity-60" : "",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-black">
                        {collection.name}
                      </p>
                      <p className="text-xs font-medium text-black/55">
                        {collection.workCount} works
                      </p>
                    </div>
                    <span
                      className={[
                        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition",
                        isSelected
                          ? "border-[#14532D] bg-[#14532D] text-white"
                          : "border-black/35 bg-white text-transparent",
                      ].join(" ")}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          ) : isLoading ? null : (
            <p className="mt-2 text-xs font-medium text-black/55">
              No collections yet. This paper will be saved to All library.
            </p>
          )}
        </div>

        {isLoading ? (
          <p className="mt-2 text-xs font-medium text-black/55">
            Loading collections...
          </p>
        ) : null}

        {isError ? (
          <p className="mt-2 text-xs font-medium text-red-600">
            Cannot load collections right now. You can still save to All
            library.
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="inline-flex items-center rounded-lg border border-black bg-white px-3 py-2 text-xs font-bold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="inline-flex items-center rounded-lg border border-[#14532D] bg-[#14532D] px-3 py-2 text-xs font-bold text-white transition hover:border-[#0f3d22] hover:bg-[#0f3d22] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
