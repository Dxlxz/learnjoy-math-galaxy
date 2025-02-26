
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginFormSchema } from "@/types/auth";

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

  // Initialize form with react-hook-form and zod validation
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

      // Ensure we're returning a single rate limit response
      return data as RateLimitResponse;
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Default to allowing the attempt if rate limit check fails
      return { is_allowed: true, wait_time: 0, attempts_remaining: 5 };
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setLoginError(null);

      // Check rate limiting before attempting login
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

      // Fetch user profile to determine next steps
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

      // Handle navigation based on profile status
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
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <Star className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground">
          Continue your mathematical adventure
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          {loginError && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
