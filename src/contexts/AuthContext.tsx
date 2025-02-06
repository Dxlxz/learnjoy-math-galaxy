
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  });

  const refreshProfile = async () => {
    try {
      if (!authState.session?.user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authState.session.user.id)
        .single();

      if (error) throw error;

      setAuthState(prev => ({ ...prev, profile }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAuthState(prev => ({ ...prev, error: error as Error }));
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({ 
        ...prev, 
        session,
        user: session?.user ?? null,
        isLoading: false
      }));

      if (session?.user) {
        refreshProfile();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (session?.user) {
        await refreshProfile();
      } else {
        setAuthState(prev => ({ ...prev, profile: null }));
      }

      // Handle auth events
      switch (event) {
        case 'SIGNED_IN':
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          break;
        case 'SIGNED_OUT':
          toast({
            title: "Signed out",
            description: "You've been successfully signed out.",
          });
          navigate('/login');
          break;
        case 'USER_DELETED':
          toast({
            variant: "destructive",
            title: "Account deleted",
            description: "Your account has been successfully deleted.",
          });
          navigate('/');
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
