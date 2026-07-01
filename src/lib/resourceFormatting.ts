let htmlEntityDecoder: HTMLTextAreaElement | null = null;

export function trimToEmpty(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export function trimToNull(value: string | null | undefined) {
  const normalizedValue = trimToEmpty(value);
  return normalizedValue || null;
}

export function toPlainText(value: string | null | undefined) {
  const normalizedValue = trimToEmpty(value);

  if (!normalizedValue) {
    return "";
  }

  const decodedText = decodeHtmlEntities(normalizedValue);
  const withoutHtmlTags = decodedText.replace(/<[^>]*>/g, " ");

  return withoutHtmlTags.replace(/\s+/g, " ").trim();
}

export function toOptionalPlainText(value: string | null | undefined) {
  const normalizedValue = toPlainText(value);
  return normalizedValue || null;
}

export function extractPathId(value: string | null | undefined) {
  const normalizedValue = trimToEmpty(value);

  if (!normalizedValue) {
    return "";
  }

  const segments = normalizedValue.split("/").filter(Boolean);
  return segments[segments.length - 1] || normalizedValue;
}

export function normalizeIdentifierLabel(value: string | null | undefined) {
  const normalizedValue = trimToEmpty(value);

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue
    .replace(/^https?:\/\/doi\.org\//i, "")
    .replace(/^https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//i, "")
    .replace(/^https?:\/\/openalex\.org\//i, "");
}

export function normalizePubmedUrl(value: string | null | undefined) {
  const normalizedValue = trimToEmpty(value);

  if (!normalizedValue) {
    return "";
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue;
  }

  const pubmedId = normalizedValue.replace(/^pmid:/i, "").trim();
  return pubmedId ? `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}` : "";
}

export function normalizeDoiValue(value: string | null | undefined) {
  const normalizedValue = trimToEmpty(value);

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue.replace(/^https?:\/\//i, "");
}

function decodeHtmlEntities(value: string) {
  if (!value.includes("&") || typeof document === "undefined") {
    return value;
  }

  if (!htmlEntityDecoder) {
    htmlEntityDecoder = document.createElement("textarea");
  }

  htmlEntityDecoder.innerHTML = value;
  return htmlEntityDecoder.value;
}
