import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Wallet, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin,
  Loader2,
  FileCheck2,
  ListRestart
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { fetchLoanByIdAsync, updateLoanStatusAsync, clearSelectedLoan } from '../features/loans/loansSlice';
import { fetchBorrowerByIdAsync, clearSelectedBorrower } from '../features/borrowers/borrowersSlice';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency } from '../utils/formatCurrency';
import type { LoanStatus } from '../features/loans/loanTypes';

export const LoanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedLoan, status: loanStatus } = useAppSelector((state) => state.loans);
  const { selectedBorrower } = useAppSelector((state) => state.borrowers);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch Loan Details
  useEffect(() => {
    if (id) {
      dispatch(fetchLoanByIdAsync(id));
    }
    return () => {
      dispatch(clearSelectedLoan());
      dispatch(clearSelectedBorrower());
    };
  }, [id, dispatch]);

  // Fetch linked Borrower Details
  useEffect(() => {
    if (selectedLoan?.borrowerId) {
      dispatch(fetchBorrowerByIdAsync(selectedLoan.borrowerId));
    }
  }, [selectedLoan?.borrowerId, dispatch]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!id) return;
    const newStatus = e.target.value as LoanStatus;
    
    setIsUpdatingStatus(true);
    try {
      await dispatch(updateLoanStatusAsync({ id, status: newStatus })).unwrap();
    } catch (err) {
      console.error("Failed to update loan status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Helper to categorize credit scores
  const getCreditScoreDetails = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 680) return { label: 'Good', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (score >= 550) return { label: 'Fair', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Subprime', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const isLoading = loanStatus === 'loading' || !selectedLoan || !selectedBorrower;

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 animate-spin">
          <Loader2 className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
          Fetching complete loan audit details...
        </p>
      </div>
    );
  }

  const creditDetails = getCreditScoreDetails(selectedBorrower.creditScore);

  return (
    <div className="space-y-6">
      {/* Back to list and Title section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/loans')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 shadow-2xs smooth-transition"
            title="Go back to portfolio ledger"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Ledger Details</span>
              <span className="h-3 w-[1px] bg-slate-250" />
              <span className="text-xs font-bold text-brand-600">{selectedLoan.id}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl mt-0.5 leading-none">
              Loan Account Manager
            </h1>
          </div>
        </div>

        {/* Dynamic Status Switcher (Redux Action) */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-2xs">
          <label htmlFor="status-select" className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <ListRestart className="h-3.5 w-3.5" />
            <span>Manage Status:</span>
          </label>
          <div className="relative">
            <select
              id="status-select"
              value={selectedLoan.status}
              onChange={handleStatusChange}
              disabled={isUpdatingStatus}
              className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none hover:bg-slate-50 disabled:opacity-50 smooth-transition"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
              <option value="Defaulted">Defaulted</option>
            </select>
          </div>
          {isUpdatingStatus && <Loader2 className="h-3.5 w-3.5 text-brand-600 animate-spin" />}
        </div>
      </div>

      {/* Main Metadata Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Panel 1: Borrower Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-150">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Borrower Information</h3>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Profile Overview</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium text-slate-600">
            {/* Name */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
              <button 
                onClick={() => navigate(`/borrowers/${selectedBorrower.id}`)}
                className="text-sm font-bold text-brand-600 hover:text-brand-850 hover:underline mt-1 smooth-transition"
              >
                {selectedBorrower.name}
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{selectedBorrower.email}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>+91 {selectedBorrower.phone}</span>
            </div>

            {/* City */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{selectedBorrower.city}, India</span>
            </div>

            <div className="h-[1px] bg-slate-150 my-2" />

            {/* Credit Score Gauge (Visual Indicator) */}
            <div className="rounded-xl border border-slate-150 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credit Bureau Score</span>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide ${creditDetails.color}`}>
                  {creditDetails.label}
                </span>
              </div>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                  {selectedBorrower.creditScore}
                </span>
                {/* Horizontal simple progress bar */}
                <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden mb-1">
                  <div 
                    className={`h-full rounded-full ${
                      selectedBorrower.creditScore >= 750 ? 'bg-emerald-500' :
                      selectedBorrower.creditScore >= 680 ? 'bg-blue-500' :
                      selectedBorrower.creditScore >= 550 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${((selectedBorrower.creditScore - 300) / 550) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Loan Particulars */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-150 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Financial Specifications</h3>
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Loan Agreement details</p>
                </div>
              </div>
              <StatusBadge status={selectedLoan.status} />
            </div>

            <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs text-slate-600 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Principal Amount</p>
                <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(selectedLoan.amount)}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interest Rate</p>
                <p className="text-base font-bold text-slate-800 mt-1">{selectedLoan.interestRate}% <span className="text-[10px] text-slate-400 font-semibold">p.a.</span></p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loan Tenure</p>
                <p className="text-base font-bold text-slate-800 mt-1">{selectedLoan.tenure} Months</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly EMI (Calculated)</p>
                <p className="text-base font-bold text-brand-600 mt-1">{formatCurrency(selectedLoan.emiAmount)}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disbursement Date</p>
                <p className="text-xs font-bold text-slate-800 mt-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{new Date(selectedLoan.disbursementDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maturity Date</p>
                <p className="text-xs font-bold text-slate-800 mt-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{new Date(selectedLoan.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/30 p-4 text-xs font-medium text-slate-500 leading-normal">
            <span className="font-bold text-slate-700">Statement of Purpose:</span> {selectedLoan.purpose}
          </div>
        </div>
      </div>

      {/* Repayment Schedule & Timeline split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Amortization Breakdown (Left 2 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight md:text-base">Amortization & Repayment Breakdown</h3>
            <p className="text-xs text-slate-400 leading-normal">Amortized month-wise schedule of principal, interest, and monthly outstanding balance</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50/50 font-bold uppercase text-slate-500 border-b border-slate-150">
                <tr>
                  <th className="px-4 py-3 text-center">Month</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Installment</th>
                  <th className="px-4 py-3">Principal Portion</th>
                  <th className="px-4 py-3">Interest Portion</th>
                  <th className="px-4 py-3">Outstanding Balance</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-medium">
                {selectedLoan.repaymentSchedule.map((p) => (
                  <tr key={p.month} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-slate-800">{p.month}</td>
                    <td className="px-4 py-3 text-slate-650">
                      {new Date(p.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(p.emiAmount)}</td>
                    <td className="px-4 py-3 text-emerald-650">{formatCurrency(p.principal)}</td>
                    <td className="px-4 py-3 text-rose-500">{formatCurrency(p.interest)}</td>
                    <td className="px-4 py-3 text-slate-800 font-bold">{formatCurrency(p.remainingPrincipal)}</td>
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                        ${p.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 
                          p.status === 'Overdue' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History Timeline (Right 1 column) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium flex flex-col">
          <div className="pb-4 border-b border-slate-150 mb-5">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight md:text-base">Payment History</h3>
            <p className="text-xs text-slate-400 leading-normal">Chronological timeline of receipts</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-2 max-h-[360px]">
            {selectedLoan.paymentHistory.length === 0 ? (
              <div className="flex h-40 w-full flex-col items-center justify-center text-center">
                <Clock className="h-6 w-6 text-slate-350 animate-pulse" />
                <p className="mt-2 text-xs font-bold text-slate-400">No transactions recorded</p>
                <p className="text-[10px] text-slate-350 leading-normal">No scheduled repayments have fallen due.</p>
              </div>
            ) : (
              // Map timeline
              selectedLoan.paymentHistory.map((item, idx) => (
                <div key={item.id} className="relative flex gap-3 pb-1">
                  {/* Vertical connecting line */}
                  {idx !== selectedLoan.paymentHistory.length - 1 && (
                    <span className="absolute left-[13px] top-7 bottom-0 w-[1.5px] bg-slate-150" />
                  )}

                  {/* Bullet Ring */}
                  <div className={`
                    z-10 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border shadow-3xs
                    ${item.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      item.status === 'Late' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-rose-50 text-rose-600 border-rose-200'}
                  `}>
                    {item.status === 'Paid' ? <FileCheck2 className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  </div>

                  {/* Text Particulars */}
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{formatCurrency(item.amountPaid || selectedLoan.emiAmount)}</span>
                      <span className={`rounded px-1 text-[9px] font-extrabold uppercase ${
                        item.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 
                        item.status === 'Late' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {new Date(item.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {item.notes && (
                      <p className="mt-1 text-[10px] text-slate-500 leading-normal bg-slate-50/60 rounded p-1.5 border border-slate-100">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;
