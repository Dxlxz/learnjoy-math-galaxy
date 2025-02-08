
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, MapPin } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#E5DEFF] to-white">
      {/* Animated Background Elements - Refined with softer colors and smoother animations */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center text-center">
        {/* Title with Sparkle Icon */}
        <div className="flex items-center gap-4 mb-6">
          <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
          <h1 className="animate-fade-in text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            Math Mentor
          </h1>
          <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
        </div>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-primary-600/80 mb-8 animate-fade-in">
          The Grand Adventure
        </p>
        
        {/* Storybook Style Description */}
        <div className="relative max-w-2xl mb-8 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-primary-100 shadow-xl">
          <BookOpen className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 p-2 bg-white rounded-full text-primary-600 shadow-lg" />
          <p className="animate-fade-in text-xl md:text-2xl text-gray-600 mt-4">
            Embark on an exciting journey through numbers, shapes, and mathematical wonders. Perfect for grades K1-G5.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>Begin Your Quest</span>
            <MapPin className="w-5 h-5 group-hover:animate-bounce" />
          </Button>
          
          <Button
            onClick={() => navigate('/demo')}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50 text-primary-600 border-primary-200 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Demo
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-contain bg-no-repeat opacity-20" style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-contain bg-no-repeat opacity-20" style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
      </div>
    </div>
  );
};

export default Hero;
