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
  keyword:
    "border border-black bg-white text-black",
  // Weekly trending badges now use a stronger green signal palette.
  topicTrend:
    "border border-[#15803D] bg-[linear-gradient(135deg,#F0FDF4_0%,#BBF7D0_42%,#4ADE80_100%)] text-[#166534] shadow-[0_10px_24px_rgba(34,197,94,0.24)]",
  keywordTrend:
    "border border-[#EA580C] bg-[linear-gradient(135deg,#FFF1F2_0%,#FED7AA_42%,#FB923C_100%)] text-[#7C2D12] shadow-[0_10px_24px_rgba(234,88,12,0.2)]",
} as const;

type MetadataBadgeTone = keyof typeof metadataBadgeToneClassNames;

type MetadataBadgeProps = {
  label: string;
  tone?: MetadataBadgeTone;
  showTrendIcon?: boolean;
};

export default function MetadataBadge({
  label,
  tone = "default",
  showTrendIcon = false,
}: MetadataBadgeProps) {
  const toneClassName = metadataBadgeToneClassNames[tone];
  const topicIconClassName =
    tone === "topicTrend" || tone === "keywordTrend"
      ? tone === "keywordTrend"
        ? "border border-white/40 bg-white/70 text-[#C2410C]"
        : "border border-white/45 bg-white/75 text-[#15803D]"
      : "border border-[#8DE0B7] bg-white text-[#00A859]";

  return (
    <span
      className={[
        "inline-flex min-h-8 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.01em]",
        toneClassName,
      ].join(" ")}
    >
      {showTrendIcon ? (
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
