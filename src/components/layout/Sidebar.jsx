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
        fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-slate-100 border-r border-slate-800 transition-transform duration-200
        lg:sticky lg:z-30 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <FolderLock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white leading-tight">
                CapitalFlow
              </h1>
              <p className="text-[10px] font-medium text-slate-400">
                Loan Portfolio System
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-colors group
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`
                      h-4.5 w-4.5 transition-colors
                      ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}
                    `}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Sidebar Info */}
        <div className="p-4 border-t border-slate-900">
          <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-slate-300">
                System Active
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Enterprise v3.4.1
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
