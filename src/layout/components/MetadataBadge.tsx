import { TrendingUp } from "lucide-react";

const metadataBadgeToneClassNames = {
  // Generic metadata like work type.
  default:
    "border border-black bg-white text-black shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
  // Taxonomy metadata like subfield.
  accent:
    "border border-blue-700 bg-gradient-to-b from-blue-50 to-blue-100/80 text-blue-800 shadow-[0_1px_2px_rgba(59,130,246,0.12)]",
  // Standard topic badge when the topic is not trending.
  topic:
    "border border-emerald-700 bg-gradient-to-b from-emerald-50 to-lime-50 text-emerald-900 shadow-[0_1px_2px_rgba(16,185,129,0.12)]",
  // Highlighted topic badge for trending topics.
  topicTrend:
    "border border-emerald-700 bg-emerald-800 text-white shadow-[0_2px_8px_rgba(6,95,70,0.18)]",
} as const;

type MetadataBadgeTone = keyof typeof metadataBadgeToneClassNames;

type MetadataBadgeProps = {
  label: string;
  tone?: MetadataBadgeTone;
};

export default function MetadataBadge({
  label,
  tone = "default",
}: MetadataBadgeProps) {
  const toneClassName = metadataBadgeToneClassNames[tone];
  const showTopicIcon = tone === "topic" || tone === "topicTrend";
  const topicIconClassName =
    tone === "topicTrend"
      ? "bg-amber-200 text-emerald-900"
      : "border border-emerald-200 bg-white/80 text-emerald-700";

  return (
    <span
      className={[
        "inline-flex min-h-8 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.01em]",
        toneClassName,
      ].join(" ")}
    >
      {showTopicIcon ? (
        <span
          className={[
            "inline-flex h-5 w-5 items-center justify-center rounded-full",
            topicIconClassName,
          ].join(" ")}
        >
          <TrendingUp className="h-3.5 w-3.5" />
        </span>
      ) : null}
      {label}
    </span>
  );
}
