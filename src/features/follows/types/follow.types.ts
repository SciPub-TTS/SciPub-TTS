export type FollowTargetType = "AUTHOR" | "TOPIC";

export interface CreateFollowRequest {
  targetType: FollowTargetType;
  targetOpenalexId: string;
  displayName?: string;
}

export interface FollowResponse {
  id: string;
  targetType: FollowTargetType;
  targetOpenAlexId: string;
  displayName: string | null;
  createdAt: string;
}

export interface FollowStatusResponse {
  followed: boolean;
  followId: string | null;
  targetType: FollowTargetType;
  targetOpenAlexId: string;
}
