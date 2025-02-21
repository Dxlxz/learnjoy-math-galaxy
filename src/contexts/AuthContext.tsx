
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If we get a 403, it might be because the profile doesn't exist yet
        if (error.code === '403') {
          navigate('/hero-profile-setup');
          return;
        }
        throw error;
      }

      setProfile(data);
      
      // If profile exists but setup is not completed, redirect to setup
      if (data && !data.profile_setup_completed) {
        navigate('/hero-profile-setup');
        return;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile. Please try logging in again.');
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
