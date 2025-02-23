
import React from 'react';
import { UserPlus } from 'lucide-react';
import AuthCard from '@/components/auth/forms/AuthCard';
import RegisterForm from '@/components/auth/forms/RegisterForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

const Register = () => {
  const navigationLinks = [
    {
      text: "Already an explorer? Sign in",
      path: "/login",
      ariaLabel: "Already have an account? Click to sign in"
    },
    {
      text: "Return to Home",
      path: "/",
      ariaLabel: "Return to home page"
    }
  ];

  return (
    <AuthCard
      icon={UserPlus}
      title="Join the Adventure!"
      description="Create your explorer profile and start your journey"
    >
      <RegisterForm onSuccess={() => {}} />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default Register;
