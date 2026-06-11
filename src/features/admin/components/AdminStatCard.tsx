import type { ComponentType } from "react";

export type AdminStatCardTone =
  | "blue"
  | "amber"
  | "red"
  | "indigo"
  | "purple"
  | "green"
  | "emerald"
  | "teal";

export type AdminStatCardProps = {
  accent?: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  tone: AdminStatCardTone;
  value: string;
};

const toneClassMap: Record<AdminStatCardTone, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  red: "border-red-200 bg-red-50 text-red-900",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-900",
  purple: "border-purple-200 bg-purple-50 text-purple-900",
  green: "border-green-200 bg-green-50 text-green-900",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
  teal: "border-teal-200 bg-teal-50 text-teal-900",
};

const iconToneClassMap: Record<AdminStatCardTone, string> = {
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  indigo: "bg-indigo-100 text-indigo-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  emerald: "bg-emerald-100 text-emerald-700",
  teal: "bg-teal-100 text-teal-700",
};

export default function AdminStatCard({
  accent,
  description,
  icon: Icon,
  label,
  tone,
  value,
}: AdminStatCardProps) {
  return (
    <article
      className={[
        "min-h-36 rounded-xl border p-4 shadow-sm",
        toneClassMap[tone],
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600">
          {label}
        </p>
        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            iconToneClassMap[tone],
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-6 text-2xl font-bold">{value}</p>
      <p className="mt-2 text-xs font-medium text-slate-600">{description}</p>
      {accent && <p className="mt-2 text-xs font-semibold">{accent}</p>}
    </article>
  );
}
