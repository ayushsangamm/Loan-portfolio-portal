import type { Borrower } from './borrowerTypes';
import dbData from '../../data/db.json';

const STORAGE_KEY = 'enterprise_borrowers';

const getLocalBorrowers = (): Borrower[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbData.borrowers));
    return dbData.borrowers as Borrower[];
  }
  return JSON.parse(data) as Borrower[];
};

const saveLocalBorrowers = (borrowers: Borrower[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(borrowers));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const borrowersAPI = {
  getBorrowers: async (): Promise<Borrower[]> => {
    await delay(400);
    return getLocalBorrowers();
  },

  getBorrowerById: async (id: string): Promise<Borrower> => {
    await delay(300);
    const borrowers = getLocalBorrowers();
    const borrower = borrowers.find(b => b.id === id);
    if (!borrower) throw new Error('Borrower dossier record not found');
    return borrower;
  },

  addBorrower: async (borrower: Borrower): Promise<Borrower> => {
    await delay(300);
    const borrowers = getLocalBorrowers();
    borrowers.push(borrower);
    saveLocalBorrowers(borrowers);
    return borrower;
  }
};
