
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresNoAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresAuth = true,
  requiresNoAuth = false,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (requiresAuth && !user) {
    return <Navigate to="/login" />;
  }

  if (requiresNoAuth && user) {
    return <Navigate to="/hero-profile" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
