export function FeedHeader() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-slate-950">Research Feed</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
          New papers based on your followed topics, authors, journals, and
          saved keywords.
        </p>
      </div>
    </div>
  );
}
