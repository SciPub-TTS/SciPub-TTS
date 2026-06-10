import { getAccessToken } from "@/features/auth/utils/authStorage";
import { apiOrigin } from "@/lib/api/environment";

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

export async function requestJson<T>(
  url: string | URL,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
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
