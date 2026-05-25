import { Link, useLocation } from "react-router-dom";

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

export default function BreadcrumbBar({
  variant = "light",
}: BreadcrumbBarProps) {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const textClass = variant === "dark" ? "text-slate-300" : "text-slate-700";
  const boxClass =
    variant === "dark"
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white";

  return (
    <div
      className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 ${boxClass}`}
    >
      <Link to={ROUTES.HOME} className={`text-sm ${textClass}`}>
        Home
      </Link>

      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <div key={path} className="flex items-center gap-2">
            <span className="text-slate-400">/</span>

            {isLast ? (
              <span className={`text-sm font-medium ${textClass}`}>
                {formatSegment(segment)}
              </span>
            ) : (
              <Link to={path} className={`text-sm ${textClass}`}>
                {formatSegment(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
