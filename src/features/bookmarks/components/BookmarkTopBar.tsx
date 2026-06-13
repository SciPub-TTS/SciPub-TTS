interface BookmarkTopBar {
    keyword: string;
    onKeywordChange: (value: string) => void;
}

export function BookmarkTopBar({ keyword, onKeywordChange }: BookmarkTopBar) {
    return (
        <div className="flex items-center gap-3 mb-5 px-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mr-2 shrink-0">
                {/*<span>My library</span>*/}
                {/*<svg width="12" height="12" viewBox="0 0 12 12" fill="none">*/}
                {/*    <path d="M4 2l4 4-4 4" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />*/}
                {/*</svg>*/}
                <span className="font-medium text-slate-800">Bookmarks</span>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => onKeywordChange(e.target.value)}
                    placeholder="Search saved papers"
                    className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Export button */}
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Export
            </button>

            {/* New collection */}
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-emerald-800 text-white text-sm font-medium hover:bg-emerald-900 transition-all shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                New collection
            </button>

            {/* Bell */}
            {/*<button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all shrink-0">*/}
            {/*    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">*/}
            {/*        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />*/}
            {/*    </svg>*/}
            {/*</button>*/}
        </div>
    );
}
