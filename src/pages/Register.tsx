
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the grade level type to match the database enum
type GradeLevel = 'K1' | 'K2' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [resendingEmail, setResendingEmail] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      navigate('/hero-profile-setup');
    }
  }, [session, navigate]);

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      console.log('Starting registration process...');
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            // Set default values that will be used by the trigger function
            hero_name: `Explorer${Date.now()}`,
            grade: 'K1' as GradeLevel
          }
        }
      });

      if (error) {
        console.error('Registration error details:', error);
        
        let errorMessage = "Unable to create your account. Please try again.";
        
        // Handle specific error cases
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
            // Log unexpected errors for debugging
            console.error("Registration error:", error);
        }

        toast({
          variant: "destructive",
          title: "Registration failed",
          description: errorMessage,
        });
        return;
      }

      console.log('Registration response:', data);

      // Additional check to ensure user was created
      if (!data.user) {
        throw new Error('No user data returned from registration');
      }

      console.log('Registration successful, showing verification message...');
      
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
      navigate('/login');
    } catch (error) {
      console.error('Full registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again later.",
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          {...field}
                          type="password"
                          placeholder="Create a secure password"
                          className="bg-white/50"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-500">
                        Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/login')}
                    className="text-primary-600"
                    disabled={loading}
                  >
                    Already have an account? Sign in
                  </Button>
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
