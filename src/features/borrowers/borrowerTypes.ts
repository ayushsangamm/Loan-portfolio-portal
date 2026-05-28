export interface Borrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  creditScore: number; // 300 to 850
  city: string;
  employmentStatus: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired';
  annualIncome: number;
}

export interface BorrowersState {
  borrowers: Borrower[];
  selectedBorrower: Borrower | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
