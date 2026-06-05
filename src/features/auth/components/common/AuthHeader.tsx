import {Link} from "react-router-dom";

import {ROUTES} from "@/app/router";
import logoImage from "@/assets/images/logo.png";

type AuthHeaderProps = {
    backTo?: string;
    backLabel?: string;
    showBackLink?: boolean;
};

export default function AuthHeader({
   backTo = ROUTES.HOME,
   backLabel = "Back to home",
   showBackLink = true,
}: AuthHeaderProps) {
    return (
        <header className="flex h-14 items-center justify-between border-b border-slate-100 px-8">
            <Link to={ROUTES.HOME} className="flex items-center gap-3">
                <img
                    src={logoImage}
                    alt="Research Trend"
                    className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="font-brand text-3xl font-normal">Owlreka</span>
            </Link>

            {showBackLink && (
                <Link
                    to={backTo}
                    className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                            d="M9 2L4 7l5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {backLabel}
                </Link>
            )}
        </header>
    );
}