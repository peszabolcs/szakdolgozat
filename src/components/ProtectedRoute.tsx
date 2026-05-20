import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/useAuth';

type Role = 'admin' | 'visitor';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** When set, only users with this role (or admin) may enter. */
  requireRole?: Role;
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isHydrating, user } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Role gate: admin can access everything; visitor cannot enter admin-only routes.
  if (requireRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/me" replace />;
  }

  return <>{children}</>;
};
