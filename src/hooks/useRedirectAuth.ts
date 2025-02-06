
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RedirectAuthOptions {
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireStarterChallenge?: boolean;
  redirectTo?: string;
}

export function useRedirectAuth({
  requireAuth = true,
  requireProfile = false,
  requireStarterChallenge = false,
  redirectTo = '/hero-profile'
}: RedirectAuthOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;

    const redirectWithMessage = (path: string, message?: string) => {
      if (message) {
        toast({
          title: "Action Required",
          description: message,
        });
      }
      navigate(path, { state: { from: location }, replace: true });
    };

    // Handle authentication requirement
    if (requireAuth && !user) {
      redirectWithMessage('/login', "Please log in to continue.");
      return;
    }

    // Handle profile completion requirement
    if (requireProfile && user && !profile?.profile_setup_completed) {
      redirectWithMessage('/hero-profile-setup', "Please complete your hero profile first.");
      return;
    }

    // Handle starter challenge requirement
    if (requireStarterChallenge && user && profile?.profile_setup_completed && !profile?.starter_challenge_completed) {
      redirectWithMessage('/starter-challenge', "Complete the starter challenge to continue.");
      return;
    }

    // If user is authenticated but trying to access auth pages
    if (user && ['/login', '/register'].includes(location.pathname)) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // If all requirements are met and redirectTo is specified
    if (redirectTo && location.pathname !== redirectTo) {
      navigate(redirectTo);
    }
  }, [user, profile, isLoading, navigate, location, redirectTo, toast]);
}
