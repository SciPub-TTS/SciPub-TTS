import axios from "axios";

export function getApiErrorMessage(
    error: unknown,
    fallback = "An error occurred, please try again.",
) {
    if (axios.isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string" && apiMessage.trim()) {
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
