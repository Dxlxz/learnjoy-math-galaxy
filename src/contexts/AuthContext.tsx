
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  user: User | null;
  profile: any | null;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  user: null,
  profile: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Attempting to fetch profile for user:', userId);
      
      // Query the profiles table directly with minimal select
      const { data, error } = await supabase
        .from('profiles')
        .select('id, hero_name, grade, profile_setup_completed')
        .eq('id', userId)
        .single();

      if (error) {
        // Log the specific error for debugging
        console.error('Profile fetch error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        if (error.code === 'PGRST302') {
          console.log('Profile not found, redirecting to setup');
          navigate('/hero-profile-setup');
          return;
        }
        
        throw error;
      }

      console.log('Profile data received:', data);

      if (!data) {
        console.log('No profile data found, redirecting to setup');
        navigate('/hero-profile-setup');
        return;
      }

      setProfile(data);

      if (!data.profile_setup_completed) {
        console.log('Profile not completed, redirecting to setup');
        navigate('/hero-profile-setup');
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        // Only show toast for serious errors, not for normal "profile not found" cases
        if (!error.message.includes('not found') && !error.message.includes('PGRST302')) {
          toast.error('Error loading profile. Please try again later.');
        }
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial auth check:', { sessionExists: !!session, userId: session?.user?.id });
        
        if (error) throw error;
        
        if (session?.user?.id) {
          setSession(session);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        toast.error('Error initializing session');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, userId: session?.user?.id });
      setSession(session);
      
      if (session?.user?.id) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Add small delay to ensure profile has been created by the trigger
          await new Promise(resolve => setTimeout(resolve, 500));
          await fetchProfile(session.user.id);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const value = {
    session,
    loading,
    user: session?.user ?? null,
    profile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
