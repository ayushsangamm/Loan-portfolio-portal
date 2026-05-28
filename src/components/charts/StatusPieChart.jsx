import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export const StatusPieChart = ({ loans }) => {
  const chartData = useMemo(() => {
    const counts = {
      Active: 0,
      Closed: 0,
      Pending: 0,
      Defaulted: 0,
    };

    loans.forEach((loan) => {
      counts[loan.status]++;
    });

    return [
      { name: "Active", value: counts.Active, color: "#10b981" },
      { name: "Closed", value: counts.Closed, color: "#64748b" },
      { name: "Pending", value: counts.Pending, color: "#f59e0b" },
      { name: "Defaulted", value: counts.Defaulted, color: "#f43f5e" },
    ].filter((item) => item.value > 0); // Don't show empty statuses
  }, [loans]);

  const totalLoans = useMemo(() => {
    return loans.length;
  }, [loans]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage =
        totalLoans > 0 ? ((item.value / totalLoans) * 100).toFixed(1) : 0;
      return (
        <div className="rounded-xl border border-slate-150 bg-white/95 p-3 shadow-premium backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-bold text-slate-800">
              {item.name}
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {item.value} Loans{" "}
            <span className="text-xs font-medium text-slate-400">
              ({percentage}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-80 w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium">
      <div className="mb-4">
        <h3 className="text-sm font-bold tracking-tight text-slate-800 md:text-base">
          Portfolio Distribution
        </h3>
        <p className="text-xs text-slate-400 leading-normal">
          Status breakdown of currently managed loans
        </p>
      </div>

      <div className="flex flex-1 items-center justify-between gap-4">
        {/* Donut Chart container */}
        <div className="h-44 w-1/2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Middle text for donut hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800">
              {totalLoans}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        {/* Legend listing */}
        <div className="flex-1 space-y-3 pl-2">
          {chartData.map((item) => {
            const percentage =
              totalLoans > 0 ? ((item.value / totalLoans) * 100).toFixed(1) : 0;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-600">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800">{item.value}</span>
                  <span className="ml-1 text-[10px] text-slate-400 font-semibold">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusPieChart;
