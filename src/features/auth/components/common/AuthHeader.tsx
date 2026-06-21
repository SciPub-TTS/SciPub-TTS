import { Home } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
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
    <header className="dynamic-divider-bottom flex h-16 items-center justify-between border-b border-black bg-white px-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:px-8">
      <Link to={ROUTES.HOME} className="flex items-center gap-3">
        <img
          src={logoImage}
          alt="Owlreka logo"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <span className="font-brand text-3xl font-normal text-black">
          Owlreka
        </span>
      </Link>

      {showBackLink && (
        <Link
          to={backTo}
          aria-label={backLabel}
          className="group flex h-10 w-10 items-center justify-center rounded-lg border border-black/70 text-black transition-all hover:w-auto hover:border-[#14532D] hover:px-3 hover:bg-[#14532D] hover:text-white"
        >
          <Home className="h-5 w-5" />
          <span className="max-w-0 overflow-hidden text-sm font-medium opacity-0 transition-all group-hover:ml-1.5 group-hover:max-w-14 group-hover:opacity-100">
            Home
          </span>
        </Link>
      )}
    </header>
  );
}
