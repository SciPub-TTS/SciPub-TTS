import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { followApi } from "@/features/follows/services/follow.api";
import { followQueryKeys } from "@/features/follows/services/followQueryKeys";
import type {
  CreateFollowRequest,
  FollowStatusResponse,
  FollowTargetType,
} from "@/features/follows/types/follow.types";

const FOLLOW_FEEDBACK_RESET_MS = 6000;

class FollowAuthRequiredError extends Error {
  constructor() {
    super("Authentication is required to follow this entity.");
  }
}

type UseEntityFollowOptions = {
  displayName: string;
  targetOpenAlexId: string;
  targetType: FollowTargetType;
};

function createFollowStatus(
  targetType: FollowTargetType,
  targetOpenAlexId: string,
  followed: boolean,
  followId: string | null,
): FollowStatusResponse {
  return {
    followId,
    followed,
    targetOpenAlexId,
    targetType,
  };
}

export function useEntityFollow(options: UseEntityFollowOptions) {
  const { displayName, targetOpenAlexId, targetType } = options;
  const { isAuthenticated } = useAuthSession();
  const queryClient = useQueryClient();
  const [feedbackLabel, setFeedbackLabel] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const normalizedEntityId = targetOpenAlexId.trim();
  const normalizedDisplayName = displayName.trim();
  const followStatusQueryKey = followQueryKeys.status(
    targetType,
    normalizedEntityId,
  );
  const followStatusQuery = useQuery({
    enabled: isAuthenticated && normalizedEntityId.length > 0,
    queryFn: async () => {
      const response = await followApi.getStatus(targetType, normalizedEntityId);
      return response.data;
    },
    queryKey: followStatusQueryKey,
    retry: false,
  });
  const isFollowed = followStatusQuery.data?.followed ?? false;

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

  function scheduleFeedbackReset() {
    if (typeof window === "undefined") {
      return;
    }

    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setFeedbackLabel(null);
      feedbackTimeoutRef.current = null;
    }, FOLLOW_FEEDBACK_RESET_MS);
  }

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        throw new FollowAuthRequiredError();
      }

      if (!normalizedEntityId) {
        throw new Error("Target OpenAlex ID is missing.");
      }

      if (isFollowed) {
        await followApi.delete(targetType, normalizedEntityId);

        return createFollowStatus(
          targetType,
          normalizedEntityId,
          false,
          null,
        );
      }

      const payload: CreateFollowRequest = {
        displayName: normalizedDisplayName || undefined,
        targetOpenalexId: normalizedEntityId,
        targetType,
      };
      const response = await followApi.add(payload);

      return createFollowStatus(
        targetType,
        normalizedEntityId,
        true,
        response.data.id,
      );
    },
    onError: (error) => {
      setFeedbackLabel(
        error instanceof FollowAuthRequiredError ? "Sign in first" : "Try again",
      );
      scheduleFeedbackReset();
    },
    onSuccess: (nextStatus) => {
      queryClient.setQueryData(followStatusQueryKey, nextStatus);
      void queryClient.invalidateQueries({
        queryKey: followQueryKeys.list(),
      });
      setFeedbackLabel(null);
    },
  });

  async function handleFollowClick() {
    if (followMutation.isPending) {
      return;
    }

    await followMutation.mutateAsync();
  }

  const buttonLabel = followMutation.isPending
    ? isFollowed
      ? "Unfollowing..."
      : "Following..."
    : feedbackLabel || (isFollowed ? "Following" : "+ Follow");

  return {
    buttonLabel,
    handleFollowClick,
    isFollowActionPending: followMutation.isPending,
    isFollowed,
  };
}
