import type { RemoteOptionFilterKey } from "../types";
import type { OptionItem } from "./types";

export function shouldIncludeStableSuffix(filterKey: RemoteOptionFilterKey) {
  return (
    filterKey === "author"
    || filterKey === "institution"
    || filterKey === "source"
    || filterKey === "award"
  );
}

export function mapOptionsToLabels(
  options: OptionItem[],
  includeStableSuffix: boolean,
) {
  const displayOptions = buildDisplayOptions(options, includeStableSuffix);
  const labels: string[] = [];

  for (const option of displayOptions) {
    if (option.value) {
      labels.push(option.label);
    }
  }

  return labels;
}

export function mapOptionsToValueLookup(
  options: OptionItem[],
  includeStableSuffix: boolean,
) {
  const displayOptions = buildDisplayOptions(options, includeStableSuffix);
  const lookup: Record<string, string> = {};

  for (const option of displayOptions) {
    if (!option.value) {
      continue;
    }

    lookup[option.label] = option.value;
  }

  return lookup;
}

export function mergeUniqueStrings(existing: string[], incoming: string[]) {
  const seen = new Set(existing);
  const merged = [...existing];

  for (const value of incoming) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    merged.push(value);
  }

  return merged;
}

function buildDisplayOptions(
  options: OptionItem[],
  includeStableSuffix: boolean,
) {
  const duplicatedLabelSet = new Set<string>();
  const labelCountMap: Record<string, number> = {};

  for (const option of options) {
    labelCountMap[option.label] = (labelCountMap[option.label] || 0) + 1;
  }

  for (const [label, count] of Object.entries(labelCountMap)) {
    if (count > 1) {
      duplicatedLabelSet.add(label);
    }
  }

  const displayOptions: OptionItem[] = [];

  for (const option of options) {
    const sanitizedLabel = sanitizePlainText(option.label);
    const optionValue = resolveOptionValue(option);

    if (!optionValue) {
      displayOptions.push({
        ...option,
        label: sanitizedLabel,
        value: "",
      });
      continue;
    }

    if (!includeStableSuffix || !duplicatedLabelSet.has(option.label)) {
      displayOptions.push({
        ...option,
        label: sanitizedLabel,
        value: optionValue,
      });
      continue;
    }

    const stableSuffix = extractLastSegment(optionValue);
    displayOptions.push({
      ...option,
      value: optionValue,
      label: `${sanitizedLabel} (${stableSuffix})`,
    });
  }

  return displayOptions;
}

function resolveOptionValue(option: OptionItem) {
  return option.value || option.id || "";
}

function extractLastSegment(value: string) {
  const lastSlashIndex = value.lastIndexOf("/");

  if (lastSlashIndex === -1 || lastSlashIndex === value.length - 1) {
    return value;
  }

  return value.slice(lastSlashIndex + 1);
}

let htmlEntityDecoder: HTMLTextAreaElement | null = null;

function sanitizePlainText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const decodedText = decodeHtmlEntities(value);
  const withoutHtmlTags = decodedText.replace(/<[^>]*>/g, " ");

  return withoutHtmlTags.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string) {
  if (!value.includes("&")) {
    return value;
  }

  if (typeof document === "undefined") {
    return value;
  }

  if (!htmlEntityDecoder) {
    htmlEntityDecoder = document.createElement("textarea");
  }

  htmlEntityDecoder.innerHTML = value;
  return htmlEntityDecoder.value;
}
