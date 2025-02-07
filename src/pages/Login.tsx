
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from "@/components/ui/checkbox";
import { loginFormSchema, type LoginFormValues } from '@/types/auth';
import { useLogin } from '@/hooks/auth/useLogin';

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { loading, handleLogin } = useLogin();

  // Load saved email from localStorage if it exists
  const savedEmail = localStorage.getItem('rememberedEmail');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
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

  // Handle keyboard navigation for card links
  const handleKeyPress = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[url('/placeholder.svg')] bg-cover bg-center p-4"
      role="main"
      aria-label="Login page"
    >
      <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-2 text-center">
          <CardTitle 
            className="text-3xl font-bold text-primary flex items-center justify-center gap-2"
            role="heading"
            aria-level={1}
          >
            <KeyRound className="h-6 w-6" aria-hidden="true" />
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleLogin)} 
              className="space-y-6"
              aria-label="Login form"
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
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="bg-white/50"
                          disabled={loading}
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.password}
                          aria-describedby={form.formState.errors.password ? "password-error" : undefined}
                        />
                      </FormControl>
                      <FormMessage id="password-error" />
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
                          aria-label="Remember my email"
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
                aria-label={loading ? "Signing in..." : "Sign in"}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" aria-hidden="true" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div 
                className="text-center space-y-2"
                role="navigation"
                aria-label="Additional options"
              >
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/password-reset')}
                  onKeyDown={(e) => handleKeyPress(e, '/password-reset')}
                  className="text-primary-600"
                  disabled={loading}
                  aria-label="Forgot your password? Click to reset"
                >
                  Forgot your password?
                </Button>
                <div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/register')}
                    onKeyDown={(e) => handleKeyPress(e, '/register')}
                    className="text-primary-600"
                    disabled={loading}
                    aria-label="New to Math Galaxy? Click to create an account"
                  >
                    New to Math Galaxy? Create an account
                  </Button>
                </div>
                <div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate('/')}
                    onKeyDown={(e) => handleKeyPress(e, '/')}
                    className="text-primary-600"
                    disabled={loading}
                    aria-label="Return to home page"
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
