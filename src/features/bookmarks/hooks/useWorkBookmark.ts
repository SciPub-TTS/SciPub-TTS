import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import { invalidateBookmarkLibraryQueries } from "@/features/bookmarks/services/bookmarkQueryHelpers";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import type {
  BookmarkCollectionSummary,
  BookmarkStatusResponse,
  CreateBookmarkRequest,
} from "@/features/bookmarks/types/bookmark.types";

const BOOKMARK_FEEDBACK_RESET_MS = 2600;

type UseWorkBookmarkOptions = {
  authors: string[];
  authorOpenAlexIds?: Array<string | null>;
  citations?: number | null;
  initialSaved?: boolean;
  openAlexId: string;
  source?: string | null;
  title?: string | null;
  topic?: string | null;
  topicOpenAlexId?: string | null;
  workType?: string | null;
  year?: number | null;
  onSuccess?: (isSaved: boolean) => void;
};

function normalizeSnapshotValue(value: string) {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function normalizeOptionalSnapshotValue(value: string | null | undefined) {
  return normalizeSnapshotValue(value || "");
}

function normalizeOpenAlexSnapshotId(value: string | null | undefined) {
  const normalizedValue = normalizeOptionalSnapshotValue(value);

  if (!normalizedValue) {
    return undefined;
  }

  const segments = normalizedValue.split("/");
  return segments[segments.length - 1].toUpperCase();
}

function buildAuthorSnapshotPayload(
  authors: string[],
  authorOpenAlexIds: Array<string | null> = [],
) {
  const normalizedAuthors: string[] = [];
  const normalizedAuthorIds: Array<string | null> = [];

  authors.forEach((author, index) => {
    const normalizedAuthor = author.trim();

    if (normalizedAuthor.length === 0) {
      return;
    }

    normalizedAuthors.push(normalizedAuthor);
    normalizedAuthorIds.push(
      normalizeOpenAlexSnapshotId(authorOpenAlexIds[index]) ?? null,
    );
  });

  return {
    authorOpenAlexIdsSnapshot: normalizedAuthorIds.some((id) => Boolean(id))
      ? normalizedAuthorIds
      : undefined,
    authorsSnapshot:
      normalizedAuthors.length > 0
        ? normalizedAuthors.join(", ")
        : undefined,
  };
}

function buildCreateBookmarkPayload(
  options: Pick<
    UseWorkBookmarkOptions,
    | "authors"
    | "authorOpenAlexIds"
    | "citations"
    | "openAlexId"
    | "source"
    | "title"
    | "topic"
    | "topicOpenAlexId"
    | "workType"
    | "year"
  >,
): CreateBookmarkRequest {
  const authorSnapshotPayload = buildAuthorSnapshotPayload(
    options.authors,
    options.authorOpenAlexIds,
  );

  return {
    authorOpenAlexIdsSnapshot: authorSnapshotPayload.authorOpenAlexIdsSnapshot,
    authorsSnapshot: authorSnapshotPayload.authorsSnapshot,
    citationSnapshot:
      typeof options.citations === "number" && Number.isFinite(options.citations)
        ? options.citations
        : undefined,
    openAlexId: options.openAlexId.trim(),
    publicationYear:
      typeof options.year === "number" && Number.isFinite(options.year)
        ? options.year
        : undefined,
    sourceSnapshot: normalizeOptionalSnapshotValue(options.source),
    titleSnapshot: normalizeOptionalSnapshotValue(options.title),
    topicSnapshot: normalizeOptionalSnapshotValue(options.topic),
    topicOpenAlexIdSnapshot: normalizeOpenAlexSnapshotId(
      options.topicOpenAlexId,
    ),
    workTypeSnapshot: normalizeOptionalSnapshotValue(options.workType),
  };
}

function createBookmarkStatus(
  openAlexId: string,
  isSaved: boolean,
  bookmarkId: string | null,
  collections: BookmarkCollectionSummary[] = [],
): BookmarkStatusResponse {
  return {
    bookmarked: isSaved,
    bookmarkId,
    collections,
    openAlexId,
  };
}

export function useWorkBookmark(options: UseWorkBookmarkOptions) {
  const {
    authors,
    authorOpenAlexIds,
    citations,
    initialSaved = false,
    openAlexId,
    onSuccess,
    source,
    title,
    topic,
    topicOpenAlexId,
    workType,
    year,
  } = options;
  const { accessToken } = useAuthSession();
  const queryClient = useQueryClient();
  const [feedbackLabel, setFeedbackLabel] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const normalizedOpenAlexId = openAlexId.trim();
  const bookmarkStatusQueryKey = bookmarkQueryKeys.status(normalizedOpenAlexId);
  const bookmarkStatusQuery = useQuery({
    enabled: Boolean(accessToken) && normalizedOpenAlexId.length > 0,
    queryFn: async () => {
      const response = await bookmarkApi.getStatus(normalizedOpenAlexId);
      return response.data;
    },
    queryKey: bookmarkStatusQueryKey,
    retry: false,
  });
  const isSaved = bookmarkStatusQuery.data?.bookmarked ?? initialSaved;

  useEffect(
    () => () => {
      if (
        typeof window !== "undefined"
        && feedbackTimeoutRef.current !== null
      ) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    },
    [],
  );

  function resetFeedbackAfterDelay() {
    if (typeof window === "undefined") {
      return;
    }

    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedbackLabel(null);
      feedbackTimeoutRef.current = null;
    }, BOOKMARK_FEEDBACK_RESET_MS);
  }

  const bookmarkMutation = useMutation({
    mutationFn: async (targetCollectionId: string | null | undefined) => {
      if (!normalizedOpenAlexId) {
        throw new Error("OpenAlex ID is missing.");
      }

      if (isSaved) {
        await bookmarkApi.deleteByOpenAlexId(normalizedOpenAlexId);

        return createBookmarkStatus(normalizedOpenAlexId, false, null, []);
      }

      const payload = buildCreateBookmarkPayload({
        authorOpenAlexIds,
        authors,
        citations,
        openAlexId: normalizedOpenAlexId,
        source,
        title,
        topic,
        topicOpenAlexId,
        workType,
        year,
      });
      const response = await bookmarkApi.add(payload);

      if (targetCollectionId && response.data.id) {
        await bookmarkApi.addToCollection(targetCollectionId, {
          bookmarkIds: [response.data.id],
        });
      }

      const statusResponse = await bookmarkApi.getStatus(normalizedOpenAlexId);
      return statusResponse.data;
    },
    onError: (error) => {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        setFeedbackLabel("Sign in first");
      } else {
        setFeedbackLabel(getApiErrorMessage(error, "Try again"));
      }

      resetFeedbackAfterDelay();
    },
    onSuccess: (nextStatus) => {
      queryClient.setQueryData(bookmarkStatusQueryKey, nextStatus);
      void invalidateBookmarkLibraryQueries(queryClient);
      setFeedbackLabel(null);
      onSuccess?.(nextStatus.bookmarked);
    },
  });

  async function handleBookmarkClick(targetCollectionId?: string | null) {
    if (bookmarkMutation.isPending) {
      return false;
    }

    try {
      await bookmarkMutation.mutateAsync(targetCollectionId ?? null);
      return true;
    } catch {
      // React Query already routes the UI feedback through onError.
      return false;
    }
  }

  const buttonLabel = bookmarkMutation.isPending
    ? isSaved
      ? "Removing..."
      : "Saving..."
    : feedbackLabel || (isSaved ? "Saved" : "Bookmark");

  return {
    bookmarkButtonLabel: buttonLabel,
    collections: bookmarkStatusQuery.data?.collections ?? [],
    handleBookmarkClick,
    isBookmarkActionPending: bookmarkMutation.isPending,
    isSaved,
  };
}
