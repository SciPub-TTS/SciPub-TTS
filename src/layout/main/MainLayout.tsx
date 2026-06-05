import { Outlet } from "react-router-dom";

import EntityCanvasProvider from "@/app/providers/EntityCanvasProvider";

import MainFooter from "./Footer";
import MainHeader from "./Header";
import MainSidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <MainSidebar />

      <EntityCanvasProvider>
        <div className="ml-56 flex min-h-screen flex-col">
          <MainHeader />

          <main className="flex-1 p-6">
            <Outlet />
          </main>

          <MainFooter />
        </div>
      </EntityCanvasProvider>
    </div>
  );
}
