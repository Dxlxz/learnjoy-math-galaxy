
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { registerFormSchema, type RegisterFormValues } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { Eye, EyeOff } from 'lucide-react';
import { type Grade } from '@/types/shared';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [resendingEmail, setResendingEmail] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleResendVerification = async (email: string) => {
    setResendingEmail(true);
    try {
      // Check if we've exceeded rate limits
      const { data: rateLimit } = await supabase.rpc('check_rate_limit', { p_email: email });
      
      if (rateLimit && !rateLimit[0].is_allowed) {
        throw new Error(`Too many attempts. Please wait ${Math.ceil(rateLimit[0].wait_time / 60)} minutes before trying again.`);
      }

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
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);

    try {
      // Check rate limits first
      const { data: rateLimit } = await supabase.rpc('check_rate_limit', { p_email: values.email });
      
      if (rateLimit && !rateLimit[0].is_allowed) {
        throw new Error(`Too many attempts. Please wait ${Math.ceil(rateLimit[0].wait_time / 60)} minutes before trying again.`);
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            hero_name: `Explorer${Date.now()}`,
            grade: 'K1' as Grade
          }
        }
      });

      if (error) {
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

      toast({
        title: "Registration successful",
        description: (
          <div className="space-y-2">
            <p>Please check your email to verify your account.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResendVerification(values.email)}
              disabled={resendingEmail}
              className="w-full"
            >
              {resendingEmail ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Resending verification...</span>
                </div>
              ) : (
                "Resend verification email"
              )}
            </Button>
          </div>
        ),
      });
      onSuccess();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
        aria-label="Registration form"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-white/50"
                    disabled={loading}
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.email}
                    aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                  />
                </FormControl>
                <FormMessage id="email-error" />
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
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      className="bg-white/50 pr-10"
                      disabled={loading}
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.password}
                      aria-describedby="password-requirements password-error"
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={(e) => {
                        field.onBlur();
                        if (!e.currentTarget.value) {
                          setIsPasswordFocused(false);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                {(isPasswordFocused || field.value) && (
                  <>
                    <PasswordStrengthMeter password={field.value} />
                    <FormDescription 
                      id="password-requirements"
                      className="text-sm text-muted-foreground"
                    >
                      Password must include: 8+ characters, uppercase & lowercase letters, number, and special character.
                    </FormDescription>
                  </>
                )}
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="bg-white/50 pr-10"
                      disabled={loading}
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.confirmPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700"
          disabled={loading}
          aria-label={loading ? "Creating account..." : "Continue"}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" aria-hidden="true" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
