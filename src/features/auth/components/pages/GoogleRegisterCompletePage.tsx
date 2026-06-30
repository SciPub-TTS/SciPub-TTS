import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthHeader from "@/features/auth/components/common/AuthHeader";
import AuthMessage from "@/features/auth/components/common/AuthMessage";
import {
    submitCompleteGoogleRegister,
    submitPreviewGoogleRegister,
} from "@/features/auth/services/authFlows";
import type { GoogleSignupPreviewResponse } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

function EyeIcon({ open }: { open: boolean }) {
    return open ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
                d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <line
                x1="1"
                y1="1"
                x2="23"
                y2="23"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export default function GoogleRegisterCompletePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token") ?? "";

    const [preview, setPreview] = useState<GoogleSignupPreviewResponse | null>(
        null,
    );
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loadingPreview, setLoadingPreview] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadPreview() {
            if (!token) {
                setError("Missing Google signup token.");
                setLoadingPreview(false);
                return;
            }

            try {
                setLoadingPreview(true);
                setError("");

                const response = await submitPreviewGoogleRegister(token);

                if (!cancelled) {
                    setPreview(response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        getApiErrorMessage(
                            err,
                            "Unable to load Google signup information. The link may have expired.",
                        ),
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingPreview(false);
                }
            }
        }

        void loadPreview();

        return () => {
            cancelled = true;
        };
    }, [token]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!token) {
            setError("Missing Google signup token.");
            return;
        }

        if (password.length < 10) {
            setError("Password must be at least 10 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password confirmation does not match.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const result = await submitCompleteGoogleRegister({
                googleSignupToken: token,
                password,
                confirmPassword,
                rememberMe,
            });

            navigate(result.redirectTo, { replace: true });
        } catch (err) {
            setError(
                getApiErrorMessage(
                    err,
                    "Unable to complete Google registration. Please try again.",
                ),
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <AuthHeader backTo={ROUTES.LOGIN} backLabel="Back to login" />

            <main className="flex flex-1 items-center justify-center px-6 py-16">
                <section className="w-full max-w-[440px]">
                    <div className="mb-7">
                        <h1 className="font-search-title text-[2.35rem] leading-[1.12] text-slate-950">
                            Complete your
                        </h1>

                        <h1 className="mb-3 font-search-title text-[2.35rem] italic leading-[1.12] text-emerald-700">
                            Owlreka account.
                        </h1>

                        <p className="text-sm leading-relaxed text-slate-500">
                            We found your Google profile. Create a password so you can also
                            sign in with email later.
                        </p>
                    </div>

                    <AuthMessage type="error" message={error} />

                    {loadingPreview ? (
                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 w-32 rounded bg-slate-100" />
                                <div className="h-5 w-full rounded bg-slate-100" />
                                <div className="h-5 w-2/3 rounded bg-slate-100" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {preview && (
                                <div className="mb-5 rounded-2xl border border-[#E4F2E9] bg-white p-4 shadow-[0_18px_45px_rgba(228,242,233,0.9)]">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                                        Google account
                                    </p>

                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                                            {(preview.firstName?.[0] ?? preview.email[0] ?? "G")
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {preview.firstName} {preview.lastName}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {preview.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder="At least 10 characters"
                                            required
                                            minLength={10}
                                            className="h-11 w-full rounded-lg border border-slate-200 px-4 pr-12 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((value) => !value)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            <EyeIcon open={showPassword} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Confirm password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(event) => setConfirmPassword(event.target.value)}
                                            placeholder="Re-enter password"
                                            required
                                            minLength={10}
                                            className={`h-11 w-full rounded-lg border px-4 pr-12 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 ${
                                                confirmPassword && confirmPassword !== password
                                                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                                                    : "border-slate-200 focus:ring-emerald-500"
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((value) => !value)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                            aria-label={
                                                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                                            }
                                        >
                                            <EyeIcon open={showConfirmPassword} />
                                        </button>
                                    </div>

                                    {confirmPassword && confirmPassword !== password && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">
                                            Passwords don't match.
                                        </p>
                                    )}
                                </div>

                                <label className="flex cursor-pointer select-none items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(event) => setRememberMe(event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 accent-emerald-700"
                                    />
                                    <span className="text-sm text-slate-600">
                                        Keep me signed in on this device
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={submitting || loadingPreview || !preview}
                                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 text-sm font-semibold text-white transition-all hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <svg
                                            className="animate-spin"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                    ) : (
                                        "Create account with Google"
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                Want to use another account?{" "}
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="font-medium text-emerald-700 hover:underline"
                                >
                                    Back to login
                                </Link>
                            </p>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}

