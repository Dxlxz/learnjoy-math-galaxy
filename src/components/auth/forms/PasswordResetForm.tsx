import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordResetSchema, newPasswordSchema, type PasswordResetValues, type NewPasswordValues } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/shared/hooks/use-toast";

interface PasswordResetFormProps {
  token?: string | null;
  onSuccess: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ token, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const resetForm = useForm<PasswordResetValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const newPasswordForm = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleResetRequest = async (values: PasswordResetValues) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/password-reset`,
      });

      if (error) throw error;

      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset request failed",
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (values: NewPasswordValues) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <Form {...newPasswordForm}>
        <form 
          onSubmit={newPasswordForm.handleSubmit(handlePasswordUpdate)}
          className="space-y-6"
          aria-label="Set new password form"
        >
          <div className="space-y-4">
            <FormField
              control={newPasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="bg-white/50 pr-10"
                        disabled={loading}
                        aria-required="true"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={newPasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className="bg-white/50 pr-10"
                        disabled={loading}
                        aria-required="true"
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
            aria-label={loading ? "Updating password..." : "Update password"}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Updating Password...</span>
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...resetForm}>
      <form 
        onSubmit={resetForm.handleSubmit(handleResetRequest)}
        className="space-y-6"
        aria-label="Password reset request form"
      >
        <div className="space-y-4">
          <FormField
            control={resetForm.control}
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
                  />
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
          aria-label={loading ? "Sending reset link..." : "Send reset link"}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Sending Reset Link...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordResetForm;
