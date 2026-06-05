import type { OpenAlexAbstractInvertedIndex } from "../types";

const languageDisplayNames = new Intl.DisplayNames(["en"], {
  type: "language",
});

export function reconstructAbstractText(
  abstractInvertedIndex: OpenAlexAbstractInvertedIndex | null,
) {
  if (!abstractInvertedIndex) {
    return "";
  }

  const orderedTokens: string[] = [];

  for (const [token, positions] of Object.entries(abstractInvertedIndex)) {
    for (const position of positions) {
      orderedTokens[position] = token;
    }
  }

  return orderedTokens.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export function formatTypeLabel(value: string) {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return "";
  }

  return normalizedValue
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatLanguageLabel(languageCode: string | null) {
  if (!languageCode?.trim()) {
    return "";
  }

  return languageDisplayNames.of(languageCode) || languageCode.toUpperCase();
}

export function formatPublishedLabel(
  publicationYear: number | null,
  publicationDate: string | null,
) {
  if (publicationYear) {
    return `Published ${publicationYear}`;
  }

  if (publicationDate?.trim()) {
    const date = new Date(publicationDate);
    if (!Number.isNaN(date.getTime())) {
      return `Published ${date.getFullYear()}`;
    }
  }

  return "";
}

export function normalizeIdentifierLabel(value: string | null) {
  if (!value?.trim()) {
    return "";
  }

  return value
    .replace(/^https?:\/\/doi\.org\//i, "")
    .replace(/^https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//i, "")
    .replace(/^https?:\/\/openalex\.org\//i, "");
}

export function normalizePubmedUrl(value: string | null | undefined) {
  if (!value?.trim()) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedValue = value.replace(/^pmid:/i, "").trim();

  if (!normalizedValue) {
    return "";
  }

  return `https://pubmed.ncbi.nlm.nih.gov/${normalizedValue}`;
}

export function formatOpenAccessStatus(status: string | null) {
  if (!status?.trim()) {
    return "";
  }

  return `${status.toUpperCase()} OA`;
}

export function formatLicenseLabel(license: string | null) {
  if (!license?.trim()) {
    return "";
  }

  return license.toUpperCase();
}

export function formatAvailabilityLabel(isAvailable: boolean) {
  return isAvailable ? "Available" : "Not available";
}

export function formatCurrency(
  value: number | null | undefined,
  currency: string | null | undefined,
) {
  if (value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    currency: currency || "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatHostnameLabel(value: string) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./i, "");
    return hostname || value;
  } catch {
    return value;
  }
}

export function extractLastSegment(value: string) {
  const normalizedValue = value.trim();
  const lastSlashIndex = normalizedValue.lastIndexOf("/");

  if (lastSlashIndex === -1 || lastSlashIndex === normalizedValue.length - 1) {
    return normalizedValue;
  }

  return normalizedValue.slice(lastSlashIndex + 1);
}

export function formatDecimalValue(value: number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCitationPercentile(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}
