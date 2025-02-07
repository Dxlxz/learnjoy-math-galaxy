
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyReset } from 'lucide-react';

const PasswordReset = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  // Check if we have a token (meaning user clicked reset link from email)
  const token = searchParams.get('token');

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
      navigate('/login');
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
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <KeyReset className="h-6 w-6" />
            {token ? 'Set New Password' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-lg">
            {token 
              ? 'Enter your new password below'
              : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={token ? handlePasswordUpdate : handleResetRequest} className="space-y-6">
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
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={loading}
            >
              {loading 
                ? (token ? "Updating Password..." : "Sending Reset Link...") 
                : (token ? "Update Password" : "Send Reset Link")}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/login')}
                className="text-primary-600"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;
