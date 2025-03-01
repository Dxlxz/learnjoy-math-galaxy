
import React from 'react';
import { KeyRound } from 'lucide-react';
import AuthCard from '@/components/auth/forms/AuthCard';
import LoginForm from '@/components/auth/forms/LoginForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

const Login = () => {
  const navigationLinks = [
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
      title="Welcome to Math Mentor!"
      description="Start your adventure right away"
    >
      <LoginForm />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default Login;
