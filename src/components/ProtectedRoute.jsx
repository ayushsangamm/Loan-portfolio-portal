import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const session = localStorage.getItem("user_session");
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
