import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";

import type {
  CreateSocialPostRequest,
  CreateSocialPostResponse,
  LikeToggleResponse,
  SocialPostDetailResponse,
  SocialPostPageResponse,
  UpdateSocialPostRequest,
  UpdateSocialPostResponse,
} from "@/features/social/types/social.types";

const BASE = "/api/social";

export const socialApi = {
  async getNewest(page = 0, size = 12) {
    const response = await http.get<ApiResponse<SocialPostPageResponse>>(
      `${BASE}/newest`,
      {
        params: { page, size },
      },
    );

    return response.data.data;
  },

  async getTop(page = 0, size = 5) {
    const response = await http.get<ApiResponse<SocialPostPageResponse>>(
      `${BASE}/top`,
      {
        params: { page, size },
      },
    );

    return response.data.data;
  },

  async getPostDetail(postId: string) {
    const response = await http.get<ApiResponse<SocialPostDetailResponse>>(
      `${BASE}/${postId}`,
    );

    return response.data.data;
  },

  async createPost(payload: CreateSocialPostRequest) {
    const response = await http.post<ApiResponse<CreateSocialPostResponse>>(
      BASE,
      payload,
    );

    return response.data.data;
  },

  async updatePost(postId: string, payload: UpdateSocialPostRequest) {
    const response = await http.put<ApiResponse<UpdateSocialPostResponse>>(
      `${BASE}/${postId}`,
      payload,
    );

    return response.data.data;
  },

  async deletePost(postId: string) {
    const response = await http.delete<ApiResponse<null>>(`${BASE}/${postId}`);

    return response.data.data;
  },

  async toggleLike(postId: string) {
    const response = await http.post<ApiResponse<LikeToggleResponse>>(
      `${BASE}/${postId}/like`,
    );

    return response.data.data;
  },
};
