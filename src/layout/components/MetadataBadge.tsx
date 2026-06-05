import { TrendingUp } from "lucide-react";

const metadataBadgeToneClassNames = {
  // Generic metadata like work type uses the FPT blue.
  default:
    "border border-[#005CB9] bg-[#EEF6FF] text-[#005CB9]",
  // Taxonomy metadata like subfield uses the FPT orange.
  accent:
    "border border-[#F37021] bg-[#FFF4EC] text-[#C24E0A]",
  // Standard topic badge uses the FPT green.
  topic:
    "border border-[#00A859] bg-[#ECFFF5] text-[#007A41]",
  // Highlighted topic badge keeps the same green family in a stronger state.
  topicTrend:
    "border border-[#00A859] bg-[#00A859] text-white",
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
      ? "bg-white/20 text-white"
      : "border border-[#8DE0B7] bg-white text-[#00A859]";

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
