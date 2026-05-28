import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

// Lazy loading all routes with code splitting for excellent bundle optimization
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LoanList = lazy(() => import("./pages/LoanList"));
const LoanDetail = lazy(() => import("./pages/LoanDetail"));
const AddLoan = lazy(() => import("./pages/AddLoan"));
const BorrowerProfile = lazy(() => import("./pages/BorrowerProfile"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const Calculator = lazy(() => import("./pages/Calculator"));

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core system container shell */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="loans" element={<LoanList />} />
          <Route path="loans/:id" element={<LoanDetail />} />
          <Route path="add-loan" element={<AddLoan />} />
          <Route path="borrowers/:id" element={<BorrowerProfile />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="calculator" element={<Calculator />} />
          {/* Fallback route */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
