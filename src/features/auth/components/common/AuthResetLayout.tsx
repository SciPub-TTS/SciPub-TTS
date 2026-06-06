// src/features/auth/components/layout/AuthResetLayout.tsx
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router";

type AuthSimpleLayoutProps = {
    children: React.ReactNode;
    backTo: string;
    backLabel: string;
};

export default function AuthResetLayout({ children, backTo, backLabel }: AuthSimpleLayoutProps) {
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
                <Link to={backTo} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {backLabel}
                </Link>
            </header>

            {/* Main */}
            <div className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="w-full max-w-[400px]">
                    {children}
                </div>
            </div>
        </div>
    );
}