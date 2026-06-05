type AuthMessageProps = {
    type: "success" | "error";
    message?: string;
};

export default function AuthMessage({ type, message }: AuthMessageProps) {
    if (!message) return null;

    const className =
        type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-700";

    return (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${className}`}>
            {message}
        </div>
    );
}