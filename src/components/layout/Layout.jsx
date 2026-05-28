import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Loader2 } from "lucide-react";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Navigation Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Sticky Header */}
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Route Pages */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          <Suspense
            fallback={
              <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 animate-spin">
                  <Loader2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
                  Loading loan systems ledger...
                </p>
              </div>
            }
          >
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
