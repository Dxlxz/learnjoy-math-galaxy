
import React, { lazy, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, MapPin
} from 'lucide-react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const FeatureTimeline = lazy(() => import('./sections/FeatureTimeline'));
const ExplorerProfiles = lazy(() => import('./sections/ExplorerProfiles'));
const FAQSection = lazy(() => import('./sections/FAQSection'));

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary>
      <main className="relative min-h-screen bg-gradient-to-b from-[#E5DEFF] via-[#F5E6FF] to-white">
        {/* Background Elements */}
        <BackgroundEffects />
        
        {/* Main Content Container */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-6">
            {/* Header Section */}
            <HeaderSection />

            {/* Introduction Section */}
            <IntroductionSection navigate={navigate} />

            {/* Content Sections */}
            <div className="flex flex-col items-center w-full space-y-8">
              <Suspense fallback={<SectionLoader text="Unfurling the treasure map..." />}>
                <FeatureTimeline />
              </Suspense>

              <Suspense fallback={<SectionLoader text="Gathering fellow explorers..." />}>
                <ExplorerProfiles />
              </Suspense>

              <Suspense fallback={<SectionLoader text="Decoding ancient scrolls..." />}>
                <FAQSection />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
};

// Background Effects Component
const BackgroundEffects = () => (
  <div className="absolute inset-0 w-full h-full z-0">
    {/* Gradient Blobs */}
    <div className="absolute top-10 left-10 w-48 h-48 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
    <div className="absolute top-20 right-10 w-48 h-48 bg-primary-100/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-48 h-48 bg-primary-300/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
    
    {/* Math Symbols */}
    <MathSymbols />
  </div>
);

// Math Symbols Component
const MathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none">
    {['÷', '×', '+', '−', '=', '∑', 'π', '∫', '√', '∞'].map((symbol, index) => (
      <div
        key={index}
        className="absolute text-xl text-primary-400/20 animate-float"
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
);

// Header Section Component
const HeaderSection = () => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
    <h1 className="animate-fade-in text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
      Math Mentor
    </h1>
    <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
  </div>
);

// Introduction Section Component
const IntroductionSection = ({ navigate }: { navigate: (path: string) => void }) => (
  <>
    <p className="text-lg md:text-xl text-primary-600/80 mb-4 text-center animate-fade-in">
      The Grand Adventure
    </p>
    
    <div className="relative w-24 h-24 mx-auto mb-4 animate-bounce-slow">
      <img 
        alt="Explorer Guide" 
        className="w-full h-full object-contain"
        src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png"
        loading="lazy"
      />
    </div>
    
    <div className="max-w-2xl mx-auto mb-6 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-primary-100 shadow-xl transform hover:scale-105 transition-all duration-300">
      <p className="animate-fade-in text-lg md:text-xl text-gray-600 text-center">
        Embark on an exciting journey through numbers, shapes, and mathematical wonders. Perfect for grades K1-G5.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200 mb-8">
      <Button 
        onClick={() => navigate('/login')} 
        size="lg" 
        className="group bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 text-base rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden"
      >
        <span className="relative z-10">Begin Your Quest</span>
        <MapPin className="w-4 h-4 group-hover:animate-bounce relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Button>
      
      <Button 
        onClick={() => navigate('/demo')} 
        variant="outline" 
        size="lg" 
        className="bg-white/80 hover:bg-primary-50 text-primary-600 border-primary-200 px-6 py-4 text-base rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
      >
        Try Demo
      </Button>
    </div>
  </>
);

// Content Sections Component
const ContentSections = () => (
  <div className="space-y-8">
    <Suspense fallback={<SectionLoader text="Unfurling the treasure map..." />}>
      <FeatureTimeline />
    </Suspense>

    <Suspense fallback={<SectionLoader text="Gathering fellow explorers..." />}>
      <ExplorerProfiles />
    </Suspense>

    <Suspense fallback={<SectionLoader text="Decoding ancient scrolls..." />}>
      <FAQSection />
    </Suspense>
  </div>
);

// Section Loader Component
const SectionLoader = ({ text }: { text: string }) => (
  <div className="w-full flex items-center justify-center p-4">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export default Hero;

