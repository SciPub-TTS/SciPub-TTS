import { NavLink } from "react-router-dom";

import { ROUTES } from "@/app/router";

const adminMenuItems = [
  {
    label: "Admin Dashboard",
    path: ROUTES.ADMIN_DASHBOARD,
  },
  {
    label: "Users",
    path: ROUTES.ADMIN_USERS,
  },
  {
    label: "Fields",
    path: ROUTES.ADMIN_FIELDS,
  },
  {
    label: "Synchronization",
    path: ROUTES.ADMIN_SYNC,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-4">
      <div className="mb-8">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
          ST
        </div>

        <h1 className="text-base font-semibold text-white">ScholarTrack</h1>
        <p className="text-xs text-slate-500">Admin Console</p>
      </div>

      <nav className="space-y-1">
        {adminMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2 text-sm transition",
                isActive
                  ? "bg-emerald-900 text-emerald-300"
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
