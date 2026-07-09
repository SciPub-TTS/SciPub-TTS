export function getAppBaseUrl() {
    const envBaseUrl = import.meta.env.VITE_APP_BASE_URL;

    if (envBaseUrl) {
        return envBaseUrl.replace(/\/$/, "");
    }

    return window.location.origin;
}