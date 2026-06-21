import { useState } from "react";
import { Link } from "react-router-dom";

import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import {
  formatAuthors,
  formatCitationCount,
  formatSavedAt,
} from "@/features/bookmarks/utils/bookmark.utils";
import { buildDetailTrailUrl } from "@/features/detail/detailTrail";

interface BookmarkCardProps {
  bookmark: BookmarkResponse;
  onDelete: (id: string) => void;
  onUpdateNote: (id: string, note: string | null) => void;
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
  const colorClassName = TOPIC_COLORS[topic] ?? "bg-[#FFF6E8] text-[#8B5E34]";
  return colorClassName.replace(/bg-\[[^\]]+\]/g, "bg-white");
}

export function BookmarkCard({
  bookmark,
  onDelete,
  onUpdateNote,
}: BookmarkCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(bookmark.note ?? "");

  async function handleSaveNote() {
    await onUpdateNote(bookmark.id, noteValue.trim() || null);
    setEditingNote(false);
  }

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-black bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-[#8B5E34] border border-black">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <polyline
                points="14,2 14,8 20,8"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Paper
          </span>

          {bookmark.topic && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${getTopicColor(
                bookmark.topic,
              )}`}
            >
              {bookmark.topic}
            </span>
          )}
        </div>

        <button
          onClick={() => onDelete(bookmark.id)}
          className="shrink-0 text-[#7AC143] transition-colors hover:text-red-500"
          title="Remove bookmark"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      <h3 className="font-title line-clamp-3 text-base font-bold leading-snug text-black">
        {bookmark.title}
      </h3>

      <p className="font-subtext text-sm font-medium leading-relaxed text-[#8B5E34]">
        {formatAuthors(bookmark.authors)}
      </p>

      <div className="font-subtext flex items-center gap-3 text-sm font-medium">
        {bookmark.publicationYear && (
          <span className="text-black">{bookmark.publicationYear}</span>
        )}
        {bookmark.citationCount != null && (
          <span className="ml-auto shrink-0 text-black">
            {formatCitationCount(bookmark.citationCount)} citations
          </span>
        )}
      </div>

      {!editingNote && bookmark.note && (
        <div className="rounded-lg border border-black bg-white px-3 py-2">
          <p className="font-subtext line-clamp-2 text-sm font-medium text-[#8B5E34]">{bookmark.note}</p>
        </div>
      )}

      {editingNote && (
        <div className="space-y-2">
          <textarea
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            autoFocus
            className="w-full resize-none rounded-lg border border-black px-3 py-2 text-xs text-black placeholder:text-black/45 focus:outline-none focus:ring-2 focus:ring-[#7AC143]/25"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setEditingNote(false)}
              className="text-xs text-black/60 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="rounded-lg bg-[#00AEEF] px-3 py-1 text-xs font-medium text-white transition-all hover:bg-[#0095cc]"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-1">
        <span className="font-subtext text-xs font-medium text-black">
          {formatSavedAt(bookmark.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          <Link
            to={buildDetailTrailUrl("works", bookmark.openAlexId, [], "bookmarks")}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-black bg-white px-2.5 text-[11px] font-semibold text-black transition-all hover:bg-white hover:text-black"
            title="View detail"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            View Detail
          </Link>

          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-black transition-all hover:bg-white hover:text-black"
            title="Share"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
              <line
                x1="8.59"
                y1="13.51"
                x2="15.42"
                y2="17.49"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="15.41"
                y1="6.51"
                x2="8.59"
                y2="10.49"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

          <button
            onClick={() => setEditingNote(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-black transition-all hover:bg-white hover:text-black"
            title="Add note"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-black transition-all hover:bg-white hover:text-black"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute bottom-8 right-0 z-20 w-36 rounded-xl border border-black bg-white py-1 shadow-lg">
                  <button
                    onClick={() => {
                      setEditingNote(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-black hover:bg-white"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Edit note
                  </button>
                  <button
                    onClick={() => {
                      onDelete(bookmark.id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <polyline
                        points="3,6 5,6 21,6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 11v6M14 11v6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
