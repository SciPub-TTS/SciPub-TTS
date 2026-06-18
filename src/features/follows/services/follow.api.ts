import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
  CreateFollowRequest,
  FollowResponse,
  FollowStatusResponse,
  FollowTargetType,
} from "@/features/follows/types/follow.types";

const BASE = "/api/follows";

export const followApi = {
  add(payload: CreateFollowRequest) {
    return http
      .post<ApiResponse<FollowResponse>>(BASE, payload)
      .then((response) => response.data);
  },

  delete(targetType: FollowTargetType, targetOpenAlexId: string) {
    return http
      .delete<ApiResponse<null>>(BASE, {
        params: {
          targetOpenAlexId,
          targetType,
        },
      })
      .then((response) => response.data);
  },

  getStatus(targetType: FollowTargetType, targetOpenAlexId: string) {
    return http
      .get<ApiResponse<FollowStatusResponse>>(`${BASE}/status`, {
        params: {
          targetOpenAlexId,
          targetType,
        },
      })
      .then((response) => response.data);
  },
};
