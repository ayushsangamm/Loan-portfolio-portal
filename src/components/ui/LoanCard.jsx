export const LoanCard = ({ title, value, icon: Icon, description, color }) => {
  const themes = {
    blue: {
      bg: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10 text-blue-600",
      border: "hover:border-blue-300/60",
      badge: "bg-blue-50 text-blue-700 border-blue-100",
    },
    emerald: {
      bg: "from-emerald-500/10 to-emerald-600/5",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      border: "hover:border-emerald-300/60",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    amber: {
      bg: "from-amber-500/10 to-amber-600/5",
      iconBg: "bg-amber-500/10 text-amber-600",
      border: "hover:border-amber-300/60",
      badge: "bg-amber-50 text-amber-700 border-amber-100",
    },
    rose: {
      bg: "from-rose-500/10 to-rose-600/5",
      iconBg: "bg-rose-500/10 text-rose-600",
      border: "hover:border-rose-300/60",
      badge: "bg-rose-50 text-rose-700 border-rose-100",
    },
    indigo: {
      bg: "from-indigo-500/10 to-indigo-600/5",
      iconBg: "bg-indigo-500/10 text-indigo-600",
      border: "hover:border-indigo-300/60",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
  };

  const currentTheme = themes[color];

  return (
    <div
      className={`
      relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 
      shadow-premium hover:shadow-premium-hover smooth-transition hover:-translate-y-0.5
      ${currentTheme.border}
    `}
    >
      {/* Decorative gradient flare background */}
      <div
        className={`absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br opacity-50 blur-xl ${currentTheme.bg}`}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-slate-500">
          {title}
        </h3>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-2xs ${currentTheme.iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <span className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl leading-none">
          {value}
        </span>
        <div className="mt-2.5 flex items-center">
          <span
            className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${currentTheme.badge}`}
          >
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
