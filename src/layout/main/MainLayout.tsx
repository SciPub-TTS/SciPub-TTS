import { Outlet } from "react-router-dom";

import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import MainSidebar from "./MainSidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <MainSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <MainHeader />

          <main className="flex-1 p-6">
            <Outlet />
          </main>

          <MainFooter />
        </div>
      </div>
    </div>
  );
}
