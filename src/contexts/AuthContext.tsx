
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

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Attempting to fetch profile for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, hero_name, grade')
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

        if (profileError.code === 'PGRST301') {
          const { data: { session: refreshedSession } } = await supabase.auth.getSession();
          if (refreshedSession) {
            // Retry the fetch with refreshed session
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('id, hero_name, grade')
              .eq('id', userId)
              .single();
            
            if (!retryError) {
              console.log('Profile fetch successful after session refresh:', retryData);
              setProfile(retryData);
              return;
            }
          }
        }

        throw profileError;
      }

      console.log('Profile data received:', profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      if (error instanceof Error) {
        toast.error('Error loading profile. Please try again later.');
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
          await fetchProfile(session.user.id);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    loading,
    user: session?.user ?? null,
    profile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
