import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for AuthContext to rehydrate from persisted Preferences before deciding
  if (loading) return null;

  if (!user) {
    // Redirect to login, but remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
