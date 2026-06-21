export function BookmarkTopBar() {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-black bg-white px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
      <div className="font-subtext mr-2 flex shrink-0 items-center gap-1.5 text-sm text-black/65">
        <span className="font-semibold text-[#F37021]">Bookmarks</span>
      </div>

      <button className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-black bg-white px-4 text-sm text-[#8B5E34] transition-all hover:bg-white">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <polyline
            points="7,10 12,15 17,10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="15"
            x2="12"
            y2="3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Export
      </button>

      <button className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-black bg-white px-4 text-sm font-medium text-black transition-all hover:bg-white">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <line
            x1="12"
            y1="5"
            x2="12"
            y2="19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        New collection
      </button>
    </div>
  );
}
