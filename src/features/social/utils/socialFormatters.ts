import { DICEBEAR_ADVENTURER_AVATAR_URL } from "@/lib/avatar";

export function getAuthorInitials(fullName?: string | null) {
  if (!fullName) {
    return "U";
  }

  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function buildSocialAvatarUrl(seed?: string | null) {
  const normalizedSeed = String(seed ?? "").trim();

  if (!normalizedSeed) {
    return null;
  }

  return DICEBEAR_ADVENTURER_AVATAR_URL + "?seed=" + encodeURIComponent(normalizedSeed);
}

export function getDisplayTime(createdAt: string, updatedAt?: string | null) {
  return updatedAt ?? createdAt;
}

export function formatPostedAt(createdAt: string, updatedAt?: string | null) {
  const displayTime = getDisplayTime(createdAt, updatedAt);
  const createdTime = new Date(displayTime).getTime();

  if (Number.isNaN(createdTime)) {
    return "Recently";
  }

  const differenceInMilliseconds = Date.now() - createdTime;
  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60),
  );

  if (differenceInHours < 1) {
    return "Just now";
  }

  if (differenceInHours < 24) {
    return differenceInHours + "h ago";
  }

  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays < 7) {
    return differenceInDays + "d ago";
  }

  return new Date(displayTime).toLocaleDateString();
}

export function normalizeTags(tags: string[] | null | undefined) {
  if (!tags) {
    return [];
  }

  return tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
}

export function normalizeReferenceEntityId(value: string | null | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  const segments = normalizedValue.split("/");
  return segments[segments.length - 1].toUpperCase();
}

export function normalizeTopicLabel(topic: string | null | undefined) {
  const normalizedTopic = topic?.trim();
  return normalizedTopic ? normalizedTopic : null;
}

export function normalizeSocialOpenAlexId(openAlexId: string | null | undefined) {
  const trimmedId = openAlexId?.trim();

  if (!trimmedId) {
    return "";
  }

  const lastSegment = trimmedId.split("/").filter(Boolean).pop() ?? trimmedId;
  return lastSegment.toUpperCase();
}
