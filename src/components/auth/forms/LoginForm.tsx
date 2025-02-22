
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormValues } from '@/types/auth';
import { useLogin } from '@/hooks/auth/useLogin';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { loading, handleLogin } = useLogin();
  const savedEmail = localStorage.getItem('rememberedEmail');
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: savedEmail || '',
      password: '',
      rememberMe: Boolean(savedEmail),
    },
  });

  return (
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
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="bg-white/50 pr-10"
                      disabled={loading}
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.password}
                      aria-describedby={form.formState.errors.password ? "password-error" : undefined}
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
                  <FormLabel className="text-sm text-muted-foreground">Remember me</FormLabel>
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
      </form>
    </Form>
  );
};

export default LoginForm;
