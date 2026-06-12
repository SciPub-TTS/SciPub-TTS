function trim(value: string) {
  return value.replace(/\/+$/, "");
}

const configuredBackendUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_BACKEND_URL?.trim();

if (!configuredBackendUrl) {
  throw new Error(
    "Missing frontend API base URL. Set VITE_API_BASE_URL in your .env file.",
  );
}

const normalizedBackendUrl = trim(configuredBackendUrl);

export const apiBaseUrl = normalizedBackendUrl.toLowerCase().endsWith("/api")
  ? normalizedBackendUrl
  : `${normalizedBackendUrl}/api`;

export const apiOrigin = apiBaseUrl.replace(/\/api$/i, "");
export const googleAuthUrl =
  import.meta.env.VITE_GOOGLE_AUTH_URL?.trim() ||
  `${apiBaseUrl}/auth/oauth2/google`;
