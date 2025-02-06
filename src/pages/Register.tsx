
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-primary-600 mb-8">
          Coming Soon
        </h1>
        <Button
          onClick={() => navigate('/')}
          className="w-full bg-primary-600 hover:bg-primary-700"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Register;
