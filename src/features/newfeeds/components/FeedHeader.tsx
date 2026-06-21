import { Plus, UserPlus } from "lucide-react";

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

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <button
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span>Follow New Topic</span>
        </button>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-500 bg-white px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          type="button"
        >
          <UserPlus className="h-4 w-4" />
          <span>Follow New Author</span>
        </button>
      </div>
    </div>
  );
}
