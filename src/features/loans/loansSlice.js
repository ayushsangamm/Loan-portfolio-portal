import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loansAPI } from "./loansAPI";

const initialState = {
  loans: [],
  selectedLoan: null,
  status: "idle",
  error: null,
  filters: {
    status: "All",
    search: "",
    sortBy: "",
    sortOrder: "asc",
    page: 1,
    limit: 10,
  },
};

// Async Thunks
export const fetchLoansAsync = createAsyncThunk(
  "loans/fetchLoans",
  async (_, { rejectWithValue }) => {
    try {
      return await loansAPI.getLoans();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch loans");
    }
  },
);

export const fetchLoanByIdAsync = createAsyncThunk(
  "loans/fetchLoanById",
  async (id, { rejectWithValue }) => {
    try {
      return await loansAPI.getLoanById(id);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch loan details");
    }
  },
);

export const addLoanAsync = createAsyncThunk(
  "loans/addLoan",
  async (loan, { rejectWithValue }) => {
    try {
      // Create a unique clean ID
      const fullLoan = {
        ...loan,
      };
      return await loansAPI.addLoan(fullLoan);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to disburse new loan");
    }
  },
);

export const updateLoanStatusAsync = createAsyncThunk(
  "loans/updateLoanStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await loansAPI.updateLoanStatus(id, status);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update loan status");
    }
  },
);

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    setStatusFilter(state, action) {
      state.filters.status = action.payload;
      state.filters.page = 1; // Reset to page 1 on filter change
    },
    setSearchFilter(state, action) {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setSorting(state, action) {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    clearSelectedLoan(state) {
      state.selectedLoan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Loans
      .addCase(fetchLoansAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLoansAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loans = action.payload;
      })
      .addCase(fetchLoansAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Loan by ID
      .addCase(fetchLoanByIdAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLoanByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedLoan = action.payload;
      })
      .addCase(fetchLoanByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add Loan
      .addCase(addLoanAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addLoanAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loans.unshift(action.payload); // Prepend new loan to local list
      })
      .addCase(addLoanAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Loan Status
      .addCase(updateLoanStatusAsync.fulfilled, (state, action) => {
        const updatedLoan = action.payload;
        // Update in list
        const index = state.loans.findIndex((l) => l.id === updatedLoan.id);
        if (index !== -1) {
          state.loans[index] = updatedLoan;
        }
        // Update selected if applicable
        if (state.selectedLoan && state.selectedLoan.id === updatedLoan.id) {
          state.selectedLoan = updatedLoan;
        }
      });
  },
});

export const {
  setStatusFilter,
  setSearchFilter,
  setSorting,
  setPage,
  resetFilters,
  clearSelectedLoan,
} = loansSlice.actions;

export default loansSlice.reducer;
