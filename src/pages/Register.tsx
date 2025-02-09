
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { UserPlus } from 'lucide-react';
import { AuthCard, RegisterForm, AuthNavigation } from '@/features/auth/components';

const Register = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  React.useEffect(() => {
    if (session) {
      navigate('/hero-profile-setup');
    }
  }, [session, navigate]);

  const handleRegistrationSuccess = () => {
    navigate('/login');
  };

  const navigationLinks = [
    {
      text: "Already have an account? Sign in",
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
      title="Create Account"
      description="Start your math adventure journey"
    >
      <RegisterForm onSuccess={handleRegistrationSuccess} />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default Register;
