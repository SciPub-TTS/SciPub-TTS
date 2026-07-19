import { buildSocialAvatarUrl, getAuthorInitials } from "@/features/social/utils/socialFormatters";

export function SocialAvatar({
  avatarUrl,
  fullName,
  seed,
  sizeClassName,
}: {
  avatarUrl?: string | null;
  fullName: string;
  seed: string;
  sizeClassName: string;
}) {
  const resolvedAvatarUrl = avatarUrl?.trim() || buildSocialAvatarUrl(seed);
  const initials = getAuthorInitials(fullName) || "U";

  if (!resolvedAvatarUrl) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#14532D] text-sm font-semibold text-white ${sizeClassName}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-full bg-[#EEF6FF] ${sizeClassName}`}>
      <img
        src={resolvedAvatarUrl}
        alt={fullName}
        className="h-full w-full object-cover"
        onError={(event) => {
          const target = event.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLSpanElement | null;
          if (fallback) {
            fallback.style.display = "flex";
          }
        }}
      />
      <span
        className="hidden h-full w-full items-center justify-center bg-[#14532D] text-sm font-semibold text-white"
      >
        {initials}
      </span>
    </div>
  );
}
