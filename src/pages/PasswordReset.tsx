
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import AuthCard from '@/components/auth/forms/AuthCard';
import PasswordResetForm from '@/components/auth/forms/PasswordResetForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigationLinks = [
    {
      text: "Back to Login",
      path: "/login",
      ariaLabel: "Back to login page"
    }
  ];

  return (
    <AuthCard
      icon={KeyRound}
      title={token ? 'Set New Password' : 'Reset Password'}
      description={token 
        ? 'Enter your new password below'
        : 'Enter your email to receive a password reset link'}
    >
      <PasswordResetForm token={token} onSuccess={() => {}} />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default PasswordReset;
