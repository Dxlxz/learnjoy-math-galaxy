
import React from 'react';
import { KeyRound } from 'lucide-react';
import AuthCard from '@/components/auth/forms/AuthCard';
import PasswordResetForm from '@/components/auth/forms/PasswordResetForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

const PasswordReset = () => {
  const navigationLinks = [
    {
      text: "Return to Home",
      path: "/",
      ariaLabel: "Back to home page"
    }
  ];

  return (
    <AuthCard
      icon={KeyRound}
      title="Welcome to Math Mentor!"
      description="Start your adventure right away"
    >
      <PasswordResetForm token={null} onSuccess={() => {}} />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default PasswordReset;
