import { useNavigate } from "react-router-dom";
import {
  Search,
  PlusCircle,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { useFilters } from "../hooks/useFilters";
import { useLoans } from "../hooks/useLoans";
import { StatusBadge } from "../components/ui/StatusBadge";
import { DataTable } from "../components/ui/DataTable";
import { formatCurrency } from "../utils/formatCurrency";

export const LoanList = () => {
  const navigate = useNavigate();
  const { isLoading } = useLoans();
  const {
    filters,
    paginatedLoans,
    totalPages,
    totalFilteredCount,
    currentPage,
    changeStatus,
    changeSearch,
    changeSorting,
    changePage,
    clearAllFilters,
  } = useFilters();

  const handleRowClick = (loan) => {
    navigate(`/loans/${loan.id}`);
  };

  const statusOptions = ["All", "Active", "Pending", "Closed", "Defaulted"];

  const columns = [
    {
      header: "Loan ID",
      accessor: "id",
      sortable: true,
      sortField: "id",
    },
    {
      header: "Borrower Name",
      accessor: (loan) => (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering row click details page
            navigate(`/borrowers/${loan.borrowerId}`);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-850 hover:underline smooth-transition"
        >
          <UserCheck className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-500" />
          <span>{loan.borrowerName}</span>
        </button>
      ),
    },
    {
      header: "Amount",
      accessor: (loan) => (
        <span className="font-bold text-slate-800">
          {formatCurrency(loan.amount)}
        </span>
      ),
      sortable: true,
      sortField: "amount",
    },
    {
      header: "Interest Rate",
      accessor: (loan) => (
        <span className="text-slate-600 font-bold">
          {loan.interestRate}%{" "}
          <span className="text-[10px] text-slate-400 font-semibold">p.a.</span>
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (loan) => <StatusBadge status={loan.status} />,
      sortable: true,
      sortField: "status",
    },
    {
      header: "Due Date",
      accessor: (loan) => {
        const d = new Date(loan.dueDate);
        return d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
      sortable: true,
      sortField: "dueDate",
    },
    {
      header: "Actions",
      accessor: (loan) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/loans/${loan.id}`);
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 smooth-transition"
        >
          <span>Ledger</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section with CTAs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl leading-none">
            Loan Portfolio Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-normal">
            View, search, filter, and audit active portfolio accounts (
            {totalFilteredCount} items).
          </p>
        </div>

        <button
          onClick={() => navigate("/add-loan")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/10 hover:bg-brand-700 smooth-transition"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Disburse New Loan</span>
        </button>
      </div>

      {/* Filters and Search Bar Row */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-premium md:flex-row md:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by borrower name or loan ID..."
            value={filters.search}
            onChange={(e) => changeSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/20 py-2.5 pl-10 pr-4 text-xs font-medium placeholder-slate-400 text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white"
          />
        </div>

        {/* Status quick selections */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => changeStatus(opt)}
              className={`
                rounded-xl px-3 py-2 text-xs font-semibold border smooth-transition
                ${
                  filters.status === opt
                    ? "bg-brand-600 text-white border-brand-600 shadow-2xs"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"
                }
              `}
            >
              {opt}
            </button>
          ))}

          {/* Reset Filters CTA */}
          {(filters.search || filters.status !== "All" || filters.sortBy) && (
            <button
              onClick={clearAllFilters}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 smooth-transition"
              title="Reset filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={paginatedLoans}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={(field) => changeSorting(field)}
      />

      {/* Custom Pagination Controllers */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Page {currentPage} of {totalPages} ({totalFilteredCount} matching)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none smooth-transition shadow-3xs"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pNum = idx + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => changePage(pNum)}
                  className={`
                    hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold border smooth-transition
                    ${
                      currentPage === pNum
                        ? "bg-brand-600 text-white border-brand-600 shadow-2xs"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }
                  `}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none smooth-transition shadow-3xs"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanList;
