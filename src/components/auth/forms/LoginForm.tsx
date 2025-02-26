
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { loginFormSchema } from "@/types/auth";
import { LoginHeader } from "./login/LoginHeader";
import { LoginFormFields } from "./login/LoginFormFields";
import { LoginError } from "./login/LoginError";

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface RateLimitResponse {
  is_allowed: boolean;
  wait_time: number;
  attempts_remaining: number;
}

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const checkRateLimit = async (email: string): Promise<RateLimitResponse> => {
    try {
      const { data, error } = await supabase
        .rpc('check_rate_limit', { p_email: email });

      if (error) throw error;

      if (Array.isArray(data) && data.length > 0) {
        return data[0] as RateLimitResponse;
      }

      return { is_allowed: true, wait_time: 0, attempts_remaining: 5 };

    } catch (error) {
      console.error('Rate limit check error:', error);
      return { is_allowed: true, wait_time: 0, attempts_remaining: 5 };
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setLoginError(null);

      const rateLimit = await checkRateLimit(values.email);

      if (!rateLimit.is_allowed) {
        const minutes = Math.ceil(rateLimit.wait_time / 60);
        throw new Error(
          `Too many login attempts. Please try again in ${minutes} minutes.`
        );
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error(
            `Invalid email or password. ${rateLimit.attempts_remaining} attempts remaining.`
          );
        }
        throw signInError;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) throw new Error('Session not found');

      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_setup_completed, onboarding_completed')
        .eq('id', session.user.id)
        .single();

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      if (!profile?.profile_setup_completed) {
        navigate('/hero-profile-setup');
      } else if (!profile?.onboarding_completed) {
        navigate('/welcome-onboarding');
      } else {
        navigate('/hero-profile');
      }

    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white/95 shadow-xl rounded-2xl border-2 border-primary/20">
      <LoginHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <LoginError error={loginError} />
          <LoginFormFields />
          <Button
            type="submit"
            className="w-full h-11 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
