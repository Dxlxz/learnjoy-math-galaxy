
import React from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '@/components/auth/forms/AuthCard';
import RegisterForm from '@/components/auth/forms/RegisterForm';
import AuthNavigation from '@/components/auth/forms/AuthNavigation';

const Register = () => {
  const navigate = useNavigate();
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

  const handleRegistrationSuccess = () => {
    // After successful registration, navigate to login
    navigate('/login');
  };

  return (
    <AuthCard
      icon={UserPlus}
      title="Join Math Mentor!"
      description="Create your account to start your adventure"
    >
      <RegisterForm onSuccess={handleRegistrationSuccess} />
      <div className="mt-6">
        <AuthNavigation links={navigationLinks} />
      </div>
    </AuthCard>
  );
};

export default Register;
