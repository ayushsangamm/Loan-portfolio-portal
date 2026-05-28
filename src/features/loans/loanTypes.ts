export type LoanStatus = 'Active' | 'Pending' | 'Closed' | 'Defaulted';
export type LoanType = 'Personal' | 'Business' | 'Home' | 'Education';

export interface RepaymentPeriod {
  month: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  remainingPrincipal: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface PaymentHistoryItem {
  id: string;
  paymentDate: string;
  amountPaid: number;
  status: 'Paid' | 'Late' | 'Missed';
  notes?: string;
}

export interface Loan {
  id: string;
  borrowerId: string;
  borrowerName: string;
  amount: number;
  interestRate: number; // Annual Rate (e.g. 10.5)
  tenure: number; // In months
  status: LoanStatus;
  loanType: LoanType;
  disbursementDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  emiAmount: number;
  purpose: string;
  repaymentSchedule: RepaymentPeriod[];
  paymentHistory: PaymentHistoryItem[];
}

export interface LoansState {
  loans: Loan[];
  selectedLoan: Loan | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    status: LoanStatus | 'All';
    search: string;
    sortBy: 'amount' | 'dueDate' | 'status' | '';
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
  };
}
