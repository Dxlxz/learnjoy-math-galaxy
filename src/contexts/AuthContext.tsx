
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
      console.log('Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          console.log('Profile not found, redirecting to setup');
          navigate('/hero-profile-setup');
          return;
        }
        throw error;
      }

      console.log('Profile data:', profile);
      setProfile(profile);

      if (!profile.profile_setup_completed) {
        console.log('Profile setup not completed, redirecting to setup');
        navigate('/hero-profile-setup');
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('Error loading profile. Please try logging in again.');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Session found:', session.user.id);
          setSession(session);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        toast.error('Error initializing auth session');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      
      if (session?.user?.id) {
        await fetchProfile(session.user.id);
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
