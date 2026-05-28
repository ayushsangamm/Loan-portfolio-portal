import type { LoanStatus } from '../../features/loans/loanTypes';

interface StatusBadgeProps {
  status: LoanStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Closed: 'bg-slate-100 text-slate-600 border-slate-200/80',
    Defaulted: 'bg-rose-50 text-rose-700 border-rose-200/80',
  };

  const dots = {
    Active: 'bg-emerald-500',
    Pending: 'bg-amber-500',
    Closed: 'bg-slate-400',
    Defaulted: 'bg-rose-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-2xs tracking-wide ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
