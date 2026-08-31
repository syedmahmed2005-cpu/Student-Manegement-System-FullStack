import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ user, loading }) {
  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;