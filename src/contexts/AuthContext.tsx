
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
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, hero_name, grade, profile_setup_completed')
        .eq('id', userId)
        .single();

      if (profileError) {
        // Log detailed error information
        console.error('Profile fetch error:', {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint
        });

        // Special handling for profile not found
        if (profileError.code === 'PGRST302') {
          console.log('Profile not found, redirecting to setup');
          setProfile(null);
          navigate('/hero-profile-setup');
          return;
        }

        // For permissions errors, try to refresh the session
        if (profileError.code === 'PGRST301') {
          const { data: { session: refreshedSession } } = await supabase.auth.getSession();
          if (refreshedSession) {
            // Retry the fetch with refreshed session
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('id, hero_name, grade, profile_setup_completed')
              .eq('id', userId)
              .single();
            
            if (!retryError) {
              console.log('Profile fetch successful after session refresh:', retryData);
              setProfile(retryData);
              if (!retryData.profile_setup_completed) {
                navigate('/hero-profile-setup');
              }
              return;
            }
          }
        }

        throw profileError;
      }

      if (!profileData) {
        console.log('No profile data found, redirecting to setup');
        setProfile(null);
        navigate('/hero-profile-setup');
        return;
      }

      console.log('Profile data received:', profileData);
      setProfile(profileData);

      if (!profileData.profile_setup_completed) {
        console.log('Profile not completed, redirecting to setup');
        navigate('/hero-profile-setup');
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      if (error instanceof Error) {
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
