import { useMemo } from "react";
import { useLoans } from "../hooks/useLoans";
import { useAppDispatch } from "../app/store";
import { updateLoanStatusAsync } from "../features/loans/loansSlice";
import {
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Briefcase,
  Activity,
  UserCheck,
} from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";
import { StatusBadge } from "../components/ui/StatusBadge";

export const Pipeline = () => {
  const dispatch = useAppDispatch();
  const { loans, borrowers, isLoading } = useLoans();

  // Handle status update actions
  const handleStatusChange = (id, nextStatus) => {
    dispatch(updateLoanStatusAsync({ id, status: nextStatus }));
  };

  // Group loans by status into columns
  const columnsData = useMemo(() => {
    const groups = {
      Pending: [],
      Active: [],
      Closed: [],
      Defaulted: [],
    };

    loans.forEach((loan) => {
      if (groups[loan.status]) {
        groups[loan.status].push(loan);
      }
    });

    return [
      {
        id: "Pending",
        title: "Review Queue",
        subtitle: "KYC & Credit Verification",
        icon: HelpCircle,
        colorClass: "border-t-amber-500 bg-amber-50/15 text-amber-800",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        loans: groups.Pending,
      },
      {
        id: "Active",
        title: "Active Portfolio",
        subtitle: "Capital Disbursed & Earning",
        icon: Activity,
        colorClass: "border-t-brand-500 bg-brand-50/10 text-brand-800",
        badgeColor: "bg-brand-100 text-brand-800 border-brand-200",
        loans: groups.Active,
      },
      {
        id: "Closed",
        title: "Settled Ledger",
        subtitle: "Fully Paid & Reconciled",
        icon: CheckCircle,
        colorClass: "border-t-emerald-500 bg-emerald-50/10 text-emerald-800",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        loans: groups.Closed,
      },
      {
        id: "Defaulted",
        title: "NPA / High Risk",
        subtitle: "Collections Escapes",
        icon: AlertOctagon,
        colorClass: "border-t-rose-500 bg-rose-50/10 text-rose-800",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
        loans: groups.Defaulted,
      },
    ];
  }, [loans]);

  // Aggregate stats specifically for pipeline
  const stats = useMemo(() => {
    let totalPendingValue = 0;
    let totalActiveValue = 0;
    let totalDefaultedValue = 0;

    loans.forEach((loan) => {
      if (loan.status === "Pending") totalPendingValue += loan.amount;
      if (loan.status === "Active") totalActiveValue += loan.amount;
      if (loan.status === "Defaulted") totalDefaultedValue += loan.amount;
    });

    return {
      totalPendingValue,
      totalActiveValue,
      totalDefaultedValue,
    };
  }, [loans]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Pipeline Systems...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner segment */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 p-6 md:p-8 border border-slate-800 text-white shadow-premium">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl leading-none flex items-center gap-2">
              <Briefcase className="h-5.5 w-5.5 text-brand-400" />
              <span>Credit Lifecycle Pipeline</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-normal">
              Manage borrower lifecycle phases, authorize disbursements, and
              record repayments through visual workflows.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/30 px-4 py-2.5">
            <UserCheck className="h-4.5 w-4.5 text-brand-400" />
            <span className="text-xs font-bold text-slate-200">
              State Engine Connected
            </span>
          </div>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Awaiting Verification
            </p>
            <h3 className="text-lg font-black text-slate-800 mt-0.5">
              {formatCurrency(stats.totalPendingValue)}
            </h3>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Book Capital
            </p>
            <h3 className="text-lg font-black text-slate-800 mt-0.5">
              {formatCurrency(stats.totalActiveValue)}
            </h3>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-premium flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              NPA At Risk
            </p>
            <h3 className="text-lg font-black text-slate-800 mt-0.5">
              {formatCurrency(stats.totalDefaultedValue)}
            </h3>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {columnsData.map((column) => {
          const Icon = column.icon;
          return (
            <div
              key={column.id}
              className={`rounded-2xl border-t-4 border border-slate-200 shadow-premium flex flex-col h-[75vh] ${column.colorClass}`}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-150 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Icon className="h-4.5 w-4.5 text-slate-600" />
                    <span>{column.title}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {column.subtitle}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${column.badgeColor}`}
                >
                  {column.loans.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {column.loans.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                    <HelpCircle className="h-8 w-8 text-slate-300 stroke-[1.5]" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                      No loans
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      Empty pipeline ledger stage
                    </p>
                  </div>
                ) : (
                  column.loans.map((loan) => {
                    const borrower = borrowers.find(
                      (b) => b.id === loan.borrowerId,
                    );
                    const creditScore = borrower ? borrower.creditScore : 700;
                    return (
                      <div
                        key={loan.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-premium smooth-transition flex flex-col justify-between space-y-4"
                      >
                        {/* Card Header Info */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-400">
                              {loan.id}
                            </span>
                            <StatusBadge status={loan.status} />
                          </div>
                          <h4 className="text-xs font-black text-slate-800 mt-1">
                            {loan.borrowerName}
                          </h4>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                            {loan.loanType} • {loan.tenure} Mos @{" "}
                            {loan.interestRate}%
                          </p>
                        </div>

                        {/* Card Core Value */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Sanctioned
                            </p>
                            <p className="text-sm font-extrabold text-slate-800">
                              {formatCurrency(loan.amount)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              Risk Index
                            </p>
                            <span
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                creditScore >= 750
                                  ? "bg-emerald-100 text-emerald-800"
                                  : creditScore >= 650
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              Score: {creditScore}
                            </span>
                          </div>
                        </div>

                        {/* Quick Action Decision Buttons */}
                        <div className="border-t border-slate-100 pt-3 space-y-1.5">
                          {loan.status === "Pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(loan.id, "Active")
                                }
                                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm cursor-pointer smooth-transition"
                              >
                                <span>Disburse</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(loan.id, "Closed")
                                }
                                className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[10px] cursor-pointer smooth-transition"
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {loan.status === "Active" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(loan.id, "Closed")
                                }
                                className="flex-1 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] cursor-pointer smooth-transition"
                              >
                                Mark Settled
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(loan.id, "Defaulted")
                                }
                                className="flex-1 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] cursor-pointer smooth-transition"
                              >
                                Flag Default
                              </button>
                            </div>
                          )}

                          {loan.status === "Defaulted" && (
                            <button
                              onClick={() =>
                                handleStatusChange(loan.id, "Closed")
                              }
                              className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] cursor-pointer smooth-transition"
                            >
                              Mark Recovered & Close
                            </button>
                          )}

                          {loan.status === "Closed" && (
                            <p className="text-center text-[9px] font-bold text-emerald-600 bg-emerald-50/50 py-1 rounded-md">
                              Portfolio Reconciled
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
