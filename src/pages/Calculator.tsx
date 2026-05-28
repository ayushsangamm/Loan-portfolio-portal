import { useState, useMemo } from 'react';
import { 
  Coins, 
  Percent, 
  Calendar, 
  TrendingUp, 
  ArrowRightLeft, 
  Download, 
  Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';

export const Calculator = () => {
  // Input states
  const [principal, setPrincipal] = useState<number>(500000); // 5 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(12); // 12% default
  const [tenure, setTenure] = useState<number>(24); // 24 Months default

  // Financial calculations memoized for efficiency
  const calculations = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    
    let emi = 0;
    if (monthlyRate > 0) {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    } else {
      emi = principal / tenure;
    }

    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;

    // Generate month-on-month amortization schedule
    const schedule = [];
    let remainingPrincipal = principal;
    for (let month = 1; month <= tenure; month++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = emi - interestPayment;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);
      schedule.push({
        month,
        emi,
        interest: interestPayment,
        principal: principalPayment,
        balance: remainingPrincipal
      });
    }

    return {
      emi,
      totalPayment,
      totalInterest,
      schedule
    };
  }, [principal, interestRate, tenure]);

  // Chart data formatting
  const chartData = [
    { name: 'Principal Amount', value: principal, color: '#3d5e87' }, // brand-600
    { name: 'Total Interest Payable', value: calculations.totalInterest, color: '#f59e0b' } // amber
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 p-6 md:p-8 border border-slate-800 text-white shadow-premium">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl leading-none flex items-center gap-2">
              <Sparkles className="h-5.5 w-5.5 text-amber-400" />
              <span>Interactive Credit Worksheet</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-normal">
              Formulate credit structures, compute EMIs, and simulate dynamic amortization ledgers in real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/30 px-4 py-2.5">
            <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">RBI Standard Formulas</span>
          </div>
        </div>
      </div>

      {/* Calculator Board */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Sliders Input Worksheet (2 Cols on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium">
            <h3 className="text-base font-bold text-slate-800 tracking-tight leading-none mb-6">Simulation Inputs</h3>
            
            <div className="space-y-8">
              {/* Sliders 1: Loan Principal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-brand-500" />
                    <span>Loan Principal Amount</span>
                  </label>
                  <span className="text-sm font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    {formatCurrency(principal)}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="5000000" 
                  step="10000"
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>₹10,000</span>
                  <span>₹25L</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Sliders 2: Interest Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Percent className="h-4 w-4 text-brand-500" />
                    <span>Annual Interest Rate (% p.a.)</span>
                  </label>
                  <span className="text-sm font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    {interestRate}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="36" 
                  step="0.5"
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>5%</span>
                  <span>18%</span>
                  <span>36%</span>
                </div>
              </div>

              {/* Sliders 3: Tenure Months */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-500" />
                    <span>Amortization Tenure</span>
                  </label>
                  <span className="text-sm font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    {tenure} Months
                  </span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="60" 
                  step="1"
                  value={tenure} 
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>3 Mos</span>
                  <span>30 Mos</span>
                  <span>60 Mos</span>
                </div>
              </div>
            </div>
          </div>

          {/* EMI Card Results Dashboard */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-5 shadow-sm text-center">
              <p className="text-[10px] font-bold text-brand-600/80 uppercase tracking-wider">Monthly installment (EMI)</p>
              <h2 className="text-2xl font-black text-brand-800 mt-2">{formatCurrency(calculations.emi)}</h2>
              <p className="text-[10px] text-slate-400 mt-1">Due every cycle month</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/20 p-5 shadow-sm text-center">
              <p className="text-[10px] font-bold text-amber-600/95 uppercase tracking-wider">Total Interest Payable</p>
              <h2 className="text-2xl font-black text-amber-600 mt-2">{formatCurrency(calculations.totalInterest)}</h2>
              <p className="text-[10px] text-slate-400 mt-1">Cost of borrowing capital</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-5 shadow-sm text-center">
              <p className="text-[10px] font-bold text-emerald-600/90 uppercase tracking-wider">Total Lifetime Repayment</p>
              <h2 className="text-2xl font-black text-emerald-700 mt-2">{formatCurrency(calculations.totalPayment)}</h2>
              <p className="text-[10px] text-slate-400 mt-1">Total principal + interest</p>
            </div>
          </div>
        </div>

        {/* Visual Charts Summary (1 Col on large screens) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight leading-none mb-2 flex items-center gap-2">
              <ArrowRightLeft className="h-4.5 w-4.5 text-brand-500" />
              <span>Asset/Interest Breakdown</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">Visual representation of total interest overhead vs core loan capital.</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[11px] font-bold text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-sm">
              %
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Interest Percentage Ratio</p>
              <p className="text-sm font-extrabold text-slate-700">
                {((calculations.totalInterest / calculations.totalPayment) * 100).toFixed(1)}% of total payment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Month-on-Month Amortization Schedule Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-premium overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight leading-none">Amortization Ledger Schedule</h3>
            <p className="text-xs text-slate-400 mt-1 leading-normal">Granular amortization table outlining breakdown of principal vs interest monthly deductions.</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-2xs hover:bg-slate-50 smooth-transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Print Ledger Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-150">
                <th className="px-6 py-4.5">Installment Cycle</th>
                <th className="px-6 py-4.5">Monthly EMI</th>
                <th className="px-6 py-4.5">Principal Deduction</th>
                <th className="px-6 py-4.5">Interest Charge</th>
                <th className="px-6 py-4.5">Remaining Capital Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {calculations.schedule.slice(0, 12).map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/40 smooth-transition">
                  <td className="px-6 py-4 font-bold text-slate-800">Month {row.month}</td>
                  <td className="px-6 py-4">{formatCurrency(row.emi)}</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">{formatCurrency(row.principal)}</td>
                  <td className="px-6 py-4 text-amber-600">{formatCurrency(row.interest)}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
              {calculations.schedule.length > 12 && (
                <tr className="bg-slate-50/20">
                  <td colSpan={5} className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/40">
                    Showing first 12 cycles of {tenure} total installments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
