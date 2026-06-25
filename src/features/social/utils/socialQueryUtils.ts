import type {
  LikeToggleResponse,
  SocialPostPageResponse,
} from "@/features/social/types/social.types";

export function updateSocialPostPageLikeState(
  page: SocialPostPageResponse | undefined,
  postId: string,
  likeState: LikeToggleResponse,
) {
  if (!page) {
    return page;
  }

  let hasUpdatedPost = false;

  const content = page.content.map((post) => {
    if (post.id !== postId) {
      return post;
    }

    hasUpdatedPost = true;

    return {
      ...post,
      liked: likeState.liked,
      likeCount: likeState.likeCount,
    };
  });

  if (!hasUpdatedPost) {
    return page;
  }

  return {
    ...page,
    content,
  };
}

export function findSocialPostInPage(
  page: SocialPostPageResponse | undefined,
  postId: string,
) {
  return page?.content.find((post) => post.id === postId) ?? null;
}

export function normalizeIdentityValue(
  value: string | number | null | undefined,
) {
  const normalizedValue = String(value ?? "").trim();
  return normalizedValue ? normalizedValue.toLowerCase() : null;
}

export function decodeJwtSubject(accessToken: string | null | undefined) {
  if (!accessToken || typeof window === "undefined") {
    return null;
  }

  const tokenParts = accessToken.split(".");

  if (tokenParts.length < 2) {
    return null;
  }

  try {
    const base64Value = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedValue = base64Value.padEnd(
      Math.ceil(base64Value.length / 4) * 4,
      "=",
    );
    const payload = JSON.parse(window.atob(paddedValue)) as {
      sub?: string;
    };

    return normalizeIdentityValue(payload.sub);
  } catch {
    return null;
  }
}
