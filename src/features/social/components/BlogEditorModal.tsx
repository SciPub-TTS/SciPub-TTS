import { useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Search, X } from "lucide-react";

import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import {
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  TAG_PILL_CLASS,
} from "@/features/social/constants/socialHub.constants";
import type {
  BlogFormState,
  BlogModalMode,
} from "@/features/social/types/social.types";
import {
  normalizeSocialOpenAlexId,
  normalizeTopicLabel,
} from "@/features/social/utils/socialFormatters";

type BlogModalProps = {
  bookmarks: BookmarkResponse[];
  errorMessage: string | null;
  form: BlogFormState;
  isLoadingBookmarks: boolean;
  isSubmitting: boolean;
  mode: BlogModalMode;
  selectedTopics: string[];
  onChangeBody: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleBookmark: (openAlexId: string) => void;
};

export function BlogEditorModal(props: BlogModalProps) {
  const {
    bookmarks,
    errorMessage,

    form,

    isLoadingBookmarks,
    isSubmitting,
    mode,
    selectedTopics,
    onChangeBody,
    onChangeTitle,
    onClose,

    onSubmit,

    onToggleBookmark,
  } = props;

  const [bookmarkTitleQuery, setBookmarkTitleQuery] = useState("");
  const normalizedBookmarkTitleQuery = bookmarkTitleQuery.trim().toLowerCase();
  const filteredBookmarks = normalizedBookmarkTitleQuery
    ? bookmarks.filter((bookmark) =>
        bookmark.title.toLowerCase().includes(normalizedBookmarkTitleQuery),
      )
    : bookmarks;

  const modalTitle =
    mode === "edit" ? "Edit Research Blog" : "Create Research Blog";
  const submitLabel = mode === "edit" ? "Save changes" : "Publish";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[1.65rem] border border-black bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-black px-6 py-5">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#14532D]">
              Research community
            </p>

            <h2 className="font-title-page mt-2 text-[2rem] leading-none text-[#059669]">
              {modalTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#EEF6FF] hover:text-[#005CB9]"
            aria-label="Close social blog modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label className="mb-2 block text-sm font-extrabold uppercase tracking-[0.22em] text-[#14532D]">
                Blog title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={onChangeTitle}
                placeholder="e.g. What I learned re-reading the Transformer paper"
                className={`h-12 ${INPUT_CLASS}`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-extrabold uppercase tracking-[0.22em] text-[#14532D]">
                Write your insight{" "}
                <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                rows={5}
                value={form.body}
                onChange={onChangeBody}
                placeholder="Share your notes, takeaways, or open questions for the community..."
                className={`${INPUT_CLASS} resize-none py-4`}
              />
            </div>

            <div className="rounded-[1.2rem] border border-black bg-slate-50/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="mt-2 text-[1.05rem] font-semibold text-black">
                    Add papers from Bookmarks
                  </p>
                  <p className="font-subtext mt-1 text-xs text-slate-400">
                    You can add up to 3 bookmarked papers to one blog post.
                  </p>
                </div>

                <div className="rounded-full bg-[#EEF6FF] px-3 py-1 text-sm font-semibold text-[#005CB9] ring-1 ring-[#005CB9]/20">
                  {form.selectedOpenAlexIds.length} selected
                </div>
              </div>

              <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-black bg-white px-3 text-slate-500 focus-within:border-[#14532D] focus-within:text-[#14532D]">
                <Search className="h-4 w-4 shrink-0" />
                <input
                  type="search"
                  value={bookmarkTitleQuery}
                  onChange={(event) =>
                    setBookmarkTitleQuery(event.target.value)
                  }
                  placeholder="Search bookmarked papers by title..."
                  className="w-full border-0 bg-transparent text-sm font-medium text-black outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="mt-4 max-h-[220px] space-y-3 overflow-y-auto pr-1">
                {isLoadingBookmarks ? (
                  <div className="rounded-[1rem] border border-dashed border-black bg-white px-4 py-6 text-center text-slate-500">
                    Loading bookmarked papers...
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="rounded-[1rem] border border-dashed border-black bg-white px-4 py-6 text-center text-slate-500">
                    No bookmarked papers yet.
                  </div>
                ) : filteredBookmarks.length === 0 ? (
                  <div className="rounded-[1rem] border border-dashed border-black bg-white px-4 py-6 text-center text-slate-500">
                    No bookmarked papers match this title.
                  </div>
                ) : (
                  filteredBookmarks.map((bookmark) => {
                    const normalizedBookmarkId = normalizeSocialOpenAlexId(
                      bookmark.openAlexId,
                    );
                    const isSelected =
                      form.selectedOpenAlexIds.includes(normalizedBookmarkId);
                    const topicLabel = normalizeTopicLabel(bookmark.topic);

                    return (
                      <button
                        key={bookmark.id}
                        type="button"
                        onClick={() => onToggleBookmark(normalizedBookmarkId)}
                        className={`flex w-full items-start gap-3 rounded-[1rem] border px-4 py-3 text-left transition ${
                          isSelected
                            ? "border-[#14532D] bg-[#A3E635]/15"
                            : "border-black bg-white hover:border-[#14532D] hover:bg-[#EEF6FF]/60"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            isSelected
                              ? "border-[#14532D] bg-[#14532D] text-white"
                              : "border-black/20 bg-white text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-black">
                            {bookmark.title}
                          </p>

                          <p className="font-subtext mt-1 text-sm text-slate-500">
                            {bookmark.authors}
                          </p>

                          {topicLabel ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={TAG_PILL_CLASS}>
                                {topicLabel}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-extrabold uppercase tracking-[0.22em] text-[#14532D]">
                Topics from selected papers
              </label>

              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-[1rem] border border-black bg-slate-50/60 px-3 py-3">
                {selectedTopics.length > 0 ? (
                  selectedTopics.map((topic) => (
                    <span key={topic} className={TAG_PILL_CLASS}>
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    Choose bookmarked papers to display their topics here.
                  </span>
                )}
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-3 border-t border-black bg-white px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 ${SECONDARY_BUTTON_CLASS}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 ${PRIMARY_BUTTON_CLASS}`}
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
