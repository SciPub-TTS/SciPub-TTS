import { Home } from "lucide-react";
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
                    aria-label={backLabel}
                    className="group flex h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                >
                    <Home className="h-5 w-5" />
                    <span className="max-w-0 overflow-hidden text-sm font-medium opacity-0 transition-all group-hover:max-w-12 group-hover:opacity-100">
                        Home
                    </span>
                </Link>
            )}
        </header>
    );
}
