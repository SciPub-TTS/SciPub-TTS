import { getAccessToken } from "@/features/auth/utils/authStorage";
import { formatFullNumber } from "@/features/search/utils";

import type {
  OpenAlexAbstractInvertedIndex,
  OpenAlexAuthorship,
  OpenAlexWorkDetailApi,
  PaperDetailBadge,
  PaperDetailAuthor,
  PaperDetailData,
  PaperDetailInstitution,
  PaperDetailMetric,
  PaperDetailQuickLink,
  PaperDetailSummaryItem,
  ResponseEnvelope,
} from "../types";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");

const languageDisplayNames = new Intl.DisplayNames(["en"], {
  type: "language",
});

export async function getPaperDetail(paperId: string): Promise<PaperDetailData> {
  const normalizedPaperId = paperId.trim();
  if (!normalizedPaperId) {
    throw new Error("Paper ID is missing.");
  }

  const endpoint = `${apiBaseUrl}/api/papers/${encodeURIComponent(normalizedPaperId)}`;
  const data = await requestData<OpenAlexWorkDetailApi>(endpoint);

  return mapWorkDetailToPaperDetail(data);
}

async function requestData<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  const accessToken = getAccessToken();
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  let envelope: ResponseEnvelope<T>;

  try {
    envelope = (await response.json()) as ResponseEnvelope<T>;
  } catch {
    throw new Error(`Request failed (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(envelope.message || `Request failed (${response.status})`);
  }

  return envelope.data;
}

function mapWorkDetailToPaperDetail(
  work: OpenAlexWorkDetailApi,
): PaperDetailData {
  const normalizedTitle = work.title?.trim() || "Untitled work";
  // Prefer the canonical work type so detail stays consistent with search results.
  const normalizedType = formatTypeLabel(
    work.type || work.primary_location?.raw_type || "work",
  );
  const normalizedSourceName =
    work.primary_location?.source?.display_name?.trim() || "Unknown source";
  const normalizedSourceType = formatTypeLabel(
    work.primary_location?.source?.type || "source",
  );
  const abstractText =
    reconstructAbstractText(work.abstract_inverted_index) ||
    "No abstract available.";
  const authors = mapAuthors(work.authorships);
  const institutions = mapInstitutions(work.authorships);
  const publishedLabel = formatPublishedLabel(
    work.publication_year,
    work.publication_date,
  );
  const languageLabel = formatLanguageLabel(work.language);
  const doiLabel = normalizeIdentifierLabel(work.doi);
  const doiHref = work.doi?.trim() || null;
  const headerBadges = buildHeaderBadges(work, normalizedType);
  const accessItems = buildAccessItems(work, normalizedSourceName);
  const metrics = buildMetrics(work, authors.length, institutions.length);
  const quickLinks = buildQuickLinks(work);
  const pdfUrl = resolveWorkPdfUrl(work);
  const keywords = work.keywords
    .map((keyword) => keyword.display_name?.trim() || "")
    .filter(Boolean)
    .slice(0, 8);

  return {
    abstractText,
    accessItems,
    authors,
    doiHref,
    doiLabel,
    headerBadges,
    indexedIn: work.indexed_in,
    institutions,
    keywords,
    languageLabel,
    metrics,
    pdfUrl,
    publishedLabel,
    quickLinks,
    sourceHostOrganization:
      work.primary_location?.source?.host_organization_name?.trim() || null,
    sourceName: normalizedSourceName,
    sourceType: normalizedSourceType,
    title: normalizedTitle,
  };
}

function buildHeaderBadges(work: OpenAlexWorkDetailApi, normalizedType: string) {
  const badges: PaperDetailBadge[] = [];
  const subFieldName = work.primary_topic?.subfield?.display_name?.trim();
  const topicName = work.primary_topic?.display_name?.trim();

  if (subFieldName) {
    badges.push({
      label: subFieldName,
      tone: "accent",
    });
  }

  if (topicName) {
    badges.push({
      label: topicName,
      tone: "topic",
    });
  }

  badges.push({
    label: normalizedType,
    tone: "default",
  });

  return badges;
}

function buildAccessItems(
  work: OpenAlexWorkDetailApi,
  normalizedSourceName: string,
): PaperDetailSummaryItem[] {
  const items: PaperDetailSummaryItem[] = [];

  addSummaryItem(
    items,
    "OA status",
    formatOpenAccessStatus(work.open_access?.oa_status || null),
  );
  addSummaryItem(
    items,
    "OA URL",
    normalizeIdentifierLabel(work.open_access?.oa_url || null),
    work.open_access?.oa_url || undefined,
  );
  addSummaryItem(items, "Best OA source", normalizedSourceName);
  addSummaryItem(
    items,
    "License",
    formatLicenseLabel(work.best_oa_location?.license || null),
  );
  addSummaryItem(
    items,
    "Version",
    formatTypeLabel(work.best_oa_location?.version || ""),
  );
  addSummaryItem(
    items,
    "Full text",
    formatAvailabilityLabel(Boolean(work.open_access?.any_repository_has_fulltext)),
  );
  addSummaryItem(
    items,
    "PDF",
    formatAvailabilityLabel(
      Boolean(work.has_content?.pdf || work.best_oa_location?.pdf_url),
    ),
  );
  addSummaryItem(
    items,
    "TEI XML",
    formatAvailabilityLabel(Boolean(work.has_content?.grobid_xml)),
  );
  addSummaryItem(
    items,
    "APC list",
    formatCurrency(work.apc_list?.value, work.apc_list?.currency),
  );
  addSummaryItem(
    items,
    "APC paid",
    formatCurrency(work.apc_paid?.value, work.apc_paid?.currency),
  );
  addSummaryItem(items, "Retracted", work.is_retracted ? "Yes" : "No");

  return items;
}

function buildMetrics(
  work: OpenAlexWorkDetailApi,
  authorCount: number,
  institutionCount: number,
): PaperDetailMetric[] {
  const percentile = work.citation_normalized_percentile;
  const metrics: PaperDetailMetric[] = [
    {
      label: "FWCI",
      value: formatDecimalValue(work.fwci),
      tone: work.fwci !== null && work.fwci >= 1 ? "positive" : "default",
    },
    {
      label: "Citations",
      value: formatFullNumber(work.cited_by_count || 0),
    },
    {
      label: "Citation percentile",
      value: formatCitationPercentile(percentile?.value),
      tone:
        percentile?.is_in_top_10_percent || percentile?.is_in_top_1_percent
          ? "positive"
          : "default",
    },
    {
      label: "Referenced works",
      value: formatFullNumber(work.referenced_works_count || 0),
    },
    {
      label: "Related works",
      value: formatFullNumber(work.related_works.length),
    },
    {
      label: "Locations",
      value: formatFullNumber(work.locations_count || 0),
    },
    {
      label: "Authors",
      value: formatFullNumber(authorCount),
    },
    {
      label: "Institutions",
      value: formatFullNumber(institutionCount),
    },
  ];

  return metrics.filter((metric) => metric.value.trim().length > 0);
}

function buildQuickLinks(work: OpenAlexWorkDetailApi): PaperDetailQuickLink[] {
  const links: PaperDetailQuickLink[] = [];

  addQuickLink(links, "DOI", work.doi);
  addQuickLink(links, "OpenAlex", work.ids?.openalex || work.id);
  addQuickLink(links, "PubMed", normalizePubmedUrl(work.ids?.pmid));
  addQuickLink(
    links,
    "View Source",
    work.primary_location?.landing_page_url ||
      work.best_oa_location?.landing_page_url ||
      null,
  );
  addQuickLink(links, "Open Access Link", work.open_access?.oa_url || null);

  return links;
}

function resolveWorkPdfUrl(work: OpenAlexWorkDetailApi) {
  const candidateUrls = [
    work.best_oa_location?.pdf_url,
    work.primary_location?.pdf_url,
    work.content_urls?.pdf,
  ];

  for (const candidateUrl of candidateUrls) {
    if (candidateUrl?.trim()) {
      return candidateUrl.trim();
    }
  }

  return null;
}

function mapAuthors(authorships: OpenAlexAuthorship[]) {
  const authors: PaperDetailAuthor[] = [];

  for (let index = 0; index < authorships.length; index += 1) {
    const authorship = authorships[index];
    const authorName =
      authorship.author?.display_name?.trim() ||
      authorship.raw_author_name?.trim() ||
      "";

    if (!authorName) {
      continue;
    }

    const authorIdentifier =
      authorship.author?.id?.trim() ||
      authorship.author?.orcid?.trim() ||
      `author-${index + 1}-${authorName}`;

    authors.push({
      id: extractLastSegment(authorIdentifier),
      isCorresponding: Boolean(authorship.is_corresponding),
      isFollowed: false,
      name: authorName,
      orcid: authorship.author?.orcid || null,
      position: authorship.author_position,
    });
  }

  return authors;
}

function mapInstitutions(authorships: OpenAlexAuthorship[]) {
  const uniqueInstitutionMap = new Map<string, PaperDetailInstitution>();

  for (const authorship of authorships) {
    for (const institution of authorship.institutions || []) {
      if (!institution.id || !institution.display_name?.trim()) {
        continue;
      }

      if (!uniqueInstitutionMap.has(institution.id)) {
        uniqueInstitutionMap.set(institution.id, {
          countryCode: institution.country_code,
          id: extractLastSegment(institution.id),
          name: institution.display_name.trim(),
          type: institution.type,
        });
      }
    }
  }

  return [...uniqueInstitutionMap.values()];
}

function addSummaryItem(
  items: PaperDetailSummaryItem[],
  label: string,
  value: string,
  href?: string,
) {
  if (!value.trim()) {
    return;
  }

  items.push({ href, label, value });
}

function addQuickLink(
  links: PaperDetailQuickLink[],
  label: string,
  href: string | null | undefined,
) {
  const normalizedHref = href?.trim();

  if (!normalizedHref) {
    return;
  }

  links.push({
    href: normalizedHref,
    label,
    value: formatHostnameLabel(normalizedHref),
  });
}

function reconstructAbstractText(
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

function formatTypeLabel(value: string) {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return "";
  }

  return normalizedValue
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatLanguageLabel(languageCode: string | null) {
  if (!languageCode?.trim()) {
    return "";
  }

  return languageDisplayNames.of(languageCode) || languageCode.toUpperCase();
}

function formatPublishedLabel(
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

function normalizeIdentifierLabel(value: string | null) {
  if (!value?.trim()) {
    return "";
  }

  return value
    .replace(/^https?:\/\/doi\.org\//i, "")
    .replace(/^https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//i, "")
    .replace(/^https?:\/\/openalex\.org\//i, "");
}

function normalizePubmedUrl(value: string | null | undefined) {
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

function formatOpenAccessStatus(status: string | null) {
  if (!status?.trim()) {
    return "";
  }

  return `${status.toUpperCase()} OA`;
}

function formatLicenseLabel(license: string | null) {
  if (!license?.trim()) {
    return "";
  }

  return license.toUpperCase();
}

function formatAvailabilityLabel(isAvailable: boolean) {
  return isAvailable ? "Available" : "Not available";
}

function formatCurrency(
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

function formatHostnameLabel(value: string) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./i, "");
    return hostname || value;
  } catch {
    return value;
  }
}
function extractLastSegment(value: string) {
  const normalizedValue = value.trim();
  const lastSlashIndex = normalizedValue.lastIndexOf("/");

  if (lastSlashIndex === -1 || lastSlashIndex === normalizedValue.length - 1) {
    return normalizedValue;
  }

  return normalizedValue.slice(lastSlashIndex + 1);
}
function formatDecimalValue(value: number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCitationPercentile(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}
