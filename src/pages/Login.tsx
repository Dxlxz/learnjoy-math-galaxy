
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
} from "@/components/ui/form";
import { KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password is too long'),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [resendingEmail, setResendingEmail] = React.useState(false);

  // Load saved email from localStorage if it exists
  const savedEmail = localStorage.getItem('rememberedEmail');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: savedEmail || '',
      password: '',
      rememberMe: Boolean(savedEmail),
    },
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      navigate('/hero-profile');
    }
  }, [session, navigate]);

  const handleResendVerification = async () => {
    const email = form.getValues('email');
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

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
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
        
        // Handle specific error cases
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
                          placeholder="Enter your password"
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
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
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
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

