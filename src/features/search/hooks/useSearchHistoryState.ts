import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

import {
  SEARCH_RECENT_SEARCH_LIMIT,
} from "../constants";
import {
  clearSearchHistory,
  deleteSearchHistory,
  getRecentSearches,
  saveSearchHistory,
} from "../services";
import type { SaveSearchFeedback } from "../types";

const SEARCH_HISTORY_QUERY_DEBOUNCE_MS = 300;
const SEARCH_HISTORY_MIN_FILTER_LENGTH = 2;
const SAVE_SEARCH_FEEDBACK_DURATION_MS = 2800;

type UseSearchHistoryStateParams = {
  isSearchHistoryEnabled: boolean;
  searchQuery: string;
};

export function useSearchHistoryState(params: UseSearchHistoryStateParams) {
  const { isSearchHistoryEnabled, searchQuery } = params;
  const queryClient = useQueryClient();
  const [debouncedRecentSearchKeyword, setDebouncedRecentSearchKeyword] =
    useState("");
  const [saveSearchFeedback, setSaveSearchFeedback] =
    useState<SaveSearchFeedback | null>(null);
  const [saveSearchSuccessToken, setSaveSearchSuccessToken] = useState(0);
  const normalizedSearchQuery = searchQuery.trim();
  const recentSearchQueryKey = [
    "searchHistoryRecent",
    debouncedRecentSearchKeyword,
    SEARCH_RECENT_SEARCH_LIMIT,
  ] as const;

  const recentSearchesQuery = useQuery({
    enabled: isSearchHistoryEnabled,
    queryFn: () =>
      getRecentSearches(
        debouncedRecentSearchKeyword,
        SEARCH_RECENT_SEARCH_LIMIT,
      ),
    queryKey: recentSearchQueryKey,
    staleTime: 60 * 1000,
  });

  function refreshRecentSearches() {
    void queryClient.invalidateQueries({
      queryKey: ["searchHistoryRecent"],
    });
  }

  const saveSearchMutation = useMutation({
    mutationFn: saveSearchHistory,
    onError: (error) => {
      console.error("Cannot save search history:", error);
      setSaveSearchFeedback({
        kind: "error",
        message: getSearchMutationErrorMessage(
          error,
          "Could not save search history.",
        ),
      });
    },
    onSuccess: () => {
      setSaveSearchFeedback({
        kind: "success",
        message: "Saved successfully.",
      });
      setSaveSearchSuccessToken((currentValue) => currentValue + 1);
      refreshRecentSearches();
    },
  });

  const deleteSearchMutation = useMutation({
    mutationFn: deleteSearchHistory,
    onError: (error) => {
      console.error("Cannot delete search history item:", error);
      setSaveSearchFeedback({
        kind: "error",
        message: getSearchMutationErrorMessage(
          error,
          "Could not delete search history.",
        ),
      });
    },
    onSuccess: () => {
      setSaveSearchFeedback({
        kind: "success",
        message: "Deleted successfully.",
      });
      refreshRecentSearches();
    },
  });

  const clearSearchMutation = useMutation({
    mutationFn: clearSearchHistory,
    onError: (error) => {
      console.error("Cannot clear search history:", error);
      setSaveSearchFeedback({
        kind: "error",
        message: getSearchMutationErrorMessage(
          error,
          "Could not clear search history.",
        ),
      });
    },
    onSuccess: () => {
      setSaveSearchFeedback({
        kind: "success",
        message: "Cleared successfully.",
      });
      refreshRecentSearches();
    },
  });

  const recordSearchMutation = useMutation({
    mutationFn: saveSearchHistory,
    onError: (error) => {
      console.error("Cannot record search history:", error);
    },
    onSuccess: () => {
      refreshRecentSearches();
    },
  });

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedRecentSearchKeyword(
        normalizedSearchQuery.length >= SEARCH_HISTORY_MIN_FILTER_LENGTH
          ? normalizedSearchQuery
          : "",
      );
    }, SEARCH_HISTORY_QUERY_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [normalizedSearchQuery]);

  useEffect(() => {
    if (recentSearchesQuery.error) {
      console.error(
        "Cannot load recent search history:",
        recentSearchesQuery.error,
      );
    }
  }, [recentSearchesQuery.error]);

  useEffect(() => {
    if (!saveSearchFeedback) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSaveSearchFeedback(null);
    }, SAVE_SEARCH_FEEDBACK_DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [saveSearchFeedback]);

  function handleSaveSearch() {
    if (
      !isSearchHistoryEnabled ||
      !normalizedSearchQuery ||
      saveSearchMutation.isPending
    ) {
      return;
    }

    const hasSavedQuery = recentSearchesQuery.data?.some(
      (savedSearch) => savedSearch.query.trim() === normalizedSearchQuery,
    );

    if (hasSavedQuery) {
      setSaveSearchFeedback({
        kind: "error",
        message: "Already saved this keyword.",
      });
      return;
    }

    void saveSearchMutation.mutateAsync(normalizedSearchQuery);
  }

  function recordSearchHistory(query: string) {
    if (!isSearchHistoryEnabled || recordSearchMutation.isPending) {
      return;
    }

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    void recordSearchMutation.mutateAsync(normalizedQuery);
  }

  function handleDeleteRecentSearch(query: string) {
    const normalizedQuery = query.trim();

    if (
      !isSearchHistoryEnabled ||
      !normalizedQuery ||
      deleteSearchMutation.isPending
    ) {
      return;
    }

    void deleteSearchMutation.mutateAsync(normalizedQuery);
  }

  function handleClearRecentSearches() {
    if (!isSearchHistoryEnabled || clearSearchMutation.isPending) {
      return;
    }

    void clearSearchMutation.mutateAsync();
  }

  return {
    canSaveSearch:
      isSearchHistoryEnabled && Boolean(normalizedSearchQuery),
    clearSaveSearchFeedback() {
      setSaveSearchFeedback(null);
    },
    handleClearRecentSearches,
    handleDeleteRecentSearch,
    handleSaveSearch,
    isClearingRecentSearches: clearSearchMutation.isPending,
    isDeletingRecentSearch: deleteSearchMutation.isPending,
    isSavingSearch: saveSearchMutation.isPending,
    recentSearches: recentSearchesQuery.data || [],
    recordSearchHistory,
    saveSearchFeedback,
    saveSearchNotice:
      !isSearchHistoryEnabled && Boolean(normalizedSearchQuery)
        ? "Sign in to save search history."
        : null,
    saveSearchSuccessToken,
  };
}

function getSearchMutationErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  const message = getApiErrorMessage(error, fallbackMessage);

  if (message.toLocaleLowerCase().includes("already")) {
    return "Already saved this keyword.";
  }

  return message;
}
