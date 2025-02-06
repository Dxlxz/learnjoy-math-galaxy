
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  hero_name: string | null;
  grade: string | null;
  profile_setup_completed: boolean;
  starter_challenge_completed: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
