import { useState } from "react";
import {
  AlertTriangle,
  BookMarked,
  Check,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  DEFAULT_REPORT_FIELDS,
  REPORT_EXPORT_FIELDS,
} from "@/features/reports/data/reportPreview.data";
import { useReportBookmarks } from "@/features/reports/hooks/useReportBookmarks";
import { reportApi } from "@/features/reports/services/report.api";
import type { BookmarkResponse } from "@/features/bookmarks/types/bookmark.types";
import type {
  ReportExportFormat,
  ReportExportRequest,
  ReportFieldGroup,
} from "@/features/reports/types";

const MAX_SELECTED_BOOKMARKS = 20;

const FIELD_GROUPS: ReportFieldGroup[] = [
  "Core details",
  "Research context",
  "Discovery",
];

function BookmarkSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.5rem] border border-black/15 bg-white p-4">
      <div className="flex gap-3">
        <div className="h-6 w-6 shrink-0 rounded-lg bg-slate-200" />
        <div className="w-full space-y-3">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="h-5 w-11/12 rounded bg-slate-200" />
          <div className="h-4 w-8/12 rounded bg-slate-100" />
          <div className="flex gap-2 pt-2">
            <div className="h-7 w-20 rounded-full bg-slate-100" />
            <div className="h-7 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function downloadFile(file: Blob, fileName: string) {
  const fileUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");

  downloadLink.href = fileUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(fileUrl);
}

type BookmarkOptionProps = {
  bookmark: BookmarkResponse;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (bookmark: BookmarkResponse) => void;
};

function BookmarkOption({
  bookmark,
  isSelected,
  isDisabled,
  onToggle,
}: BookmarkOptionProps) {
  return (
    <label
      className={[
        "group relative block rounded-[1.5rem] border p-4 transition-all",
        isSelected
          ? "border-black bg-[#EFFAF1] shadow-[0_12px_30px_rgba(20,83,45,0.11)]"
          : "border-black bg-white hover:-translate-y-0.5 hover:border-black hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]",
        isDisabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
      ].join(" ")}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => onToggle(bookmark)}
      />

      <div className="flex items-start gap-3">
        <span
          className={[
            "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition",
            isSelected
              ? "border-[#14532D] bg-[#14532D] text-white"
              : "border-black/30 bg-white text-transparent group-hover:border-black",
          ].join(" ")}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#005CB9] bg-[#EEF6FF] px-2.5 py-1 font-subtext text-[10px] font-bold uppercase tracking-[0.12em] text-[#005CB9]">
              {bookmark.openAlexId}
            </span>
            <span className="inline-flex items-center gap-1.5 font-subtext text-xs font-semibold text-black">
              <CalendarDays className="h-3.5 w-3.5 text-black/55" />
              {bookmark.publicationYear ?? "Unknown year"}
            </span>
          </div>

          <h3 className="font-title mt-2 line-clamp-2 text-[16px] font-semibold leading-6 text-black">
            {bookmark.title}
          </h3>
          <p className="font-subtext mt-1 line-clamp-1 text-[13px] text-black/60">
            {bookmark.authors}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#F37021] bg-[#FFF4EC] px-2.5 py-1 font-subtext text-[11px] font-semibold text-[#C24E0A]">
              {bookmark.topic}
            </span>
            <span className="rounded-full border border-[#00A859] bg-[#ECFFF5] text-[#007A41] px-2.5 py-1 font-subtext text-[11px] font-semibold">
              {(bookmark.citationCount ?? 0).toLocaleString()} citations
            </span>
          </div>
        </div>
      </div>
    </label>
  );
}

export default function ReportPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [selectedBookmarks, setSelectedBookmarks] = useState<
    Map<string, BookmarkResponse>
  >(() => new Map());
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    () => new Set(DEFAULT_REPORT_FIELDS),
  );
  const [format, setFormat] = useState<ReportExportFormat>("CSV");
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "success"
  >("idle");
  const [exportError, setExportError] = useState<string | null>(null);

  const {
    bookmarks,
    collections,
    error: bookmarksError,
    hasNext,
    isLoading,
    isLoadingCollections,
    isLoadingMore,
    loadMore,
    refetch,
    totalElements,
  } = useReportBookmarks({
    collectionId: selectedCollectionId,
    searchValue,
  });

  const selectedCount = selectedBookmarks.size;
  const hasReachedLimit = selectedCount >= MAX_SELECTED_BOOKMARKS;
  const canExport = selectedCount > 0 && selectedFields.size > 0;
  const selectedBookmarkPreview = Array.from(selectedBookmarks.values()).slice(
    0,
    3,
  );

  function toggleBookmark(bookmark: BookmarkResponse) {
    setExportStatus("idle");
    setSelectedBookmarks((current) => {
      const next = new Map(current);

      if (next.has(bookmark.id)) {
        next.delete(bookmark.id);
      } else if (next.size < MAX_SELECTED_BOOKMARKS) {
        next.set(bookmark.id, bookmark);
      }

      return next;
    });
  }

  function toggleField(fieldKey: string) {
    setExportStatus("idle");
    setSelectedFields((current) => {
      const next = new Set(current);
      if (next.has(fieldKey)) {
        next.delete(fieldKey);
      } else {
        next.add(fieldKey);
      }
      return next;
    });
  }

  async function exportReport() {
    if (!canExport || exportStatus === "exporting") {
      return;
    }

    setExportStatus("exporting");
    setExportError(null);

    const payload: ReportExportRequest = {
      fields: Array.from(selectedFields) as ReportExportRequest["fields"],
      format,
      includeMetadata: true,
      paperIds: Array.from(
        selectedBookmarks.values(),
        (bookmark) => bookmark.openAlexId,
      ),
      searchQuery: searchValue.trim(),
    };

    try {
      const { file, fileName } = await reportApi.exportReport(payload);
      downloadFile(file, fileName);
      setExportStatus("success");
    } catch {
      setExportStatus("idle");
      setExportError(
        "We couldn't generate your report right now. Please try again in a moment.",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-black bg-[radial-gradient(circle_at_12%_8%,_rgba(243,112,33,0.18),_transparent_29%),radial-gradient(circle_at_92%_88%,_rgba(0,174,239,0.2),_transparent_34%),white] px-5 py-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-black/10" />
        <div className="pointer-events-none absolute -right-2 -top-6 h-36 w-36 rounded-full border border-black/10" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
              Export - Report Workspace
            </p>
            <h1 className="font-title-page mt-5 text-[2.55rem] font-normal leading-[1.05] tracking-normal text-[#14532D] sm:text-[3.45rem]">
              Turn your saved research into a portable dataset.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-black/70 md:text-[15px]">
              Select bookmarked papers, choose the metadata you need, and export
              a clean report for spreadsheets, pipelines, or sharing.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)]">
        <section className="overflow-hidden rounded-[2rem] border border-black bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="border-b border-black bg-[linear-gradient(110deg,#F7FFF8_0%,#FFFFFF_48%,#F3FBFF_100%)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-subtext text-[16px] font-bold uppercase tracking-[0.2em] text-[#00A859]">
                      Step 01
                    </p>
                    <h2 className="font-title text-xl font-semibold text-black">
                      Choose bookmarked papers
                    </h2>
                  </div>
                </div>
              </div>

              <div
                className={[
                  "inline-flex items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-2.5",
                  hasReachedLimit
                    ? "border-[#F37021] bg-[#FFF4EC]"
                    : "border-black bg-white",
                ].join(" ")}
              >
                <span className="font-subtext text-xs font-semibold text-black">
                  Selected
                </span>
                <span className="font-title text-lg font-bold text-black">
                  {selectedCount}
                  <span className="text-black/35">
                    /{MAX_SELECTED_BOOKMARKS}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
              <label className="flex h-12 items-center gap-3 rounded-[1rem] border border-black bg-white px-4 shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                <Search className="h-4.5 w-4.5 shrink-0 text-[#F37021]" />
                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search title, author, topic..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-black placeholder:text-black/35 focus:outline-none"
                />
                {searchValue ? (
                  <button
                    type="button"
                    onClick={() => setSearchValue("")}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-black/45 transition hover:bg-slate-100 hover:text-black"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </label>

              <label className="relative flex h-12 items-center rounded-[1rem] border border-black bg-white shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
                <Database className="pointer-events-none absolute left-4 h-4 w-4 text-[#00AEEF]" />
                <select
                  value={selectedCollectionId ?? ""}
                  disabled={isLoadingCollections}
                  onChange={(event) =>
                    setSelectedCollectionId(event.target.value || null)
                  }
                  className="h-full w-full appearance-none rounded-[1rem] bg-transparent pl-11 pr-10 text-sm font-semibold text-black focus:outline-none"
                >
                  <option value="">
                    {isLoadingCollections
                      ? "Loading collections..."
                      : "All library"}
                  </option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-black/45" />
              </label>
            </div>

            {hasReachedLimit ? (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#F37021]/40 bg-[#FFF4EC] px-3.5 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#C24E0A]" />
                <p className="font-subtext text-xs leading-5 text-[#8A3D0B]">
                  Selection limit reached. Remove one paper before choosing
                  another.
                </p>
              </div>
            ) : null}
          </div>

          <div className="p-5 sm:p-6">
            {isLoading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <BookmarkSkeleton key={index} />
                ))}
              </div>
            ) : null}

            {!isLoading && bookmarksError ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-red-300 bg-red-50/70 px-6 py-12 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-600 shadow-sm">
                  <AlertTriangle className="h-6 w-6" />
                </span>
                <h3 className="font-title mt-5 text-xl font-semibold text-black">
                  Your bookmark library took a detour
                </h3>
                <p className="font-subtext mt-2 max-w-md text-sm leading-6 text-black/55">
                  We could not load saved papers for this preview. Your current
                  export settings are still safe.
                </p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-black bg-black px-4 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            ) : null}

            {!isLoading && !bookmarksError && bookmarks.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-black/25 bg-[radial-gradient(circle_at_center,_rgba(0,174,239,0.08),_transparent_55%),#FAFCFD] px-6 py-12 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-black bg-white text-[#00AEEF] shadow-sm">
                  <BookMarked className="h-6 w-6" />
                </span>
                <h3 className="font-title mt-5 text-xl font-semibold text-black">
                  {searchValue ? "No matching bookmarks" : "No bookmarks yet"}
                </h3>
                <p className="font-subtext mt-2 max-w-md text-sm leading-6 text-black/55">
                  {searchValue
                    ? "Try a broader title, author, or topic to find papers for this report."
                    : "Save papers from Search first, then return here to build a focused export."}
                </p>
                {searchValue ? (
                  <button
                    type="button"
                    onClick={() => setSearchValue("")}
                    className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-black bg-white px-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                  >
                    <X className="h-4 w-4" />
                    Clear search
                  </button>
                ) : null}
              </div>
            ) : null}

            {!isLoading && !bookmarksError && bookmarks.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="font-subtext text-xs font-semibold text-black">
                    Showing {bookmarks.length} of {totalElements} papers
                  </p>
                  {selectedCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBookmarks(new Map());
                        setExportStatus("idle");
                      }}
                      className="text-xs font-semibold text-[#C24E0A] underline decoration-[#F37021]/40 underline-offset-4 transition hover:text-[#F37021]"
                    >
                      Clear selection
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {bookmarks.map((bookmark) => {
                    const isSelected = selectedBookmarks.has(bookmark.id);
                    return (
                      <BookmarkOption
                        key={bookmark.id}
                        bookmark={bookmark}
                        isSelected={isSelected}
                        isDisabled={hasReachedLimit && !isSelected}
                        onToggle={toggleBookmark}
                      />
                    );
                  })}
                </div>

                {hasNext ? (
                  <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={() => void loadMore()}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[1rem] border border-black bg-white text-sm font-semibold text-black transition hover:bg-[#14532D] hover:text-white cursor-pointer disabled:opacity-60"
                  >
                    {isLoadingMore ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoadingMore ? "Loading papers..." : "Load more papers"}
                    <span className="rounded-full bg-slate-200 px-1 py-1 border border-black/60 text-xs text-black">
                      {Math.max(totalElements - bookmarks.length, 0)}
                    </span>
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </section>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section className="overflow-hidden rounded-[2rem] border border-black bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            <div className="border-b border-black bg-[linear-gradient(110deg,#FFF9F4_0%,#FFFFFF_55%,#F4FBFF_100%)] p-5 sm:p-6">
              <p className="font-subtext text-[16px] font-bold uppercase tracking-[0.2em] text-[#F37021]">
                Step 02
              </p>
              <h2 className="font-title mt-1 text-xl font-semibold text-black">
                Shape your export
              </h2>
              <p className="font-subtext mt-2 text-sm leading-6 text-gray-600">
                Pick a format and include only the fields your next workflow
                needs.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-black">
                  File format
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(["CSV", "JSON"] as ReportExportFormat[]).map((option) => {
                    const isActive = format === option;
                    const Icon = option === "CSV" ? FileSpreadsheet : FileJson;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setFormat(option);
                          setExportStatus("idle");
                        }}
                        className={[
                          "relative rounded-[1.35rem] border p-4 text-left transition",
                          isActive
                            ? option === "CSV"
                              ? "border-black bg-[#EFFAF1] shadow-[0_10px_24px_rgba(20,83,45,0.1)]"
                              : "border-black bg-[#EEF8FF] shadow-[0_10px_24px_rgba(0,92,185,0.1)]"
                            : "border-black/20 bg-white hover:border-black",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black",
                            option === "CSV"
                              ? "bg-[#14532D] text-white"
                              : "bg-[#005CB9] text-white",
                          ].join(" ")}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="mt-3 text-sm font-bold text-black">
                          {option}
                        </p>
                        <p className="font-subtext mt-1 text-[11px] leading-4 text-black/50">
                          {option === "CSV"
                            ? "Spreadsheet ready"
                            : "Structured data"}
                        </p>
                        {isActive ? (
                          <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-black">
                      Data fields
                    </p>
                    <p className="font-subtext mt-0.5 text-xs text-black font-bold">
                      {selectedFields.size} of {REPORT_EXPORT_FIELDS.length}{" "}
                      selected
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFields(
                          new Set(
                            REPORT_EXPORT_FIELDS.map((field) => field.key),
                          ),
                        )
                      }
                      className="text-xs font-semibold text-[#005CB9] hover:underline"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFields(new Set(DEFAULT_REPORT_FIELDS))
                      }
                      className="text-xs font-semibold text-black/50 hover:text-black hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Section chọn data fields để export */}
                <div className="max-h-[410px] space-y-4 overflow-y-auto pr-1">
                  {FIELD_GROUPS.map((group) => (
                    <div key={group}>
                      <p className="font-subtext mb-2 text-[10px] font-bold uppercase tracking-[0.17em] text-black">
                        {group}
                      </p>
                      <div className="space-y-2">
                        {REPORT_EXPORT_FIELDS.filter(
                          (field) => field.group === group,
                        ).map((field) => {
                          const isSelected = selectedFields.has(field.key);
                          return (
                            <label
                              key={field.key}
                              className={[
                                "relative flex cursor-pointer items-center gap-3 rounded-[1rem] border px-3.5 py-3 transition",
                                isSelected
                                  ? "border-black bg-[#F8FBF8]"
                                  : "border-black/15 bg-white hover:border-black/40",
                              ].join(" ")}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleField(field.key)}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              />
                              <span
                                className={[
                                  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                                  isSelected
                                    ? "border-[#14532D] bg-[#14532D] text-white"
                                    : "border-black/25 bg-white text-transparent",
                                ].join(" ")}
                              >
                                <Check
                                  className="h-3.5 w-3.5"
                                  strokeWidth={3}
                                />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[13px] font-semibold text-black">
                                  {field.label}
                                </span>
                                <span className="font-subtext block text-[11px] text-black/45">
                                  {field.description}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-black bg-black text-white shadow-[0_20px_55px_rgba(0,0,0,0.16)]">
            <div className="bg-[radial-gradient(circle_at_top_right,_rgba(0,168,89,0.34),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(0,174,239,0.2),_transparent_42%)] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-subtext text-[10px] font-bold uppercase tracking-[0.2em] text-[#7AC143]">
                    Export summary
                  </p>
                  <h2 className="font-title mt-1 text-xl font-semibold">
                    Ready when you are
                  </h2>
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10">
                  <Download className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/15 bg-white/8 px-3 py-3">
                  <p className="font-subtext text-[10px] uppercase tracking-wider text-white/50">
                    Papers
                  </p>
                  <p className="font-title mt-1 text-xl font-bold">
                    {selectedCount}
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/8 px-3 py-3">
                  <p className="font-subtext text-[10px] uppercase tracking-wider text-white/50">
                    Fields
                  </p>
                  <p className="font-title mt-1 text-xl font-bold">
                    {selectedFields.size}
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/8 px-3 py-3">
                  <p className="font-subtext text-[10px] uppercase tracking-wider text-white/50">
                    Format
                  </p>
                  <p className="font-title mt-1 text-xl font-bold">{format}</p>
                </div>
              </div>

              {selectedBookmarkPreview.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {selectedBookmarkPreview.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#7AC143]" />
                      <span className="truncate font-subtext text-xs text-white/75">
                        {bookmark.title}
                      </span>
                    </div>
                  ))}
                  {selectedCount > selectedBookmarkPreview.length ? (
                    <p className="px-1 font-subtext text-[11px] text-white/45">
                      +{selectedCount - selectedBookmarkPreview.length} more
                      selected papers
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="font-subtext mt-4 rounded-xl border border-white/50 px-4 py-3 text-xs leading-5 text-white/50">
                  Choose at least one bookmarked paper.
                </p>
              )}

              {selectedFields.size === 0 ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#F37021]/55 bg-[#F37021]/10 px-3 py-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F8A167]" />
                  <p className="font-subtext text-xs leading-5 text-[#FFD7BE]">
                    Select at least one data field to continue.
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canExport || exportStatus === "exporting"}
                onClick={() => void exportReport()}
                className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-[1rem] border border-white bg-[#00A859] px-5 text-sm font-bold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-white/35"
              >
                {exportStatus === "exporting" ? (
                  <LoaderCircle className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Download className="h-4.5 w-4.5" />
                )}
                {exportStatus === "exporting"
                  ? "Preparing preview..."
                  : `Export ${format} report`}
              </button>

              {exportStatus === "success" ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#7AC143]/60 bg-[#7AC143]/12 px-3.5 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9CE26B]" />
                  <p className="font-subtext text-xs leading-5 text-[#DDF9CA]">
                    Report exported and downloaded successfully.
                  </p>
                </div>
              ) : null}

              {exportError ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/60 bg-red-400/10 px-3.5 py-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                  <p className="font-subtext text-xs leading-5 text-red-100">
                    {exportError}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
