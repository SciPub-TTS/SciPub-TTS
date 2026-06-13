import type { BookmarkStatsResponse } from "@/features/bookmarks/types/bookmark.types";

interface BookmarkPageHeaderProps {
    totalBookmarks: number;
    stats: BookmarkStatsResponse | null;
}

export function BookmarkPageHeader({ totalBookmarks, stats }: BookmarkPageHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-5 mb-6">
            {/* Left — hero text */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-white px-8 py-7">
                <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                    Personal collection · {totalBookmarks} bookmarks
                </p>
                <h1 className="font-serif text-[2rem] leading-tight text-slate-950">
                    Your{" "}
                    <span className="italic text-emerald-700">bookmark</span>{" "}
                    library,
                </h1>
                <h1 className="font-serif text-[2rem] leading-tight text-slate-950">
                    organized for research.
                </h1>
            </div>

            {/* Right — stats + shareable link */}
            <div className="lg:w-[370px] rounded-2xl border border-slate-200 bg-white px-7 py-6 flex flex-col justify-between gap-5">
                {/* Shareable link row */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Shareable link
                        </p>
                        <span className="text-[10px] text-emerald-600 font-medium border border-emerald-200 rounded-full px-2 py-0.5">
              Public
            </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 mb-2">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 text-slate-400">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-xs text-emerald-700 truncate flex-1">
              trendtracker.app/u/bookmarks
            </span>
                        <button className="text-[10px] text-slate-500 hover:text-slate-700 shrink-0 flex items-center gap-1 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            Copy
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-700">Allow public access</p>
                            <p className="text-[10px] text-slate-400">Anyone with the link can view this library.</p>
                        </div>
                        {/* Toggle placeholder */}
                        <div className="w-10 h-5 rounded-full bg-emerald-500 relative cursor-pointer">
                            <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5 shadow" />
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "PAPERS", value: stats?.totalPapers ?? 0 },
                        { label: "TOPICS", value: stats?.totalTopics ?? 0 },
                        { label: "SOURCES", value: stats?.totalSources ?? 0 },
                        { label: "AUTHORS", value: stats?.totalAuthors ?? 0 },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center">
                            <p className="text-lg font-semibold text-slate-900">{s.value}</p>
                            <p className="text-[9px] tracking-widest text-slate-400 uppercase mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
