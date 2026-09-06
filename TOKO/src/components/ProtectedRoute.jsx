import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, user, isAdmin } = useAuth();

  if (loading) return <div className="page-loader">Memeriksa sesi...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
