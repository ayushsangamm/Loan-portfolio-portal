import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  CheckCircle, 
  Coins, 
  AlertOctagon,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useLoans } from '../hooks/useLoans';
import { LoanCard } from '../components/ui/LoanCard';
import { LoanTrendChart } from '../components/charts/LoanTrendChart';
import { StatusPieChart } from '../components/charts/StatusPieChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DataTable } from '../components/ui/DataTable';
import type { Column } from '../components/ui/DataTable';
import { CardSkeleton, ChartSkeleton } from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import type { Loan } from '../features/loans/loanTypes';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { loans, isLoading, summaryStats, recentLoans } = useLoans();

  const handleRowClick = (loan: Loan) => {
    navigate(`/loans/${loan.id}`);
  };

  const columns: Column<Loan>[] = [
    { header: 'Loan ID', accessor: 'id' },
    { header: 'Borrower', accessor: 'borrowerName' },
    { 
      header: 'Amount', 
      accessor: (loan) => (
        <span className="font-bold text-slate-800">{formatCurrency(loan.amount)}</span>
      )
    },
    { 
      header: 'Disbursement Date', 
      accessor: (loan) => {
        const d = new Date(loan.disbursementDate);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    },
    { 
      header: 'Status', 
      accessor: (loan) => <StatusBadge status={loan.status} /> 
    },
    {
      header: 'Actions',
      accessor: (loan) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/loans/${loan.id}`);
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 smooth-transition"
        >
          <span>Ledger</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <div>
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner segment */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 p-6 md:p-8 border border-slate-800 text-white shadow-premium">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl leading-none">Portfolio Overview</h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-normal">Operational risk indicators and capital trends report as of today.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/30 px-4 py-2.5">
            <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Active Capital Allocation</span>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <LoanCard
          title="Total Portfolio Value"
          value={formatCurrency(summaryStats.totalPortfolioValue)}
          icon={Coins}
          description="Active Capital"
          color="blue"
        />
        <LoanCard
          title="Total Loans"
          value={summaryStats.totalLoans}
          icon={Briefcase}
          description="Cumulative Ledger"
          color="indigo"
        />
        <LoanCard
          title="Active Accounts"
          value={summaryStats.activeLoans}
          icon={CheckCircle}
          description="Earning Accounts"
          color="emerald"
        />
        <LoanCard
          title="Default Rate"
          value={`${summaryStats.defaultRate}%`}
          icon={AlertOctagon}
          description="Risk Indicator"
          color="rose"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LoanTrendChart loans={loans} />
        </div>
        <div>
          <StatusPieChart loans={loans} />
        </div>
      </div>

      {/* Recent Loans table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight leading-none md:text-lg">Recent Disbursements</h3>
            <p className="text-xs text-slate-400 mt-1 leading-normal">Review latest portfolios added onto the gateway</p>
          </div>
          <button 
            onClick={() => navigate('/loans')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800 smooth-transition"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <DataTable
          data={recentLoans}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default Dashboard;
