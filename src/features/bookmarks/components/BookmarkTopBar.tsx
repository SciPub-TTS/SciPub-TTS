import {
  FolderPlus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import type { BookmarkCollectionResponse } from "@/features/bookmarks/types/bookmark.types";

interface BookmarkTopBarProps {
  collections: BookmarkCollectionResponse[];
  error: string | null;
  onCollectionChange: (collectionId: string | null) => void;
  onCreateCollectionClick: () => void;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onSearchSubmit: () => void;
  searchValue: string;
  selectedCollectionId: string | null;
  totalElements: number;
  totalShowing: number;
}

export function BookmarkTopBar({
  collections,
  error,
  onCollectionChange,
  onCreateCollectionClick,
  onSearchChange,
  onSearchClear,
  onSearchSubmit,
  searchValue,
  selectedCollectionId,
  totalElements,
  totalShowing,
}: BookmarkTopBarProps) {
  const selectedCollection = collections.find(
    (collection) => collection.id === selectedCollectionId,
  );

  return (
    <div className="mb-6 rounded-[2rem] border border-black bg-[radial-gradient(circle_at_top_left,_rgba(243,112,33,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(0,174,239,0.16),_transparent_36%),white] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
          Bookmark - Workspace
        </p>
        <h2 className="font-search-title mt-3 text-4xl font-normal leading-[1.15] tracking-normal text-[#14532D] md:text-5xl">
          Search titles, build collections, and browse your saved works
          faster.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70 md:text-[15px]">
          Organize saved papers and jump between collections quickly.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 xl:flex-row">
        <form
          className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.5rem] border border-black bg-white px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.05)]"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
          <Search className="h-5 w-5 shrink-0 text-[#F37021]" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search bookmarked works by title..."
            className="min-w-0 flex-1 bg-transparent text-[15px] text-black placeholder:text-black/40 focus:outline-none"
          />
          {searchValue ? (
            <button
              type="button"
              onClick={onSearchClear}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black bg-white text-black transition hover:bg-black hover:text-white"
              title="Clear title search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-black bg-[#14532D] px-4 text-sm font-semibold text-white transition hover:bg-[#0f3d22]"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        <div className="flex flex-col gap-3 sm:flex-row xl:w-auto">
          <button
            type="button"
            onClick={onCreateCollectionClick}
            className="inline-flex h-[62px] items-center justify-center gap-2 rounded-[1.5rem] border border-black bg-[#F37021] px-5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(243,112,33,0.2)] transition hover:bg-[#d95e14]"
          >
            <FolderPlus className="h-5 w-5" />
            Create collection
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-subtext text-xs font-semibold uppercase tracking-[0.22em] text-black/55">
            Collections
          </p>
          <p className="font-subtext text-sm text-black/60">
            Showing <span className="font-semibold text-[#F37021]">{totalShowing}</span>{" "}
            of <span className="font-semibold text-[#00AEEF]">{totalElements}</span>{" "}
            works
            {selectedCollection ? ` in ${selectedCollection.name}` : ""}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => onCollectionChange(null)}
            className={[
              "inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
              selectedCollectionId === null
                ? "border-black bg-black text-white"
                : "border-black bg-white text-black hover:bg-black hover:text-white",
            ].join(" ")}
          >
            All library
          </button>

          {collections.map((collection) => {
            const isActive = collection.id === selectedCollectionId;

            return (
              <button
                key={collection.id}
                type="button"
                onClick={() => onCollectionChange(isActive ? null : collection.id)}
                className={[
                  "inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "border-black bg-[#E8F8FF] text-[#0369A1]"
                    : "border-black bg-white text-black hover:bg-[#FFF1E8]",
                ].join(" ")}
              >
                <Sparkles className="h-4 w-4" />
                <span>{collection.name}</span>
                <span className="rounded-full border border-black/15 bg-white px-2 py-0.5 text-xs text-black/70">
                  {collection.workCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3">
          <p className="font-subtext text-sm font-medium text-red-700">{error}</p>
        </div>
      ) : null}
    </div>
  );
}
