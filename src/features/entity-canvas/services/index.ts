import { getAccessToken } from "@/features/auth/utils/authStorage";

import type { EntityType, OpenAlexEntity, OpenAlexWorkListItem } from "../types";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");

type ResponseEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

type OpenAlexWorksResponse = {
  results?: OpenAlexWorkListItem[];
};

export async function getOpenAlexEntity(
  entityType: EntityType,
  entityId: string,
): Promise<OpenAlexEntity> {
  const normalizedEntityId = entityId.trim();
  if (!normalizedEntityId) {
    throw new Error("Entity ID is missing.");
  }

  const endpoint = `${apiBaseUrl}/api/openalex/entities/${encodeURIComponent(entityType)}/${encodeURIComponent(normalizedEntityId)}`;

  return requestData<OpenAlexEntity>(endpoint);
}

export async function getOpenAlexWorks(params: {
  filter: string;
  sort?: string;
  perPage?: number;
  page?: number;
  select?: string;
  search?: string;
}) {
  const endpoint = new URL(`${apiBaseUrl}/api/openalex/works`);

  endpoint.searchParams.set("filter", params.filter);
  if (params.sort) {
    endpoint.searchParams.set("sort", params.sort);
  }
  if (params.perPage) {
    endpoint.searchParams.set("per_page", String(params.perPage));
  }
  if (params.page) {
    endpoint.searchParams.set("page", String(params.page));
  }
  if (params.select) {
    endpoint.searchParams.set("select", params.select);
  }
  if (params.search) {
    endpoint.searchParams.set("search", params.search);
  }

  const data = await requestData<OpenAlexWorksResponse>(endpoint.toString());

  return Array.isArray(data.results) ? data.results : [];
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
