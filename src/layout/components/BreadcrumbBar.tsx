import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import {
  Link,
  useLocation,
  useMatches,
  useNavigate,
  type UIMatch,
} from "react-router-dom";

import type { AppRouteHandle } from "@/app/router/breadcrumbs";
import { resolveBreadcrumbItems } from "@/app/router/breadcrumbs";
import { ROUTES } from "@/app/router";
import { useDetailTitleStoreVersion } from "@/store/detailTitleStore";

type BreadcrumbBarProps = {
  homePath?: string;
  variant?: "light" | "dark";
};

function formatBreadcrumbLabel(label: string) {
  const normalizedLabel = label.trim();

  if (normalizedLabel.length <= 12) {
    return normalizedLabel;
  }

  return `${normalizedLabel.slice(0, 18)}...`;
}

export default function BreadcrumbBar({
  homePath = ROUTES.HOME,
  variant = "light",
}: BreadcrumbBarProps) {
  const location = useLocation();
  const matches = useMatches() as UIMatch<unknown, AppRouteHandle>[];
  const navigate = useNavigate();
  useDetailTitleStoreVersion();

  const breadcrumbItems = resolveBreadcrumbItems(matches, location);

  const isDark = variant === "dark";
  const textClass = isDark ? "text-slate-100" : "text-slate-950";
  const mutedClass = isDark ? "text-black" : "text-black";
  const homeLinkClass = isDark
    ? "text-emerald-500 hover:text-[#059669]"
    : "text-black hover:text-[#059669]";
  const boxClass = isDark
    ? "border-black bg-slate-900"
    : "border-black bg-white";
  const controlClass = isDark
    ? "border-black bg-slate-900 text-black hover:border-[#059669] hover:text-[#059669]"
    : "border-black bg-white text-black hover:border-[#059669] hover:text-[#059669]";

  const currentLabel =
    breadcrumbItems.length > 0
      ? breadcrumbItems[breadcrumbItems.length - 1].label
      : "Home";

  return (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <button
        type="button"
        aria-label="Go back"
        onClick={() => navigate(-1)}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition ${controlClass}`}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <nav
        aria-label="Breadcrumb"
        className={`flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-lg border px-4 py-2.5 ${boxClass}`}
      >
        <Link
          to={homePath}
          aria-label="Go to home"
          className={`flex h-5 w-5 shrink-0 items-center justify-center transition ${homeLinkClass}`}
        >
          <Home className="h-5 w-5" />
        </Link>

        <div className="hover-scrollbar flex min-w-0 flex-1 items-center gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap">
          {breadcrumbItems.length > 0 && (
            <ChevronRight className={`h-5 w-5 shrink-0 ${mutedClass}`} />
          )}

          {breadcrumbItems.length > 1 ? (
            <div className="flex min-w-0 items-center gap-3">
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex min-w-0 shrink-0 items-center gap-3"
                  >
                    {item.to && !isLast ? (
                      <Link
                        to={item.to ?? homePath}
                        onClick={item.onClick}
                        title={item.label}
                        className={`block max-w-[18ch] truncate text-sm font-bold ${homeLinkClass}`}
                      >
                        {formatBreadcrumbLabel(item.label)}
                      </Link>
                    ) : (
                      <span
                        title={item.label}
                        className={`block max-w-[18ch] truncate text-sm font-bold ${textClass}`}
                      >
                        {formatBreadcrumbLabel(item.label)}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight
                        className={`h-5 w-5 shrink-0 ${mutedClass}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <span
              title={currentLabel}
              className={`block max-w-[18ch] truncate text-sm font-bold ${textClass}`}
            >
              {formatBreadcrumbLabel(currentLabel)}
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
