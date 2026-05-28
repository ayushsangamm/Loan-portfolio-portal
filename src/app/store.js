import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import loansReducer from "../features/loans/loansSlice";
import borrowersReducer from "../features/borrowers/borrowersSlice";

export const store = configureStore({
  reducer: {
    loans: loansReducer,
    borrowers: borrowersReducer,
  },
});

// TypeScript standard definitions for Redux Store

// Pre-typed custom hooks for dispatch and selector
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
