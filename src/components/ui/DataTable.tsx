import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TableSkeleton } from './Loader';

export interface Column<T> {
  header: string;
  // Can be a direct object key, or a custom render function returning JSX
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortField?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  // Optional sorting hooks
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  sortBy,
  sortOrder,
  onSort
}: DataTableProps<T>) {
  
  if (isLoading) {
    return <TableSkeleton rows={6} cols={columns.length} />;
  }

  const renderCellContent = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return String(item[column.accessor] ?? '');
  };

  const handleHeaderClick = (column: Column<T>) => {
    if (column.sortable && onSort && column.sortField) {
      onSort(column.sortField);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-150">
            <tr>
              {columns.map((column, idx) => {
                const isSorted = sortBy && column.sortField === sortBy;
                return (
                  <th
                    key={idx}
                    onClick={() => handleHeaderClick(column)}
                    className={`
                      px-6 py-4.5 font-bold transition-colors select-none
                      ${column.sortable && onSort ? 'cursor-pointer hover:bg-slate-100/50 hover:text-slate-800' : ''}
                    `}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{column.header}</span>
                      {column.sortable && onSort && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-brand-600" /> : <ArrowDown className="h-3 w-3 text-brand-600" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-350 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-semibold text-slate-400">No records found matching filters.</p>
                    <p className="text-xs text-slate-350 mt-1 leading-normal">Try clearing search parameters or adjusting active criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`
                    group transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-slate-50/50' : ''}
                  `}
                >
                  {columns.map((column, cIdx) => (
                    <td 
                      key={cIdx} 
                      className="px-6 py-4.5 text-slate-700 font-medium group-hover:text-slate-900 border-none"
                    >
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
