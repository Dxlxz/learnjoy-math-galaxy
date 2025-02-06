
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function useRedirectAuth(redirectTo: string = '/hero-profile') {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (!profile?.profile_setup_completed) {
      navigate('/hero-profile-setup');
      return;
    }

    if (!profile?.starter_challenge_completed) {
      navigate('/starter-challenge');
      return;
    }

    navigate(redirectTo);
  }, [user, profile, isLoading, navigate, redirectTo]);
}
