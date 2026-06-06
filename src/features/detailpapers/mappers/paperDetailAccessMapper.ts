import type {
  OpenAlexWorkDetailApi,
  PaperDetailSummaryItem,
} from "../types";
import {
  formatAvailabilityLabel,
  formatCurrency,
  formatLicenseLabel,
  formatOpenAccessStatus,
  formatTypeLabel,
} from "./paperDetailShared";

export function buildAccessItems(
  work: OpenAlexWorkDetailApi,
  normalizedSourceName: string,
) {
  const items: PaperDetailSummaryItem[] = [];

  addSummaryItem(
    items,
    "OA status",
    formatOpenAccessStatus(work.open_access?.oa_status || null),
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
    formatAvailabilityLabel(
      Boolean(work.open_access?.any_repository_has_fulltext),
    ),
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

export function resolveWorkPdfUrl(work: OpenAlexWorkDetailApi) {
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
