function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function stripApiSuffix(value: string) {
  return trimTrailingSlash(value).replace(/\/api$/i, "");
}

function ensureApiSuffix(value: string) {
  const normalizedValue = trimTrailingSlash(value);

  if (normalizedValue.toLowerCase().endsWith("/api")) {
    return normalizedValue;
  }

  return `${normalizedValue}/api`;
}

function getFirstConfiguredValue(values: Array<string | undefined>) {
  for (const value of values) {
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

const configuredApiOrigin = getFirstConfiguredValue([
  import.meta.env.VITE_API_BASE_URL,
  import.meta.env.VITE_API_URL,
  import.meta.env.VITE_BACKEND_URL,
]);

const fallbackApiOrigin = "http://localhost:8080";

export const apiOrigin = configuredApiOrigin
  ? stripApiSuffix(configuredApiOrigin)
  : fallbackApiOrigin;

export const apiBaseUrl = ensureApiSuffix(apiOrigin);

export const googleAuthUrl =
  import.meta.env.VITE_GOOGLE_AUTH_URL?.trim() ||
  `${apiOrigin}/oauth2/authorization/google`;
