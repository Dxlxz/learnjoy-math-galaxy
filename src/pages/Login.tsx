
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { KeyRound } from 'lucide-react';
import AuthCard from '@/components/auth/forms/AuthCard';
import LoginForm from '@/components/auth/forms/LoginForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

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
    },
    {
      text: "Return to Home",
      path: "/",
      ariaLabel: "Return to home page"
    }
  ];

  return (
    <AuthCard
      icon={KeyRound}
      title="Welcome Back Explorer!"
      description="Continue your math adventure journey"
    >
      <LoginForm />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default Login;
