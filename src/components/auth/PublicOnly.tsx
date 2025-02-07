
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PublicOnlyProps {
  children: React.ReactNode;
}

const PublicOnly: React.FC<PublicOnlyProps> = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/hero-profile';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (session) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicOnly;
