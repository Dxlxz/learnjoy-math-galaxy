
import React from 'react';
import { KeyRound } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthCard from '@/components/auth/forms/AuthCard';
import PasswordResetForm from '@/components/auth/forms/PasswordResetForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigationLinks = [
    {
      text: "Return to Login",
      path: "/login",
      ariaLabel: "Back to login page"
    },
    {
      text: "Return to Home",
      path: "/",
      ariaLabel: "Back to home page"
    }
  ];

  const handleResetSuccess = () => {
    // After successful password reset or reset request, navigate to login
    navigate('/login');
  };

  return (
    <AuthCard
      icon={KeyRound}
      title={token ? "Reset Your Password" : "Forgot Password?"}
      description={token ? "Enter your new password" : "Enter your email to reset your password"}
    >
      <PasswordResetForm token={token} onSuccess={handleResetSuccess} />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default PasswordReset;
