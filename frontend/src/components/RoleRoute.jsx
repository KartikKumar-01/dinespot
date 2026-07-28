import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * RoleRoute — guards routes by user role.
 * Shows spinner while auth is loading (e.g. on page refresh),
 * then redirects to /login if not authenticated,
 * or to / if authenticated but wrong role.
 */
export default function RoleRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="w-10 h-10 border-3 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // adminOnly accepts admin; ownerOnly also accepts admin (matches backend middleware)
  const hasRole =
    user?.role === role ||
    (role === 'owner' && user?.role === 'admin');

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
