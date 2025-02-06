
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center text-center">
        <h1 className="animate-fade-in text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-6">
          Math Galaxy Adventure
        </h1>
        
        <p className="animate-fade-in text-xl md:text-2xl text-gray-600 max-w-2xl mb-8 delay-100">
          Embark on an exciting journey through numbers, shapes, and mathematical wonders. Perfect for grades K1-G5.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full transition-transform hover:scale-105"
          >
            Start Your Adventure
          </Button>
          
          <Button
            onClick={() => navigate('/demo')}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50 text-primary-600 border-primary-200 px-8 py-6 text-lg rounded-full transition-transform hover:scale-105"
          >
            Try Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
