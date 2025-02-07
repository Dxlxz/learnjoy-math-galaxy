
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface PasswordResetFormProps {
  token?: string | null;
  onSuccess: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ token, onSuccess }) => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
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

  return (
    <form 
      onSubmit={token ? handlePasswordUpdate : handleResetRequest} 
      className="space-y-6"
      aria-label={token ? "Set new password form" : "Password reset request form"}
    >
      {!token ? (
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="bg-white/50"
            disabled={loading}
            aria-required="true"
            aria-label="Email address for password reset"
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="bg-white/50"
            disabled={loading}
            minLength={6}
            aria-required="true"
            aria-label="New password"
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700"
        disabled={loading}
        aria-label={loading 
          ? (token ? "Updating password..." : "Sending reset link...") 
          : (token ? "Update password" : "Send reset link")}
      >
        {loading 
          ? (token ? "Updating Password..." : "Sending Reset Link...") 
          : (token ? "Update Password" : "Send Reset Link")}
      </Button>
    </form>
  );
};

export default PasswordResetForm;
