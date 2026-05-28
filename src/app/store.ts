import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import loansReducer from '../features/loans/loansSlice';
import borrowersReducer from '../features/borrowers/borrowersSlice';

export const store = configureStore({
  reducer: {
    loans: loansReducer,
    borrowers: borrowersReducer
  }
});

// TypeScript standard definitions for Redux Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Pre-typed custom hooks for dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
