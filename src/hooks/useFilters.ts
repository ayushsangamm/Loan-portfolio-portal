import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { 
  setStatusFilter, 
  setSearchFilter, 
  setSorting, 
  setPage, 
  resetFilters 
} from '../features/loans/loansSlice';
import type { LoanStatus } from '../features/loans/loanTypes';

export const useFilters = () => {
  const dispatch = useAppDispatch();
  const loans = useAppSelector((state) => state.loans.loans);
  const filters = useAppSelector((state) => state.loans.filters);

  // 1. Apply Filtering and Searching
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      // Status Filter
      const matchesStatus = 
        filters.status === 'All' || 
        loan.status === filters.status;

      // Search Filter (ID or Borrower Name)
      const searchTerm = filters.search.toLowerCase().trim();
      const matchesSearch = 
        searchTerm === '' || 
        loan.id.toLowerCase().includes(searchTerm) || 
        loan.borrowerName.toLowerCase().includes(searchTerm);

      return matchesStatus && matchesSearch;
    });
  }, [loans, filters.status, filters.search]);

  // 2. Apply Sorting
  const sortedLoans = useMemo(() => {
    if (!filters.sortBy) return filteredLoans;

    return [...filteredLoans].sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (filters.sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (filters.sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredLoans, filters.sortBy, filters.sortOrder]);

  // 3. Apply Pagination
  const totalFilteredCount = sortedLoans.length;
  const totalPages = Math.ceil(totalFilteredCount / filters.limit) || 1;
  
  // Safe bounds check for page index
  const currentPage = Math.min(filters.page, totalPages);
  
  const paginatedLoans = useMemo(() => {
    const startIndex = (currentPage - 1) * filters.limit;
    return sortedLoans.slice(startIndex, startIndex + filters.limit);
  }, [sortedLoans, currentPage, filters.limit]);

  // Action Dispatch wrappers
  const changeStatus = (status: LoanStatus | 'All') => {
    dispatch(setStatusFilter(status));
  };

  const changeSearch = (search: string) => {
    dispatch(setSearchFilter(search));
  };

  const changeSorting = (sortBy: 'amount' | 'dueDate' | 'status' | '') => {
    const isSameField = filters.sortBy === sortBy;
    const sortOrder = isSameField && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy, sortOrder }));
  };

  const changePage = (page: number) => {
    dispatch(setPage(page));
  };

  const clearAllFilters = () => {
    dispatch(resetFilters());
  };

  return {
    filters,
    filteredLoans: sortedLoans, // Fully searched and sorted
    paginatedLoans,             // Paginated slice for displaying
    totalPages,
    totalFilteredCount,
    currentPage,
    changeStatus,
    changeSearch,
    changeSorting,
    changePage,
    clearAllFilters
  };
};
