import { NavLink } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { isAuthenticated } from "@/features/auth/utils/authGuard";

const publicMenuItems = [
  { label: "Dashboard", path: ROUTES.DASHBOARD },
  { label: "Search Papers", path: ROUTES.SEARCH },
  { label: "Help Guide", path: ROUTES.GUIDE },
];

const userMenuItems = [
  { label: "New Feed", path: ROUTES.FEED },
  { label: "Bookmarks", path: ROUTES.BOOKMARKS },
  { label: "Export Reports", path: ROUTES.REPORT },
  { label: "User Profile", path: ROUTES.PROFILE },
];

export default function MainSidebar() {
  const loggedIn = isAuthenticated();
  const menuItems = loggedIn
    ? [...publicMenuItems, ...userMenuItems]
    : publicMenuItems;

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 bg-slate-950 p-4 text-slate-300">
      <div className="mb-8">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          RT
        </div>

        <h1 className="text-base font-semibold text-white">Research Trend</h1>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Trend Intelligence
        </p>
      </div>

      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Workspace
      </p>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2 text-sm transition",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
