function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredApiBaseUrl) {
  throw new Error(
    "Missing frontend API base URL. Set VITE_API_BASE_URL in your .env file.",
  );
}

const normalizedApiBaseUrl = trimTrailingSlashes(configuredApiBaseUrl);
const hasApiSuffix = normalizedApiBaseUrl.toLowerCase().endsWith("/api");

export const apiBaseUrl = hasApiSuffix
  ? normalizedApiBaseUrl
  : `${normalizedApiBaseUrl}/api`;

export const apiOrigin = hasApiSuffix
  ? normalizedApiBaseUrl.slice(0, -4)
  : normalizedApiBaseUrl;

export const googleAuthUrl = `${apiBaseUrl}/auth/oauth2/google`;
