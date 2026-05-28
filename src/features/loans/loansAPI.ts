import type { Loan, LoanStatus } from './loanTypes';
import dbData from '../../data/db.json';

const STORAGE_KEY = 'enterprise_loans';

// Helper to fetch from localStorage or initialize with db.json data
const getLocalLoans = (): Loan[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbData.loans));
    return dbData.loans as Loan[];
  }
  return JSON.parse(data) as Loan[];
};

const saveLocalLoans = (loans: Loan[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
};

// Simulate simulated async network delay (e.g. 400ms) to show skeleton loaders
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loansAPI = {
  getLoans: async (): Promise<Loan[]> => {
    await delay(400); // Network simulation
    return getLocalLoans();
  },

  getLoanById: async (id: string): Promise<Loan> => {
    await delay(300);
    const loans = getLocalLoans();
    const loan = loans.find(l => l.id === id);
    if (!loan) throw new Error('Loan account ledger not found');
    return loan;
  },

  addLoan: async (loan: Omit<Loan, 'id'>): Promise<Loan> => {
    await delay(500);
    const loans = getLocalLoans();
    const nextId = `LON${String(loans.length + 1).padStart(3, '0')}`;
    const newLoan: Loan = {
      ...loan,
      id: nextId
    };
    loans.unshift(newLoan); // Prepend new disbersed capital
    saveLocalLoans(loans);
    return newLoan;
  },

  updateLoanStatus: async (id: string, status: LoanStatus): Promise<Loan> => {
    await delay(300);
    const loans = getLocalLoans();
    const index = loans.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Loan ledger account not found');
    loans[index].status = status;
    saveLocalLoans(loans);
    return loans[index];
  }
};
