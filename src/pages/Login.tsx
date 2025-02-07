
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [resendingEmail, setResendingEmail] = React.useState(false);

  // Check for existing session on mount
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }}) => {
      if (session) {
        navigate('/hero-profile');
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/hero-profile');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleResendVerification = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Please check your credentials and try again";
        let isEmailUnverified = false;
        
        // Handle specific error cases
        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "The email or password you entered is incorrect";
            break;
          case "Email not confirmed":
            isEmailUnverified = true;
            errorMessage = "Please verify your email address before logging in";
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
            // Log unexpected errors for debugging
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4">
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <KeyRound className="h-6 w-6" />
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-white/50"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 relative"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/password-reset')}
                className="text-primary-600"
                disabled={loading}
              >
                Forgot your password?
              </Button>
              <div>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/register')}
                  className="text-primary-600"
                  disabled={loading}
                >
                  New to Math Galaxy? Create an account
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/')}
                  className="text-primary-600"
                  disabled={loading}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
