/**
 * Skeleton Loader for Metric/Summary Cards.
 */
export const CardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium">
    <div className="flex items-center justify-between">
      <div className="h-4 w-24 rounded-md bg-slate-200" />
      <div className="h-10 w-10 rounded-xl bg-slate-100" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-8 w-36 rounded-lg bg-slate-200" />
      <div className="h-3.5 w-16 rounded-md bg-slate-100" />
    </div>
  </div>
);

/**
 * Skeleton Loader for Data Tables.
 */
export const TableSkeleton = ({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) => (
  <div className="w-full animate-pulse border-collapse overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-premium">
    <div className="border-b border-slate-200 bg-slate-50/50 p-4">
      <div className="h-5 w-40 rounded-md bg-slate-200" />
    </div>
    <div className="divide-y divide-slate-150 p-4 space-y-4">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center justify-between py-2">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div 
              key={cIdx} 
              className="h-4 rounded-md bg-slate-200" 
              style={{ width: `${Math.max(12, (cIdx + 1) * 14)}%` }} 
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton Loader for Dashboard Charts.
 */
export const ChartSkeleton = () => (
  <div className="flex h-80 w-full animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 shadow-premium">
    <div className="mb-6 flex w-full items-center justify-between">
      <div className="h-5 w-44 rounded-md bg-slate-200" />
      <div className="h-4 w-20 rounded-md bg-slate-100" />
    </div>
    <div className="flex w-full flex-1 items-end gap-3.5">
      {Array.from({ length: 12 }).map((_, idx) => (
        <div 
          key={idx} 
          className="w-full rounded-t-lg bg-slate-200/80" 
          style={{ height: `${Math.max(10, Math.sin(idx) * 50 + 50)}%` }} 
        />
      ))}
    </div>
  </div>
);
