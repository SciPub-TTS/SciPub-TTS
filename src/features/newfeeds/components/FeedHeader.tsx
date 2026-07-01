export function FeedHeader() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
          Monitor - Personalized Research Feed
        </p>
        <h1 className="font-search-title mt-3 text-4xl font-normal leading-[1.05] text-[#14532D] md:text-5xl">
          Your Research Radar.
        </h1>
        <p className="font-subtext mt-3 max-w-3xl text-base leading-7 text-slate-500">
          New papers curated from the topics and authors you follow.
        </p>
      </div>
    </div>
  );
}
