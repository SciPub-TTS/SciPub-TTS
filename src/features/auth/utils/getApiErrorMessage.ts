import axios from "axios";

export function getApiErrorMessage(
    error: unknown,
    fallback = "An error occurred, please try again.",
) {
    if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string" && apiMessage.trim()) {
            const apiData = error.response?.data?.data;

            if (Array.isArray(apiData) && apiData.length > 0) {
                const detailedMessage = apiData
                    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
                    .join(", ");

                if (detailedMessage) {
                    return `${apiMessage}: ${detailedMessage}`;
                }
            }

            return apiMessage;
        }

        if (error.message) {
            return error.message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
