
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { UserPlus } from 'lucide-react';
import AuthCard from '@/components/auth/forms/AuthCard';
import RegisterForm from '@/components/auth/forms/RegisterForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

const Register = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  React.useEffect(() => {
    if (session) {
      navigate('/hero-profile-setup');
    }
  }, [session, navigate]);

  const handleRegistrationSuccess = () => {
    // After registration, user will be automatically logged in and redirected to profile setup
    // due to the above useEffect
    console.log('Registration successful');
  };

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
      <RegisterForm onSuccess={handleRegistrationSuccess} />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default Register;
