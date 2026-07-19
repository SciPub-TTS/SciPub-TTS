export function formatCitationCount(count: number | null | undefined): string {
  if (count == null) return "-";
  return count.toLocaleString("en-US");
}

export function formatSavedAt(isoDate: string): string {
  const now = new Date();
  const saved = new Date(isoDate);
  const diffMs = now.getTime() - saved.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return "Saved just now";
  if (diffMinutes < 60) {
    return `Saved ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  }
  if (diffHours < 24) {
    return `Saved ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  if (diffDays === 1) return "Saved yesterday";
  if (diffDays < 7) return `Saved ${diffDays} days ago`;
  if (diffWeeks === 1) return "Saved last week";
  if (diffWeeks < 4) return `Saved ${diffWeeks} weeks ago`;
  if (diffMonths === 1) return "Saved last month";
  if (diffMonths < 12) return `Saved ${diffMonths} months ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return `Saved ${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

export function formatAuthors(
  authors: string | null | undefined,
  maxLength = 30,
): string {
  if (!authors) return "-";
  if (authors.length <= maxLength) return authors;
  return `${authors.slice(0, maxLength).trimEnd()}...`;
}
