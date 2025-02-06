
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireStarterChallenge?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireProfile = false,
  requireStarterChallenge = false,
}) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <Card className="p-6 flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-primary">Loading your adventure...</p>
        </Card>
      </div>
    );
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but profile setup is required and not completed
  if (requireProfile && (!profile?.profile_setup_completed)) {
    return <Navigate to="/hero-profile-setup" replace />;
  }

  // If starter challenge is required and not completed
  if (requireStarterChallenge && (!profile?.starter_challenge_completed)) {
    return <Navigate to="/starter-challenge" replace />;
  }

  // If user is logged in and trying to access auth pages
  if (user && ['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/hero-profile" replace />;
  }

  return <>{children}</>;
};
