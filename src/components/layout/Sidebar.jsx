import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  FolderLock,
  Layers,
  Calculator,
  X,
} from "lucide-react";

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Loans List", path: "/loans", icon: ListOrdered },
    { name: "Pipeline Board", path: "/pipeline", icon: Layers },
    { name: "EMI Calculator", path: "/calculator", icon: Calculator },
    { name: "Add New Loan", path: "/add-loan", icon: PlusCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed bottom-0 top-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-slate-100 border-r border-slate-800/60 smooth-transition
        lg:sticky lg:z-30 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-md shadow-brand-500/20">
              <FolderLock className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                CapitalFlow
              </h1>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Loan Systems
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800/50 bg-slate-900 text-slate-400 hover:text-white lg:hidden smooth-transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl smooth-transition group
                  ${
                    isActive
                      ? "bg-brand-600/90 text-white shadow-lg shadow-brand-600/10"
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`
                      h-5 w-5 smooth-transition
                      ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}
                    `}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Sidebar Info */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Gateway Online
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Operational Portal v3.4.1
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
