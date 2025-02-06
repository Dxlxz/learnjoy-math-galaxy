
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Check for existing session on mount
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }}) => {
      if (session) {
        navigate('/hero-profile-setup');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/hero-profile-setup');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Registration started",
        description: "Let's create your hero profile!",
      });
      navigate('/hero-profile-setup');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again",
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
            <UserPlus className="h-6 w-6" />
            Create Account
          </CardTitle>
          <CardDescription className="text-lg">
            Start your math adventure journey
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
                  placeholder="Create a secure password"
                  className="bg-white/50"
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Continue"}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="text-primary-600"
                >
                  Already have an account? Sign in
                </Button>
                <div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/')}
                    className="text-primary-600"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
