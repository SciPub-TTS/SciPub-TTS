import { X } from "lucide-react";
import { useEffect } from "react";

type SafeActionDialogVariant = "danger" | "logout";

interface SafeActionDialogProps {
  cancelLabel?: string;
  confirmLabel: string;
  description?: string;
  eyebrow?: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  pendingLabel?: string;
  title: string;
  variant?: SafeActionDialogVariant;
}

const variantStyles: Record<
  SafeActionDialogVariant,
  {
    confirmButtonClassName: string;
    panelAccentClassName: string;
  }
> = {
  danger: {
    confirmButtonClassName:
      "border-rose-700 bg-rose-600 text-white hover:bg-rose-700",
    panelAccentClassName:
      "bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(244,63,94,0.08),_transparent_40%)]",
  },
  logout: {
    confirmButtonClassName:
      "border-[#14532D] bg-[#14532D] text-white hover:bg-[#15803D]",
    panelAccentClassName:
      "bg-[radial-gradient(circle_at_top_left,_rgba(122,193,67,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(0,174,239,0.1),_transparent_42%)]",
  },
};

export function SafeActionDialog({
  cancelLabel = "Cancel",
  confirmLabel,
  isPending = false,
  onClose,
  onConfirm,
  open,
  pendingLabel,
  title,
  variant = "danger",
}: SafeActionDialogProps) {
  useEffect(() => {
    if (!open || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPending, onClose, open]);

  if (!open) {
    return null;
  }

  const styles = variantStyles[variant];
  const resolvedPendingLabel = pendingLabel ?? `${confirmLabel}...`;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safe-action-dialog-title"
    >
      <button
        type="button"
        aria-label="Close safe action dialog"
        onClick={() => {
          if (!isPending) {
            onClose();
          }
        }}
        className="absolute inset-0"
      />

      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[1.8rem] border border-black bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${styles.panelAccentClassName}`}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="safe-action-dialog-title"
              className="font-title text-[1.8rem] leading-tight text-black"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-white text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex h-12 items-center rounded-2xl border border-black bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`inline-flex h-12 items-center rounded-2xl border px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${styles.confirmButtonClassName}`}
          >
            {isPending ? resolvedPendingLabel : confirmLabel}
          </button>
        </div>

        {isPending ? (
          <div className="pointer-events-none absolute inset-x-6 bottom-3 rounded-full bg-black/5 px-4 py-2">
            <p className="font-subtext text-center text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
              Securing your action...
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
