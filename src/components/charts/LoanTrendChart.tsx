import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { Loan } from '../../features/loans/loanTypes';
import { formatCurrency } from '../../utils/formatCurrency';

interface LoanTrendChartProps {
  loans: Loan[];
}

export const LoanTrendChart = ({ loans }: LoanTrendChartProps) => {
  const chartData = useMemo(() => {
    // Generate chronological quarters for 2023 - 2025
    const quarters = [
      { id: '2023-Q1', name: 'Q1 \'23', start: '2023-01-01', end: '2023-03-31', amount: 0 },
      { id: '2023-Q2', name: 'Q2 \'23', start: '2023-04-01', end: '2023-06-30', amount: 0 },
      { id: '2023-Q3', name: 'Q3 \'23', start: '2023-07-01', end: '2023-09-30', amount: 0 },
      { id: '2023-Q4', name: 'Q4 \'23', start: '2023-10-01', end: '2023-12-31', amount: 0 },
      
      { id: '2024-Q1', name: 'Q1 \'24', start: '2024-01-01', end: '2024-03-31', amount: 0 },
      { id: '2024-Q2', name: 'Q2 \'24', start: '2024-04-01', end: '2024-06-30', amount: 0 },
      { id: '2024-Q3', name: 'Q3 \'24', start: '2024-07-01', end: '2024-09-30', amount: 0 },
      { id: '2024-Q4', name: 'Q4 \'24', start: '2024-10-01', end: '2024-12-31', amount: 0 },
      
      { id: '2025-Q1', name: 'Q1 \'25', start: '2025-01-01', end: '2025-03-31', amount: 0 },
      { id: '2025-Q2', name: 'Q2 \'25', start: '2025-04-01', end: '2025-06-30', amount: 0 },
      { id: '2025-Q3', name: 'Q3 \'25', start: '2025-07-01', end: '2025-09-30', amount: 0 },
      { id: '2025-Q4', name: 'Q4 \'25', start: '2025-10-01', end: '2025-12-31', amount: 0 },
    ];

    // Allocate loan disbursements to quarters
    loans.forEach((loan) => {
      // Exclude pending loans from historical disbursements
      if (loan.status === 'Pending') return;
      
      const loanDate = new Date(loan.disbursementDate);
      const q = quarters.find(
        (quarter) => loanDate >= new Date(quarter.start) && loanDate <= new Date(quarter.end)
      );

      if (q) {
        q.amount += loan.amount;
      }
    });

    return quarters;
  }, [loans]);

  // Custom tooltips with full ₹ formatting
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-150 bg-white/95 p-3.5 shadow-premium backdrop-blur-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{payload[0].payload.id.replace('-', ' ')}</p>
          <p className="mt-1.5 text-sm font-bold text-brand-700">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Disbursed Capital</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium">
      <div className="mb-4">
        <h3 className="text-sm font-bold tracking-tight text-slate-800 md:text-base">Capital Disbursement Trends</h3>
        <p className="text-xs text-slate-400 leading-normal">Quarterly overview of portfolio loan value disbursed (2023 – 2025)</p>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 550 }} 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 550 }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `₹${value / 100000}L`} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorDisbursed)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoanTrendChart;
