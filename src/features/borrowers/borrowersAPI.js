import dbData from "../../data/db.json";

const STORAGE_KEY = "enterprise_borrowers";

const getLocalBorrowers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbData.borrowers));
    return dbData.borrowers;
  }
  return JSON.parse(data);
};

const saveLocalBorrowers = (borrowers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(borrowers));
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const borrowersAPI = {
  getBorrowers: async () => {
    await delay(400);
    return getLocalBorrowers();
  },

  getBorrowerById: async (id) => {
    await delay(300);
    const borrowers = getLocalBorrowers();
    const borrower = borrowers.find((b) => b.id === id);
    if (!borrower) throw new Error("Borrower dossier record not found");
    return borrower;
  },

  addBorrower: async (borrower) => {
    await delay(300);
    const borrowers = getLocalBorrowers();
    borrowers.push(borrower);
    saveLocalBorrowers(borrowers);
    return borrower;
  },
};
