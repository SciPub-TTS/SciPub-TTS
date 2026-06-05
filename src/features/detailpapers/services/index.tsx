import { getAccessToken } from "@/features/auth/utils/authStorage";

import type {
  OpenAlexWorkDetailApi,
  PaperDetailData,
  ResponseEnvelope,
} from "../types";
import { mapWorkDetailToPaperDetail } from "../mappers/paperDetailMapper";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(
  /\/$/,
  "",
);

export async function getPaperDetail(paperId: string): Promise<PaperDetailData> {
  const normalizedPaperId = paperId.trim();
  if (!normalizedPaperId) {
    throw new Error("Paper ID is missing.");
  }

  const endpoint = `${apiBaseUrl}/api/papers/${encodeURIComponent(normalizedPaperId)}`;
  const data = await requestData<OpenAlexWorkDetailApi>(endpoint);

  return mapWorkDetailToPaperDetail(data);
}

async function requestData<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  const accessToken = getAccessToken();
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...init,
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
