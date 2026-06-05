import { AlertCircle, ScrollText } from "lucide-react";

export function PaperDetailLoadingState() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3 text-slate-700">
        <ScrollText className="h-5 w-5" />
        <p className="text-lg font-semibold">Loading paper detail...</p>
      </div>
    </section>
  );
}

export function PaperDetailErrorState({ message }: { message: string }) {
  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-8 shadow-sm">
      <div className="flex items-center gap-3 text-rose-700">
        <AlertCircle className="h-5 w-5" />
        <p className="text-lg font-semibold">Cannot load paper detail</p>
      </div>
      <p className="mt-3 text-sm text-rose-700">
        {message || "Something went wrong while loading this paper."}
      </p>
    </section>
  );
}
