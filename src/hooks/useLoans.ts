import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { fetchLoansAsync } from '../features/loans/loansSlice';
import { fetchBorrowersAsync } from '../features/borrowers/borrowersSlice';

export const useLoans = () => {
  const dispatch = useAppDispatch();
  const { loans, status: loansStatus, error: loansError } = useAppSelector((state) => state.loans);
  const { borrowers, status: borrowersStatus } = useAppSelector((state) => state.borrowers);

  // Proactively fetch all loans and borrowers if the store is idle
  useEffect(() => {
    if (loansStatus === 'idle') {
      dispatch(fetchLoansAsync());
    }
    if (borrowersStatus === 'idle') {
      dispatch(fetchBorrowersAsync());
    }
  }, [loansStatus, borrowersStatus, dispatch]);

  const summaryStats = useMemo(() => {
    if (!loans.length) {
      return {
        totalLoans: 0,
        activeLoans: 0,
        totalPortfolioValue: 0,
        defaultRate: 0,
        defaultedLoans: 0,
        pendingLoans: 0,
        closedLoans: 0
      };
    }

    const totalLoans = loans.length;
    let activeLoans = 0;
    let totalPortfolioValue = 0;
    let defaultedLoans = 0;
    let pendingLoans = 0;
    let closedLoans = 0;

    loans.forEach((loan) => {
      switch (loan.status) {
        case 'Active':
          activeLoans++;
          totalPortfolioValue += loan.amount;
          break;
        case 'Defaulted':
          defaultedLoans++;
          break;
        case 'Pending':
          pendingLoans++;
          break;
        case 'Closed':
          closedLoans++;
          break;
      }
    });

    const defaultRate = totalLoans > 0 ? Number(((defaultedLoans / totalLoans) * 100).toFixed(1)) : 0;

    return {
      totalLoans,
      activeLoans,
      totalPortfolioValue,
      defaultRate,
      defaultedLoans,
      pendingLoans,
      closedLoans
    };
  }, [loans]);

  const recentLoans = useMemo(() => {
    // Return the latest 5 loans based on disbursement date
    return [...loans]
      .sort((a, b) => new Date(b.disbursementDate).getTime() - new Date(a.disbursementDate).getTime())
      .slice(0, 5);
  }, [loans]);

  return {
    loans,
    borrowers,
    isLoading: loansStatus === 'loading' || borrowersStatus === 'loading',
    isError: loansStatus === 'failed',
    errorMessage: loansError,
    summaryStats,
    recentLoans
  };
};
