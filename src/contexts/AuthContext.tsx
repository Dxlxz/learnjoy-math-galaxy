import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState, Profile } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setState(prev => ({ ...prev, user: session.user }));
          try {
            await fetchProfile(session.user.id);
          } catch (error) {
            console.error('Profile fetch error during init:', error);
            setState(prev => ({ ...prev, error: error as Error }));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({ ...prev, error: error as Error }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        if (session) {
          setState(prev => ({ ...prev, user: session.user }));
          await fetchProfile(session.user.id);
        } else {
          setState({ user: null, profile: null, isLoading: false, error: null });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setState(prev => ({ ...prev, error: error as Error }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setState(prev => ({ ...prev, error: error }));
        return;
      }

      setState(prev => ({ ...prev, profile: data }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setState(prev => ({ ...prev, error: error as Error }));
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/hero-profile');
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An error occurred during sign in",
      });
      setState(prev => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    heroName: string, 
    grade: Profile['grade']
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            hero_name: heroName,
            grade: grade,
          },
        },
      });
      if (error) throw error;
      
      toast({
        title: "Welcome aboard!",
        description: "Your account has been created successfully.",
      });
      navigate('/welcome-onboarding');
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An error occurred during sign up",
      });
      setState(prev => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error instanceof Error ? error.message : "An error occurred during sign out",
      });
      setState(prev => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) throw new Error('No user logged in');

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "An error occurred while updating your profile",
      });
      setState(prev => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
