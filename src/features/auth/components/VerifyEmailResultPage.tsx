import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/app/router";

export default function VerifyEmailSuccessPage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const message = params.get("message") ?? "Your email has been verified successfully.";

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
            </header>

            <div className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="w-full max-w-[420px] text-center">
                    {/* Success icon */}
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="14" stroke="#059669" strokeWidth="1.5" />
                            <path d="M10 16l4 4 8-8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h1 className="font-serif text-[2rem] leading-[1.15] text-slate-950 mb-1">
                        Email verified
                    </h1>
                    <h1 className="font-serif text-[2rem] leading-[1.15] italic text-emerald-700 mb-4">
                        successfully.
                    </h1>

                    <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-sm mx-auto">
                        {message}
                    </p>

                    <Link
                        to={ROUTES.LOGIN}
                        className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 transition-all"
                    >
                        Go to login
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <p className="mt-6 text-xs text-slate-400">
                        You can now sign in with your email and password.
                    </p>
                </div>
            </div>
        </div>
    );
}
