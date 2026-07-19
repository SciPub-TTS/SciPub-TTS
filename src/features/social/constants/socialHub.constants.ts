import type { BlogFormState, FeedTab } from "@/features/social/types/social.types";

export const HERO_GRADIENT =
  "bg-[radial-gradient(circle_at_top_right,_rgba(163,230,53,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(0,92,185,0.12),_transparent_30%),linear-gradient(180deg,#FFFFFF_0%,#F8FCFA_100%)]";

export const SURFACE_CARD_CLASS =
  "rounded-[2rem] border border-black bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]";

export const PRIMARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-slate-400";

export const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-black bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

export const TAG_PILL_CLASS =
  "rounded-full bg-[#A3E635]/20 px-3 py-1.5 font-subtext text-sm text-[#14532D] ring-1 ring-[#059669]/40";

export const INPUT_CLASS =
  "w-full rounded-xl border border-black bg-slate-50/60 px-4 text-base text-black outline-none placeholder:text-slate-400 focus:border-[#14532D] focus:bg-white";

export const SOCIAL_TABS: { label: string; value: FeedTab }[] = [
  { label: "All Posts", value: "all" },
  { label: "My Posts", value: "my-posts" },
];

export const INITIAL_BLOG_FORM: BlogFormState = {
  title: "",
  body: "",
  selectedOpenAlexIds: [],
};

export const SOCIAL_NEWEST_QUERY_KEY = ["social", "newest"] as const;
export const SOCIAL_TOP_QUERY_KEY = ["social", "top"] as const;
export const SOCIAL_BOOKMARK_OPTIONS_PAGE_SIZE = 50;
