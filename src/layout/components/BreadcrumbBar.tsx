import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";

type BreadcrumbBarProps = {
  variant?: "light" | "dark";
};

function formatSegment(segment: string) {
  return segment
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getBreadcrumbItems(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "papers" && segments[1]) {
    return [
      { label: "Search", path: ROUTES.SEARCH },
      { label: "Detail-Paper" },
    ];
  }

  return segments.map((segment, index) => ({
    label: formatSegment(segment),
    path:
      index === segments.length - 1
        ? undefined
        : `/${segments.slice(0, index + 1).join("/")}`,
  }));
}

export default function BreadcrumbBar({
  variant = "light",
}: BreadcrumbBarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  const isDark = variant === "dark";
  const textClass = isDark ? "text-slate-200" : "text-slate-900";
  const mutedClass = isDark ? "text-slate-500" : "text-slate-400";
  const homeLinkClass = isDark
    ? "text-slate-500 hover:text-slate-200"
    : "text-slate-400 hover:text-slate-700";
  const boxClass = isDark
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";
  const controlClass = isDark
    ? "border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-200"
    : "border-slate-200 bg-white text-slate-300 hover:text-slate-600";

  const currentLabel =
    breadcrumbItems.length > 0
      ? breadcrumbItems[breadcrumbItems.length - 1].label
      : "Home";

  return (
    <div className="flex flex-1 items-center gap-4">
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
        className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-4 py-2.5 ${boxClass}`}
      >
        <Link
          to={ROUTES.HOME}
          aria-label="Go to home"
          className={`flex h-5 w-5 shrink-0 items-center justify-center transition ${homeLinkClass}`}
        >
          <Home className="h-4 w-4" />
        </Link>

        {breadcrumbItems.length > 0 && (
          <ChevronRight className={`h-4 w-4 shrink-0 ${mutedClass}`} />
        )}

        {breadcrumbItems.length > 1 ? (
          <div className="flex min-w-0 items-center gap-3">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;

              return (
                <div key={`${item.label}-${index}`} className="flex items-center gap-3">
                  {item.path && !isLast ? (
                    <Link
                      to={item.path}
                      className={`truncate text-sm font-bold ${homeLinkClass}`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={`truncate text-sm font-bold ${textClass}`}>
                      {item.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className={`h-4 w-4 shrink-0 ${mutedClass}`} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <span className={`truncate text-sm font-bold ${textClass}`}>
            {currentLabel}
          </span>
        )}
      </nav>
    </div>
  );
}
