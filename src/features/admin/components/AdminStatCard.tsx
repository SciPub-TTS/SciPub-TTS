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
  label: string;
  tone: AdminStatCardTone;
  value: string;
};

const toneClassMap: Record<AdminStatCardTone, string> = {
  blue: "border-black bg-blue-50 text-blue-900",
  amber: "border-black bg-amber-50 text-amber-900",
  red: "border-black bg-red-50 text-red-900",
  indigo: "border-black bg-indigo-50 text-indigo-900",
  purple: "border-black bg-purple-50 text-purple-900",
  green: "border-black bg-green-50 text-green-900",
  emerald: "border-black bg-emerald-50 text-emerald-900",
  teal: "border-black bg-teal-50 text-teal-900",
};

export default function AdminStatCard({
  label,
  tone,
  value,
}: AdminStatCardProps) {
  return (
    <article
      className={[
        "min-h-28 rounded-xl border p-4 shadow-sm",
        toneClassMap[tone],
      ].join(" ")}
    >
      <p className="font-subtext text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>
      <p className="font-title mt-6 text-2xl font-bold">{value}</p>
    </article>
  );
}
