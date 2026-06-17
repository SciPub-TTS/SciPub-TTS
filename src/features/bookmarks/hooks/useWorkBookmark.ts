import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { bookmarkApi } from "@/features/bookmarks/services/bookmark.api";
import { bookmarkQueryKeys } from "@/features/bookmarks/services/bookmarkQueryKeys";
import type {
  BookmarkStatusResponse,
  CreateBookmarkRequest,
} from "@/features/bookmarks/types/bookmark.types";

const BOOKMARK_FEEDBACK_RESET_MS = 2600;

type UseWorkBookmarkOptions = {
  authors: string[];
  citations?: number | null;
  initialSaved?: boolean;
  openAlexId: string;
  source?: string | null;
  title?: string | null;
  topic?: string | null;
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

function buildAuthorsSnapshot(authors: string[]) {
  const normalizedAuthors = authors
    .map((author) => author.trim())
    .filter((author) => author.length > 0);

  return normalizedAuthors.length > 0
    ? normalizedAuthors.join(", ")
    : undefined;
}

function createBookmarkStatus(
  openAlexId: string,
  isSaved: boolean,
  bookmarkId: string | null,
): BookmarkStatusResponse {
  return {
    bookmarked: isSaved,
    bookmarkId,
    openAlexId,
  };
}

export function useWorkBookmark(options: UseWorkBookmarkOptions) {
  const {
    authors,
    citations,
    initialSaved = false,
    openAlexId,
    onSuccess,
    source,
    title,
    topic,
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
    mutationFn: async () => {
      if (!normalizedOpenAlexId) {
        throw new Error("OpenAlex ID is missing.");
      }

      if (isSaved) {
        await bookmarkApi.deleteByOpenAlexId(normalizedOpenAlexId);

        return createBookmarkStatus(normalizedOpenAlexId, false, null);
      }

      const payload: CreateBookmarkRequest = {
        authorsSnapshot: buildAuthorsSnapshot(authors),
        citationSnapshot:
          typeof citations === "number" && Number.isFinite(citations)
            ? citations
            : undefined,
        openAlexId: normalizedOpenAlexId,
        publicationYear:
          typeof year === "number" && Number.isFinite(year) ? year : undefined,
        sourceSnapshot: normalizeOptionalSnapshotValue(source),
        titleSnapshot: normalizeOptionalSnapshotValue(title),
        topicSnapshot: normalizeOptionalSnapshotValue(topic),
      };
      const response = await bookmarkApi.add(payload);

      return createBookmarkStatus(
        normalizedOpenAlexId,
        true,
        response.data.id,
      );
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
      void queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.stats(),
      });
      void queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.filterOptions(),
      });
      setFeedbackLabel(null);
      onSuccess?.(nextStatus.bookmarked);
    },
  });

  async function handleBookmarkClick() {
    if (bookmarkMutation.isPending) {
      return;
    }

    try {
      await bookmarkMutation.mutateAsync();
    } catch {
      // React Query already routes the UI feedback through onError.
    }
  }

  const buttonLabel = bookmarkMutation.isPending
    ? isSaved
      ? "Removing..."
      : "Saving..."
    : feedbackLabel || (isSaved ? "Saved" : "Bookmark");

  return {
    bookmarkButtonLabel: buttonLabel,
    handleBookmarkClick,
    isBookmarkActionPending: bookmarkMutation.isPending,
    isSaved,
  };
}
