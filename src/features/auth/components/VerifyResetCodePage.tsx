import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router";
import { submitForgotPasswordRequest, submitVerifyResetCode } from "@/features/auth/services/authFlows";
import { getPasswordRecoveryEmail } from "@/features/auth/utils/authStorage";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

const CODE_LENGTH = 6;

export default function VerifyResetCodePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as {
        successMessage?: string;
        email?: string;
    } | null;

    const email = locationState?.email || getPasswordRecoveryEmail() || "";

    const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState(locationState?.successMessage || "");
    const [countdown, setCountdown] = useState(60);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown for resending the verification code
    useEffect(() => {
        if (countdown <= 0) return;

        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);

        return () => clearTimeout(t);
    }, [countdown]);

    function handleOTPChange(index: number, value: string) {
        const cleaned = value
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase()
            .slice(-1);

        const next = [...digits];
        next[index] = cleaned;
        setDigits(next);

        if (cleaned && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase()
            .slice(0, CODE_LENGTH);

        const next = Array(CODE_LENGTH).fill("");

        pasted.split("").forEach((c, i) => {
            next[i] = c;
        });

        setDigits(next);
        inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const code = digits.join("");

        if (code.length < CODE_LENGTH) {
            setError("Please enter the complete verification code.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const response = await submitVerifyResetCode({ email, code });

            navigate(ROUTES.FORGOT_PASSWORD_RESET, {
                replace: true,
                state: {
                    resetGrantToken: response.data.resetGrantToken,
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "The code is invalid or has expired."));
            setDigits(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setSubmitting(false);
        }
    }

    async function handleResend() {
        if (!email || countdown > 0) return;

        try {
            setResending(true);
            setError("");

            const response = await submitForgotPasswordRequest({ email });

            setSuccessMsg(response.message ?? "A new verification code has been sent.");
            setCountdown(60);
            setDigits(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to resend the code."));
        } finally {
            setResending(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 h-14 border-b border-slate-100">
                <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-emerald-800 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 10 Q7 2 12 10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                            <circle cx="7" cy="5.5" r="1.2" fill="#6ee7b7" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-900 leading-none">Research Trend Tracker</div>
                        <div className="text-[10px] tracking-widest text-slate-400 leading-none mt-0.5">RTT · V2.4</div>
                    </div>
                </Link>
                <Link to={ROUTES.FORGOT_PASSWORD} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </Link>
            </header>

            {/* Main */}
            <div className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="w-full max-w-[400px]">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="3" width="20" height="18" rx="2" stroke="#059669" strokeWidth="1.5" />
                            <path d="M7 8h10M7 12h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="17" cy="17" r="4" fill="#059669" />
                            <path d="M15.5 17l1.2 1.2 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                        Password recovery · Step 2 of 3
                    </p>

                    <h1 className="font-serif text-[2.2rem] leading-[1.15] text-slate-950 mb-1">
                        Check your
                    </h1>
                    <h1 className="font-serif text-[2.2rem] leading-[1.15] italic text-emerald-700 mb-3">
                        email.
                    </h1>

                    {email && (
                        <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                            We sent a 6-digit verification code to{" "}
                            <span className="font-medium text-slate-700">{email}</span>.
                            Enter it below to continue.
                        </p>
                    )}

                    {successMsg && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                            {successMsg}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP inputs */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Verification code</label>
                            <div className="flex gap-2" onPaste={handlePaste}>
                                {digits.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="text"
                                        maxLength={1}
                                        value={d}
                                        onChange={(e) => handleOTPChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={`w-12 h-14 text-center text-xl font-semibold rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                            d
                                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                                : "border-slate-200 bg-white text-slate-900"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-slate-400">Tip: You can paste the full code at once.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || digits.join("").length < CODE_LENGTH}
                            className="w-full h-11 rounded-lg bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {submitting ? (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Verify code
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Resend */}
                    <p className="mt-5 text-sm text-slate-500 text-center">
                        Didn't receive it?{" "}
                        {countdown > 0 ? (
                            <span className="text-slate-400">Resend in {countdown}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="text-emerald-700 font-medium hover:underline disabled:opacity-50"
                            >
                                {resending ? "Sending…" : "Resend code"}
                            </button>
                        )}
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1 rounded-full transition-all ${s <= 2 ? "w-6 bg-emerald-600" : "w-4 bg-slate-200"}`} />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">Step 2 of 3</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
