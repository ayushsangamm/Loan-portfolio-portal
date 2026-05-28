import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Borrower, BorrowersState } from './borrowerTypes';
import { borrowersAPI } from './borrowersAPI';

const initialState: BorrowersState = {
  borrowers: [],
  selectedBorrower: null,
  status: 'idle',
  error: null
};

export const fetchBorrowersAsync = createAsyncThunk(
  'borrowers/fetchBorrowers',
  async (_, { rejectWithValue }) => {
    try {
      return await borrowersAPI.getBorrowers();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch borrowers');
    }
  }
);

export const fetchBorrowerByIdAsync = createAsyncThunk(
  'borrowers/fetchBorrowerById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await borrowersAPI.getBorrowerById(id);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch borrower profile');
    }
  }
);

const borrowersSlice = createSlice({
  name: 'borrowers',
  initialState,
  reducers: {
    clearSelectedBorrower(state) {
      state.selectedBorrower = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBorrowersAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBorrowersAsync.fulfilled, (state, action: PayloadAction<Borrower[]>) => {
        state.status = 'succeeded';
        state.borrowers = action.payload;
      })
      .addCase(fetchBorrowersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchBorrowerByIdAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBorrowerByIdAsync.fulfilled, (state, action: PayloadAction<Borrower>) => {
        state.status = 'succeeded';
        state.selectedBorrower = action.payload;
      })
      .addCase(fetchBorrowerByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { clearSelectedBorrower } = borrowersSlice.actions;
export default borrowersSlice.reducer;
