interface CreateCollectionModalProps {
  error: string | null;
  isOpen: boolean;
  isSubmitting: boolean;
  name: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function CreateCollectionModal({
  error,
  isOpen,
  isSubmitting,
  name,
  onChange,
  onClose,
  onSubmit,
}: CreateCollectionModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close create collection modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-[1.8rem] border border-black bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(122,193,67,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(0,174,239,0.14),_transparent_42%)]"
        />

        <div className="relative z-10">
          <div>
            <p className="font-subtext text-xs font-semibold uppercase tracking-[0.24em] text-[#7AC143]">
              New collection
            </p>
            <h2 className="font-title mt-2 text-[1.9rem] leading-tight text-black">
              Name a collection for your saved works
            </h2>
            <p className="font-subtext mt-3 text-[15px] leading-7 text-black/70">
              Create it first, then add any bookmarked work into that group from
              the collection menu on each card.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <label
            htmlFor="bookmark-collection-name"
            className="font-subtext mb-2 block text-sm font-semibold text-black"
          >
            Collection name
          </label>
          <input
            id="bookmark-collection-name"
            autoFocus
            maxLength={120}
            value={name}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Example: Thesis sources, AI ethics, Must revisit"
            className="h-14 w-full rounded-2xl border border-black bg-white px-4 text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/25"
          />

          {error ? (
            <p className="font-subtext mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center rounded-2xl border border-black bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="inline-flex h-12 items-center rounded-2xl border border-black bg-[#F37021] px-5 text-sm font-semibold text-white transition hover:bg-[#d95e14] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating..." : "Create collection"}
          </button>
        </div>
      </div>
    </div>
  );
}
