
import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PublicOnlyProps {
  children: React.ReactNode;
}

const PublicOnly: React.FC<PublicOnlyProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};

export default PublicOnly;
