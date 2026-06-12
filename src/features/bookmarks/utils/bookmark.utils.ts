/**
 * Format số citation: 12481 → "12,481"
 */
export function formatCitationCount(count: number | null | undefined): string {
    if (count == null) return "—";
    return count.toLocaleString("en-US");
}

/**
 * Format thời gian lưu bookmark dạng relative
 * "Saved 2 days ago" / "Saved last month" / "Saved just now"
 */
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
    if (diffMinutes < 60) return `Saved ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `Saved ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Saved yesterday";
    if (diffDays < 7) return `Saved ${diffDays} days ago`;
    if (diffWeeks === 1) return "Saved last week";
    if (diffWeeks < 4) return `Saved ${diffWeeks} weeks ago`;
    if (diffMonths === 1) return "Saved last month";
    if (diffMonths < 12) return `Saved ${diffMonths} months ago`;
    return `Saved ${Math.floor(diffMonths / 12)} year${Math.floor(diffMonths / 12) > 1 ? "s" : ""} ago`;
}

/**
 * Truncate authors list: "Park, S. · Almeida, R. · Vance, K. · ..."
 */
export function formatAuthors(authors: string | null | undefined, maxLength = 30): string {
    if (!authors) return "—";
    if (authors.length <= maxLength) return authors;
    return authors.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Label cho sort option
 */
export const SORT_LABELS: Record<string, string> = {
    RECENT: "Recently saved",
    OLDEST: "Oldest first",
    YEAR_DESC: "Year (newest)",
    YEAR_ASC: "Year (oldest)",
    CITATION_DESC: "Most cited",
    CITATION_ASC: "Least cited",
    TITLE_ASC: "Title A–Z",
    TITLE_DESC: "Title Z–A",
};
