import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router";
import { submitResetPassword } from "@/features/auth/services/authFlows.ts";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage.ts";
import AuthResetLayout from "@/features/auth/components/common/AuthResetLayout.tsx";
import AuthMessage from "@/features/auth/components/common/AuthMessage.tsx";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as { resetGrantToken?: string } | null;

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword.length < 10) {
            setError("Password must be at least 10 characters long.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("Password confirmation does not match.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const response = await submitResetPassword({
                resetGrantToken: locationState?.resetGrantToken,
                newPassword,
                confirmNewPassword,
            });

            navigate(ROUTES.LOGIN, {
                replace: true,
                state: {
                    successMessage: response.message ?? "Your password has been reset. Please log in.",
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to reset password. The link may have expired."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthResetLayout backTo={ROUTES.LOGIN} backLabel="Back to login">

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#059669" strokeWidth="1.5" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.5" fill="#059669" />
                </svg>
            </div>

            <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                Password recovery · Step 3 of 3
            </p>

            <h1 className="font-serif text-[2.2rem] leading-[1.15] text-slate-950 mb-1">
                Set a new
            </h1>
            <h1 className="font-serif text-[2.2rem] leading-[1.15] italic text-emerald-700 mb-3">
                password.
            </h1>
            <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                Choose a strong password for your account. You'll use it to sign in next time.
            </p>

            <AuthMessage type="error" message={error} />

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 10 characters"
                            required
                            autoFocus
                            className="w-full h-11 pl-9 pr-10 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showNew ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            required
                            className={`w-full h-11 pl-9 pr-10 rounded-lg border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                                confirmNewPassword && confirmNewPassword !== newPassword
                                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                                    : "border-slate-200"
                            }`}
                        />
                        <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showConfirm ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {confirmNewPassword && confirmNewPassword !== newPassword && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">Passwords don't match.</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-lg bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-4"
                >
                    {submitting ? (
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <>
                            Reset password
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            <div className="flex items-center gap-2 mt-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="h-1 w-6 rounded-full bg-emerald-600" />
                ))}
                <span className="text-xs text-slate-400 ml-1">Step 3 of 3</span>
            </div>

        </AuthResetLayout>
    );
}