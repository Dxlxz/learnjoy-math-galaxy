
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { KeyRound } from 'lucide-react';
import { AuthCard, AuthNavigation } from '@/components/auth/forms';
import { LoginForm } from '@/features/auth/components/forms';

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      navigate('/hero-profile');
    }
  }, [session, navigate]);

  const navigationLinks = [
    {
      text: "Forgot your password?",
      path: "/password-reset",
      ariaLabel: "Forgot your password? Click to reset"
    },
    {
      text: "New to Math Galaxy? Create an account",
      path: "/register",
      ariaLabel: "New to Math Galaxy? Click to create an account"
    }
  ];

  return (
    <AuthCard
      icon={KeyRound}
      title="Welcome Back"
      description="Sign in to continue your learning journey"
    >
      <LoginForm />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default Login;
