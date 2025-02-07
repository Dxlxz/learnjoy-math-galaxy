
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

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const updateState = (updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        updateState({ error, profile: null });
        return null;
      }

      updateState({ profile: data, error: null });
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      updateState({ error: error as Error, profile: null });
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          updateState({ user: session.user });
          await fetchProfile(session.user.id);
        } else {
          updateState({ user: null, profile: null });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        updateState({ error: error as Error });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setLoading(true);
      clearError();

      try {
        if (session?.user) {
          updateState({ user: session.user });
          await fetchProfile(session.user.id);
        } else {
          updateState({ user: null, profile: null });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        updateState({ error: error as Error });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    clearError();

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
      updateState({ error: error as Error });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    heroName: string, 
    grade: Profile['grade']
  ) => {
    setLoading(true);
    clearError();

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
      updateState({ error: error as Error });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    clearError();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      updateState({ user: null, profile: null });
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
      updateState({ error: error as Error });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) throw new Error('No user logged in');

    setLoading(true);
    clearError();

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id);

      if (error) throw error;

      const updatedProfile = state.profile ? { ...state.profile, ...updates } : null;
      updateState({ profile: updatedProfile });

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
      updateState({ error: error as Error });
      throw error;
    } finally {
      setLoading(false);
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
