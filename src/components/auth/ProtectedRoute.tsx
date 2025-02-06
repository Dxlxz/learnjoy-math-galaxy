
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useRedirectAuth } from '@/hooks/useRedirectAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireStarterChallenge?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireProfile = false,
  requireStarterChallenge = false,
  redirectTo,
}) => {
  const { isLoading } = useAuth();

  // Use our enhanced hook for all auth/redirect logic
  useRedirectAuth({
    requireAuth,
    requireProfile,
    requireStarterChallenge,
    redirectTo,
  });

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

  return <>{children}</>;
};
