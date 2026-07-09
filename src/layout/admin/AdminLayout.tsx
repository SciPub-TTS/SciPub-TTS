import { Outlet } from "react-router-dom";

import MainFooter from "../global/Footer";
import MainHeader from "../global/Header";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <div className="ml-56 flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <MainHeader />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <MainFooter />
      </div>
    </div>
  );
}
