// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, authReady } = useAuth();

  // ── Wait for auth to load before deciding ──
  if (!authReady) return null;

  // ── Not logged in → redirect to login ──
  if (!user) return <Navigate to="/login" replace />;

  // ── Admin only route but user is not admin ──
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  return children;
}