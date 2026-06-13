import { getAccessToken } from "@/features/auth/utils/authStorage";
import { apiOrigin } from "@/config/appConfig";

type ResponseEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

export function buildApiPath(path: string) {
  if (!path.startsWith("/")) {
    return `${apiOrigin}/${path}`;
  }

  return `${apiOrigin}${path}`;
}

export function createApiUrl(path: string) {
  return new URL(buildApiPath(path));
}

type RequestJsonInit = RequestInit & {
  includeAuth?: boolean;
};

export async function requestJson<T>(
  url: string | URL,
  init?: RequestJsonInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const shouldIncludeAuth = init?.includeAuth !== false;
  const accessToken = shouldIncludeAuth ? getAccessToken() : null;
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url.toString(), {
    ...init,
    credentials: init?.credentials ?? "include",
    headers,
  });

  let envelope: ResponseEnvelope<T>;

  try {
    envelope = (await response.json()) as ResponseEnvelope<T>;
  } catch {
    throw new Error(`Request failed (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(envelope.message || `Request failed (${response.status})`);
  }

  return envelope.data;
}

export function requestPublicJson<T>(
  url: string | URL,
  init?: RequestInit,
): Promise<T> {
  return requestJson<T>(url, {
    ...init,
    includeAuth: false,
  });
}
