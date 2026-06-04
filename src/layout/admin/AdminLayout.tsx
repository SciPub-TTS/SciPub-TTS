import { Outlet } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <div className="ml-56 flex min-h-screen flex-col">
        <AdminHeader />

        <main className="flex-1 bg-slate-50 p-6 text-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
