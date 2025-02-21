
import React, { lazy, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, MapPin, BookOpen, Target, Trophy, 
  Clock, Users, Scroll, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Lazy load heavy components
const FeatureTimeline = lazy(() => import('./sections/FeatureTimeline'));
const ExplorerProfiles = lazy(() => import('./sections/ExplorerProfiles'));
const FAQSection = lazy(() => import('./sections/FAQSection'));

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#E5DEFF] via-[#F5E6FF] to-white transition-all duration-1000">
        {/* Enhanced Particle Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
          
          {/* Enhanced Math Symbol Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {['÷', '×', '+', '−', '=', '∑', 'π', '∫', '√', '∞'].map((symbol, index) => (
              <div
                key={index}
                className="absolute text-2xl text-primary/20 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: 0.4,
                  transition: 'opacity 0.5s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.4';
                }}
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="flex flex-col items-center max-w-6xl mx-auto">
            {/* Title Section */}
            <div className="flex items-center gap-4 mb-6">
              <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
              <h1 className="animate-fade-in text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                Math Mentor
              </h1>
              <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
            </div>
            
            <p className="text-xl md:text-2xl text-primary-600/80 mb-8 animate-fade-in">
              The Grand Adventure
            </p>
            
            {/* Lazy-loaded Mascot Image */}
            <div className="relative w-32 h-32 mb-8 animate-bounce-slow">
              <img 
                alt="Explorer Guide" 
                className="w-full h-full object-contain"
                src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png"
                loading="lazy"
              />
            </div>
            
            {/* Enhanced Description Box */}
            <div className="max-w-2xl mb-8 p-6 rounded-2xl bg-[#FEF7CD]/80 backdrop-blur-sm border-2 border-primary-100 shadow-xl transform hover:scale-105 transition-all duration-300">
              <p className="animate-fade-in text-xl md:text-2xl text-gray-600">
                Embark on an exciting journey through numbers, shapes, and mathematical wonders. Perfect for grades K1-G5.
              </p>
            </div>

            {/* Enhanced Action Buttons with Adventure Theme */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200 mb-16">
              <Button 
                onClick={() => navigate('/login')} 
                size="lg" 
                className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden"
              >
                <span className="relative z-10">Begin Your Quest</span>
                <MapPin className="w-5 h-5 group-hover:animate-bounce relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <Button 
                onClick={() => navigate('/demo')} 
                variant="outline" 
                size="lg" 
                className="bg-white/80 hover:bg-primary-50 text-primary-600 border-primary-200 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                Try Demo
              </Button>
            </div>

            {/* Lazy-loaded Sections with Loading States */}
            <Suspense fallback={
              <div className="w-full flex items-center justify-center p-8">
                <LoadingSpinner size="lg" text="Unfurling the treasure map..." />
              </div>
            }>
              <FeatureTimeline />
            </Suspense>

            <Suspense fallback={
              <div className="w-full flex items-center justify-center p-8">
                <LoadingSpinner size="lg" text="Gathering fellow explorers..." />
              </div>
            }>
              <ExplorerProfiles />
            </Suspense>

            <Suspense fallback={
              <div className="w-full flex items-center justify-center p-8">
                <LoadingSpinner size="lg" text="Decoding ancient scrolls..." />
              </div>
            }>
              <FAQSection />
            </Suspense>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Hero;
