export function formatCitationCount(count: number | null | undefined): string {
  if (count == null) return "-";
  return count.toLocaleString("en-US");
}

export function formatAuthors(
  authors: string | null | undefined,
  maxLength = 30,
): string {
  if (!authors) return "-";
  if (authors.length <= maxLength) return authors;
  return `${authors.slice(0, maxLength).trimEnd()}...`;
}
