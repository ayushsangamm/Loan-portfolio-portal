import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  Clock,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { format } from "date-fns";
import { useLoans } from "../../hooks/useLoans";
import { formatCurrency } from "../../utils/formatCurrency";

export const Navbar = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { loans } = useLoans();

  // Retrieve user session info from localStorage
  const user = useMemo(() => {
    const saved = localStorage.getItem("user_session");
    return saved ? JSON.parse(saved) : { name: "Ayush Admin", role: "Portfolio Officer" };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    navigate("/login", { replace: true });
  };

  // Initialize theme state from localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme class to root html tag on change
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Compute live alerts from state
  const alerts = useMemo(() => {
    const list = [];
    loans.forEach((loan) => {
      if (loan.status === "Defaulted") {
        list.push({
          id: loan.id,
          type: "default",
          title: "Capital Default Alert",
          desc: `${loan.borrowerName} (${loan.id}) is overdue on ${formatCurrency(loan.amount)}`,
        });
      } else if (loan.status === "Pending") {
        list.push({
          id: loan.id,
          type: "pending",
          title: "Verification Pending",
          desc: `${loan.borrowerName} applied for ${formatCurrency(loan.amount)}`,
        });
      }
    });
    return list.slice(0, 5); // Max 5 visible alerts
  }, [loans]);

  // Real-time operational clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Page Header from Route Path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Portfolio Dashboard";
    if (path === "/pipeline") return "Credit Lifecycle Pipeline";
    if (path === "/calculator") return "Interactive Credit Worksheet";
    if (path.startsWith("/loans")) {
      if (path.includes("/new") || path === "/add-loan")
        return "Disburse New Loan";
      if (path.split("/").length > 2) return "Loan Ledger Details";
      return "Loan Portfolio Ledger";
    }
    if (path.startsWith("/borrower")) return "Borrower Credit Profile";
    if (path === "/add-loan") return "Disburse New Loan";
    return "Lending Portal";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Left Area: Hamburger and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 lg:hidden smooth-transition"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight leading-tight md:text-lg">
            {getPageTitle()}
          </h2>
          {/* Breadcrumb trace */}
          <div className="hidden items-center gap-1.5 text-[11px] font-medium text-slate-400 md:flex">
            <span>Enterprise Systems</span>
            <span>/</span>
            <span className="text-slate-500 font-semibold">
              {getPageTitle()}
            </span>
          </div>
        </div>
      </div>

      {/* Right Area: Time Display, Alerts, Profile */}
      <div className="flex items-center gap-4.5">
        {/* Real-time System Time (premium touch) */}
        <div className="hidden items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 px-3.5 py-1.5 text-xs text-slate-600 shadow-2xs md:flex">
          <Calendar className="h-3.5 w-3.5 text-brand-500" />
          <span className="font-medium text-slate-500">
            {format(time, "EEE, dd MMM yyyy")}
          </span>
          <span className="h-3.5 w-[1px] bg-slate-200" />
          <Clock className="h-3.5 w-3.5 text-brand-500" />
          <span className="font-bold text-slate-700 tracking-wide">
            {format(time, "hh:mm:ss a")}
          </span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-2xs hover:bg-slate-50 hover:text-slate-800 smooth-transition cursor-pointer"
          title="Toggle Visual Theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-550 animate-pulse" />
          ) : (
            <Moon className="h-5 w-5 text-brand-600" />
          )}
        </button>

        {/* Alerts Notification Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-2xs hover:bg-slate-50 hover:text-slate-800 smooth-transition cursor-pointer ${
              showNotifications
                ? "bg-slate-100 border-slate-350 text-slate-850"
                : ""
            }`}
          >
            <Bell className="h-5 w-5" />
            {alerts.length > 0 && (
              <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-brand-500 border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Floating Alerts Popover */}
          {showNotifications && (
            <>
              {/* Backdrop to close click */}
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowNotifications(false)}
              />

              <div className="absolute right-0 mt-2.5 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-premium animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    System Priority Alerts
                  </span>
                  <span className="text-[10px] font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                    {alerts.length} New
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto mt-2 space-y-1.5">
                  {alerts.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <p className="text-[10px] font-bold uppercase">
                        All Clean
                      </p>
                      <p className="text-[9px] mt-0.5">
                        No critical issues to review
                      </p>
                    </div>
                  ) : (
                    alerts.map((alert) => {
                      const Icon =
                        alert.type === "default" ? AlertTriangle : AlertCircle;
                      return (
                        <div
                          key={alert.id}
                          onClick={() => {
                            setShowNotifications(false);
                            navigate("/pipeline");
                          }}
                          className={`flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-200/60 hover:bg-slate-50 cursor-pointer smooth-transition ${
                            alert.type === "default"
                              ? "bg-rose-50/20"
                              : "bg-amber-50/20"
                          }`}
                        >
                          <div
                            className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center ${
                              alert.type === "default"
                                ? "bg-rose-100 text-rose-600"
                                : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[11px] font-bold text-slate-800 leading-tight">
                              {alert.title}
                            </h5>
                            <p className="text-[10px] text-slate-500 leading-normal mt-0.5 truncate">
                              {alert.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Card with dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-1.5 border-l border-slate-200/80 cursor-pointer text-left hover:opacity-85 smooth-transition focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
              <User className="h-4.5 w-4.5" />
            </div>
            <div className="hidden text-left md:block">
              <h4 className="text-xs font-bold text-slate-700 leading-tight">
                {user.name}
              </h4>
              <p className="text-[10px] font-semibold text-brand-600 tracking-wide uppercase">
                {user.role}
              </p>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2.5 z-50 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-premium animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 md:hidden">
                  <h5 className="text-xs font-bold text-slate-800">{user.name}</h5>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50/50 rounded-lg cursor-pointer smooth-transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Secure Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
