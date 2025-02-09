import { supabase } from '@/integrations/supabase/client';
import { RegisterFormValues } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { type ToastProps } from "@/components/ui/toast";

export const handleResendVerification = async (
  email: string,
  setResendingEmail: React.Dispatch<React.SetStateAction<boolean>>,
  toast: ReturnType<typeof useToast>['toast']
) => {
  setResendingEmail(true);
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) throw error;

    toast({
      title: "Verification email sent",
      description: "Please check your inbox for the verification link",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    toast({
      variant: "destructive",
      title: "Failed to resend verification email",
      description: "Please try again later",
    });
  } finally {
    setResendingEmail(false);
  }
};

export const handleRegistration = async (
  values: RegisterFormValues,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  toast: ReturnType<typeof useToast>['toast'],
  onSuccess: () => void,
  handleResend: (email: string) => Promise<void>
) => {
  setLoading(true);
  console.log('[Registration] Starting registration process for email:', values.email);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          hero_name: `Explorer${Date.now()}`,
          grade: 'K1'
        }
      }
    });

    if (error) {
      console.error('[Registration] Error during signup:', error);
      let errorMessage = "Unable to create your account. Please try again.";
      
      switch (error.message) {
        case "User already registered":
          errorMessage = "An account with this email already exists. Please sign in instead.";
          break;
        case "Password should be at least 6 characters":
          errorMessage = "Your password must meet the strength requirements.";
          break;
        case "Unable to validate email address":
          errorMessage = "Please enter a valid email address.";
          break;
        case "Email rate limit exceeded":
          errorMessage = "Too many registration attempts. Please try again later.";
          break;
        default:
          console.error("Registration error:", error);
      }

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      return;
    }

    console.log('[Registration] Signup successful, user data:', data);

    // Add a delay to allow the trigger to create the profile
    console.log('[Registration] Waiting for profile creation...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify profile creation
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    console.log('[Registration] Profile check result:', { profile, profileError });

    if (profileError || !profile) {
      console.error("[Registration] Profile verification failed:", profileError);
      toast({
        variant: "destructive",
        title: "Account setup incomplete",
        description: "Please try signing in again or contact support if the issue persists.",
      });
      return;
    }

    console.log('[Registration] Profile created successfully:', profile);
    toast({
      title: "Registration successful",
      description: "Please check your email to verify your account. Click the verification link to complete registration.",
    });
    onSuccess();
  } catch (error) {
    console.error('[Registration] Unexpected error:', error);
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: "An unexpected error occurred. Please try again later.",
    });
  } finally {
    setLoading(false);
  }
};
