import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Coins,
  Award,
  ShieldCheck,
  Activity,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/store";
import {
  fetchBorrowerByIdAsync,
  clearSelectedBorrower,
} from "../features/borrowers/borrowersSlice";
import { fetchLoansAsync } from "../features/loans/loansSlice";
import { StatusBadge } from "../components/ui/StatusBadge";
import { DataTable } from "../components/ui/DataTable";
import { formatCurrency } from "../utils/formatCurrency";

export const BorrowerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedBorrower, status: borrowerStatus } = useAppSelector(
    (state) => state.borrowers,
  );
  const { loans, status: loansStatus } = useAppSelector((state) => state.loans);

  // Proactively fetch all loans and current borrower
  useEffect(() => {
    if (id) {
      dispatch(fetchBorrowerByIdAsync(id));
    }
    if (loansStatus === "idle") {
      dispatch(fetchLoansAsync());
    }
    return () => {
      dispatch(clearSelectedBorrower());
    };
  }, [id, loansStatus, dispatch]);

  // Filter loans belonging to this borrower
  const borrowerLoans = useMemo(() => {
    if (!id || !loans.length) return [];
    return loans.filter((l) => l.borrowerId === id);
  }, [loans, id]);

  // Calculate cumulative stats
  const totalDisbursed = useMemo(() => {
    return borrowerLoans.reduce((sum, curr) => {
      return curr.status !== "Pending" ? sum + curr.amount : sum;
    }, 0);
  }, [borrowerLoans]);

  const activeEmiMonthly = useMemo(() => {
    return borrowerLoans.reduce((sum, curr) => {
      return curr.status === "Active" ? sum + curr.emiAmount : sum;
    }, 0);
  }, [borrowerLoans]);

  // Credit Rating Evaluator
  const getRatingInfo = (score) => {
    if (score >= 750) {
      return {
        label: "Excellent",
        desc: "Exceptional credit history. Low risk of default.",
        color: "text-emerald-500 border-emerald-200 bg-emerald-50",
        fill: "bg-emerald-500",
        ring: "border-emerald-500",
      };
    }
    if (score >= 680) {
      return {
        label: "Good",
        desc: "Consistent payment records. Approved for optimal interest rates.",
        color: "text-blue-500 border-blue-200 bg-blue-50",
        fill: "bg-blue-500",
        ring: "border-blue-500",
      };
    }
    if (score >= 550) {
      return {
        label: "Fair",
        desc: "Occasional late repayments. Moderate underwriting scrutiny required.",
        color: "text-amber-500 border-amber-200 bg-amber-50",
        fill: "bg-amber-500",
        ring: "border-amber-500",
      };
    }
    return {
      label: "Subprime",
      desc: "Repeated defaults recorded. Elevated risk tier.",
      color: "text-rose-500 border-rose-200 bg-rose-50",
      fill: "bg-rose-500",
      ring: "border-rose-500",
    };
  };

  const columns = [
    { header: "Loan ID", accessor: "id" },
    { header: "Loan Type", accessor: "loanType" },
    {
      header: "Disbursed Amount",
      accessor: (loan) => (
        <span className="font-bold text-slate-800">
          {formatCurrency(loan.amount)}
        </span>
      ),
    },
    {
      header: "Monthly EMI",
      accessor: (loan) => (
        <span className="font-semibold text-slate-650">
          {formatCurrency(loan.emiAmount)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (loan) => <StatusBadge status={loan.status} />,
    },
    {
      header: "Disbursement Date",
      accessor: (loan) => {
        const d = new Date(loan.disbursementDate);
        return d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      header: "Actions",
      accessor: (loan) => (
        <button
          onClick={() => navigate(`/loans/${loan.id}`)}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-850 smooth-transition"
        >
          <span>Ledger</span>
        </button>
      ),
    },
  ];

  const isLoading = borrowerStatus === "loading" || !selectedBorrower;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 animate-spin">
          <Loader2 className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
          Retrieving borrower credit dossier...
        </p>
      </div>
    );
  }

  const rating = getRatingInfo(selectedBorrower.creditScore);

  return (
    <div className="space-y-6">
      {/* Title segment */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate("/loans")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 shadow-2xs smooth-transition"
          title="Back to portfolio list"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Borrower profile
            </span>
            <span className="h-3 w-[1px] bg-slate-250" />
            <span className="text-xs font-bold text-brand-600">
              {selectedBorrower.id}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl mt-0.5 leading-none">
            Credit Dossier Summary
          </h1>
        </div>
      </div>

      {/* Profile & Score Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dossier info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-150">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {selectedBorrower.name}
              </h3>
              <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                {selectedBorrower.employmentStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium text-slate-600">
            {/* Email */}
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{selectedBorrower.email}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>+91 {selectedBorrower.phone}</span>
            </div>

            {/* City */}
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{selectedBorrower.city}, India</span>
            </div>

            {/* Income */}
            <div className="flex items-center gap-2.5">
              <Coins className="h-4.5 w-4.5 text-slate-400" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Verified Salary
                </span>
                <span className="font-bold text-slate-800">
                  {formatCurrency(selectedBorrower.annualIncome)}{" "}
                  <span className="text-[10px] text-slate-400 font-semibold">
                    / year
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Gauge Ring */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium flex flex-col justify-between">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-150">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Bureau Credit Quality
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
                CIBIL equivalent rating
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center py-4">
            {/* Round visual indicator gauge */}
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-12 border-slate-100 shadow-inner">
              {/* Overlay active color segments */}
              <div
                className={`absolute inset-0 rounded-full border-12 opacity-80 ${rating.ring}`}
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${
                    selectedBorrower.creditScore >= 750
                      ? "100% 0%, 100% 100%, 0% 100%, 0% 0%"
                      : selectedBorrower.creditScore >= 680
                        ? "100% 0%, 100% 100%, 50% 100%"
                        : selectedBorrower.creditScore >= 550
                          ? "100% 0%, 50% 50%"
                          : "50% 0%, 50% 50%"
                  })`,
                }}
              />

              <div className="z-10 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tight text-slate-850 leading-none">
                  {selectedBorrower.creditScore}
                </span>
                <span
                  className={`mt-2 rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${rating.color}`}
                >
                  {rating.label}
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] font-semibold text-slate-400 leading-normal px-2">
            {rating.desc}
          </p>
        </div>

        {/* Aggregated Loan volumes */}
        <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 shadow-premium flex flex-col justify-between">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
              <Activity className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Aggregated Balances
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
                Portfolio volume stats
              </p>
            </div>
          </div>

          <div className="space-y-4 py-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span>Total Disbursed Capital</span>
              <span className="font-bold text-slate-100">
                {formatCurrency(totalDisbursed)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span>Outstanding Installment EMI</span>
              <span className="font-bold text-brand-400">
                {formatCurrency(activeEmiMonthly)} / mo
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Linked Contracts</span>
              <span className="font-bold text-slate-100">
                {borrowerLoans.length} Loans
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-850/60 p-4 border border-slate-850 text-[10px] text-slate-400 leading-normal flex items-start gap-2.5">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Subject borrower profile matches underwriting policy regulations.
              Capital disbersals remain validated for further credit line
              expansion.
            </span>
          </div>
        </div>
      </div>

      {/* Linked Loans List table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 tracking-tight leading-none md:text-lg">
            Issued Loan Contracts
          </h3>
        </div>

        <DataTable data={borrowerLoans} columns={columns} />
      </div>
    </div>
  );
};

export default BorrowerProfile;
