import { useState } from "react";
import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import {
    formatAuthors,
    formatCitationCount,
    formatSavedAt,
} from "@/features/bookmarks/utils/bookmark.utils";

interface BookmarkCardProps {
    bookmark: BookmarkResponse;
    onDelete: (id: string) => void;
    onUpdateNote: (id: string, note: string | null) => void;
}

// Color map cho topic tags
const TOPIC_COLORS: Record<string, string> = {
    "Artificial Intelligence": "bg-violet-100 text-violet-700",
    "Machine Learning": "bg-violet-100 text-violet-700",
    Medicine: "bg-red-100 text-red-700",
    Environmental: "bg-emerald-100 text-emerald-700",
    Education: "bg-blue-100 text-blue-700",
    Economics: "bg-amber-100 text-amber-700",
    Engineering: "bg-orange-100 text-orange-700",
    Physics: "bg-cyan-100 text-cyan-700",
    Biology: "bg-green-100 text-green-700",
};

function getTopicColor(topic: string): string {
    return TOPIC_COLORS[topic] ?? "bg-slate-100 text-slate-600";
}

export function BookmarkCard({ bookmark, onDelete, onUpdateNote }: BookmarkCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [editingNote, setEditingNote] = useState(false);
    const [noteValue, setNoteValue] = useState(bookmark.note ?? "");

    async function handleSaveNote() {
        await onUpdateNote(bookmark.id, noteValue.trim() || null);
        setEditingNote(false);
    }

    return (
        <div className="relative bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-sm transition-all group">
            {/* Top row: type badge + topic + bookmark icon */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Type badge */}
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" />
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Paper
          </span>

                    {/* Topic */}
                    {bookmark.topic && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getTopicColor(bookmark.topic)}`}>
              {bookmark.topic}
            </span>
                    )}
                </div>

                {/* Bookmark icon */}
                <button
                    onClick={() => onDelete(bookmark.id)}
                    className="text-emerald-500 hover:text-red-400 transition-colors shrink-0"
                    title="Remove bookmark"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                </button>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-3">
                {bookmark.title}
            </h3>

            {/* Authors */}
            <p className="text-xs text-slate-500 leading-relaxed">
                {formatAuthors(bookmark.authors)}
            </p>

            {/* Source + year + citations */}
            <div className="flex items-center gap-3 text-xs">
                {bookmark.source && (
                    <span className="text-emerald-600 font-medium truncate max-w-[120px]">
            {bookmark.source}
          </span>
                )}
                {bookmark.publicationYear && (
                    <span className="text-slate-400">{bookmark.publicationYear}</span>
                )}
                {bookmark.citationCount != null && (
                    <span className="text-slate-400 ml-auto shrink-0">
            {formatCitationCount(bookmark.citationCount)} citations
          </span>
                )}
            </div>

            {/* Topic label */}
            {bookmark.topic && (
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    <span className="font-medium text-slate-500">TOPIC</span>{" "}
                    {bookmark.topic}
                </p>
            )}

            {/* Note (if exists) */}
            {!editingNote && bookmark.note && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <p className="text-xs text-amber-800 line-clamp-2">{bookmark.note}</p>
                </div>
            )}

            {/* Note editor */}
            {editingNote && (
                <div className="space-y-2">
          <textarea
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Add a note…"
              rows={3}
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
                    <div className="flex items-center gap-2 justify-end">
                        <button
                            onClick={() => setEditingNote(false)}
                            className="text-xs text-slate-500 hover:text-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveNote}
                            className="text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1 rounded-lg transition-all"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom row: saved time + action icons */}
            <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-100">
        <span className="text-[10px] text-slate-400">
          {formatSavedAt(bookmark.createdAt)}
        </span>

                <div className="flex items-center gap-1">
                    {/* Open external */}
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all" title="Open paper">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Share */}
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all" title="Share">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>

                    {/* Note / folder */}
                    <button
                        onClick={() => setEditingNote(true)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                        title="Add note"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* More options */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu((v) => !v)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                            </svg>
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 bottom-8 z-20 w-36 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                                    <button
                                        onClick={() => { setEditingNote(true); setShowMenu(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        Edit note
                                    </button>
                                    <button
                                        onClick={() => { onDelete(bookmark.id); setShowMenu(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
