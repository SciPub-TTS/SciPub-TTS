import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router";
import { submitForgotPasswordRequest } from "@/features/auth/services/authFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setSubmitting(true);
            setError("");

            const response = await submitForgotPasswordRequest({ email });

            navigate(ROUTES.FORGOT_PASSWORD_VERIFY, {
                state: {
                    successMessage: response.message,
                    email,
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to send request. Please try again."));
        } finally {
            setSubmitting(false);
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
                <Link to={ROUTES.LOGIN} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to login
                </Link>
            </header>

            {/* Main */}
            <div className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="w-full max-w-[400px]">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#059669" strokeWidth="1.5" />
                            <path d="M22 6l-10 7L2 6" stroke="#059669" strokeWidth="1.5" />
                        </svg>
                    </div>

                    <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                        Password recovery · Step 1 of 3
                    </p>

                    <h1 className="font-serif text-[2.2rem] leading-[1.15] text-slate-950 mb-1">
                        Forgot your
                    </h1>
                    <h1 className="font-serif text-[2.2rem] leading-[1.15] italic text-emerald-700 mb-3">
                        password?
                    </h1>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        Enter the email address associated with your account and we'll send a verification code to reset your password.
                    </p>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@university.edu"
                                    required
                                    autoFocus
                                    className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-11 rounded-lg bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {submitting ? (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Send verification code
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1 rounded-full transition-all ${s === 1 ? "w-6 bg-emerald-600" : "w-4 bg-slate-200"}`} />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">Step 1 of 3</span>
                    </div>

                    <p className="mt-6 text-sm text-slate-500 text-center">
                        Remember your password?{" "}
                        <Link to={ROUTES.LOGIN} className="text-emerald-700 font-medium hover:underline">Back to login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
