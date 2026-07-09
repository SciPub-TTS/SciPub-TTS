import {
  extractPathId,
  toPlainText,
} from "@/lib/resourceFormatting";
import type { RemoteOptionFilterKey } from "../types";
import type { OptionItem } from "./types";

export function shouldIncludeStableSuffix(filterKey: RemoteOptionFilterKey) {
  return (
    filterKey === "author"
    || filterKey === "institution"
    || filterKey === "primaryTopic"
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
    const sanitizedLabel = toPlainText(option.label);
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

    const stableSuffix = extractPathId(optionValue);
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
