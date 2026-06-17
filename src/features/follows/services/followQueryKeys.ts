import type { FollowTargetType } from "@/features/follows/types/follow.types";

export const followQueryKeys = {
  all: ["follows"] as const,
  list: () => [...followQueryKeys.all, "list"] as const,
  status: (targetType: FollowTargetType, targetOpenAlexId: string) =>
    [...followQueryKeys.statuses(), targetType, targetOpenAlexId] as const,
  statuses: () => [...followQueryKeys.all, "status"] as const,
};
