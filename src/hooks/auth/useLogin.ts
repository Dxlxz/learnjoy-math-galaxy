
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { LoginFormValues } from '@/types/auth';

export const useLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleResendVerification = async (email: string) => {
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

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      // Check rate limiting first
      const { data: rateLimit, error: rateLimitError } = await supabase
        .rpc('check_rate_limit', { p_email: values.email });

      if (rateLimitError) throw rateLimitError;

      if (!rateLimit?.[0]?.is_allowed) {
        const waitTime = Math.ceil(rateLimit?.[0]?.wait_time / 60);
        toast({
          variant: "destructive",
          title: "Too many login attempts",
          description: `Please try again in ${waitTime} minutes`,
        });
        return;
      }

      // Handle "Remember me" functionality
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        let errorMessage = "Please check your credentials and try again";
        let isEmailUnverified = false;
        
        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "The email or password you entered is incorrect";
            break;
          case "Email not confirmed":
            isEmailUnverified = true;
            errorMessage = "Please verify your email address before logging in";
            break;
          case "For security purposes, you can only request this after 60 seconds":
            errorMessage = "Too many login attempts. Please wait 60 seconds before trying again";
            break;
          case "Too many requests":
            errorMessage = "Too many login attempts. Please try again later";
            break;
          case "Email rate limit exceeded":
            errorMessage = "Too many login attempts. Please wait a moment before trying again";
            break;
          case "User not found":
            errorMessage = "No account found with this email address";
            break;
          default:
            console.error("Login error:", error);
            errorMessage = "An unexpected error occurred. Please try again";
        }

        toast({
          variant: "destructive",
          title: "Login failed",
          description: (
            <div className="space-y-2">
              <p>{errorMessage}</p>
              {isEmailUnverified && (
                <button
                  onClick={() => handleResendVerification(values.email)}
                  disabled={resendingEmail}
                  className="w-full bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm hover:bg-secondary/80 transition-colors"
                >
                  {resendingEmail ? "Resending verification..." : "Resend verification email"}
                </button>
              )}
            </div>
          ),
        });
        return;
      }

      toast({
        title: "Login successful",
        description: "Welcome back to Math Galaxy Adventure!",
      });
      
      navigate('/hero-profile');
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred. Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    resendingEmail,
    handleLogin,
    handleResendVerification
  };
};
