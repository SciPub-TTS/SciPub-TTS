import { SlidersHorizontal, X } from "lucide-react";

import type {
  FeedExactMatchFilter,
  FeedTabKey,
  FollowedAuthor,
  FollowedTopic,
} from "../types";

type FeedExactMatchFilterProps = {
  activeTab: FeedTabKey;
  authors: FollowedAuthor[];
  selectedMatch: FeedExactMatchFilter | null;
  topics: FollowedTopic[];
  onMatchChange: (match: FeedExactMatchFilter | null) => void;
};

const EMPTY_VALUE = "";

export function FeedExactMatchFilter({
  activeTab,
  authors,
  selectedMatch,
  topics,
  onMatchChange,
}: FeedExactMatchFilterProps) {
  const availableAuthors = activeTab === "matched-topic" ? [] : authors;
  const availableTopics = activeTab === "matched-author" ? [] : topics;
  const hasOptions = availableAuthors.length > 0 || availableTopics.length > 0;
  const selectedValue = selectedMatch
    ? `${selectedMatch.type}:${selectedMatch.id}`
    : EMPTY_VALUE;

  function handleSelectChange(value: string) {
    if (!value) {
      onMatchChange(null);
      return;
    }

    const [type, ...idParts] = value.split(":");
    const id = idParts.join(":");
    const sourceItems = type === "AUTHOR" ? authors : topics;
    const sourceItem = sourceItems.find((item) => item.id === id);

    if (!sourceItem || (type !== "AUTHOR" && type !== "TOPIC")) {
      onMatchChange(null);
      return;
    }

    onMatchChange({
      id: sourceItem.id,
      name: sourceItem.name,
      type,
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-black">
        <SlidersHorizontal className="h-4 w-4 shrink-0" />
        <span className="shrink-0">Exact match</span>
        <select
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-600"
          disabled={!hasOptions}
          value={selectedValue}
          onChange={(event) => handleSelectChange(event.target.value)}
        >
          <option value={EMPTY_VALUE}>All reasons</option>
          {availableAuthors.length > 0 ? (
            <optgroup label="Authors">
              {availableAuthors.map((author) => (
                <option key={`AUTHOR:${author.id}`} value={`AUTHOR:${author.id}`}>
                  {author.name}
                </option>
              ))}
            </optgroup>
          ) : null}
          {availableTopics.length > 0 ? (
            <optgroup label="Topics">
              {availableTopics.map((topic) => (
                <option key={`TOPIC:${topic.id}`} value={`TOPIC:${topic.id}`}>
                  {topic.name}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </label>

      {selectedMatch ? (
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-black bg-white px-3 py-2 text-xs font-bold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
          type="button"
          onClick={() => onMatchChange(null)}
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      ) : null}
    </div>
  );
}
