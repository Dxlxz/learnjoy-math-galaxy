
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Star,
} from 'lucide-react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E5DEFF] via-[#F5E6FF] to-white">
          <BackgroundEffects />
        </div>
        
        <div className="relative z-10">
          {/* Hero Section with Side-by-Side Layout */}
          <section id="hero" className="min-h-[90vh] flex items-center">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content Column */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Star className="w-8 h-8 text-primary-600 animate-pulse" />
                      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 leading-tight">
                        Transform Math into an Epic Adventure
                      </h1>
                    </div>
                    
                    <p className="text-xl md:text-2xl text-gray-600 animate-fade-in leading-relaxed">
                      Watch your child's confidence soar as they master math through exciting quests and rewards. Perfect for grades K1-G5.
                    </p>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <Button 
                        onClick={() => navigate('/demo')} 
                        size="lg" 
                        className="group bg-accent-500 hover:bg-accent-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                      >
                        <Star className="w-6 h-6" />
                        Watch Demo
                      </Button>

                      <Button 
                        onClick={() => navigate('/login')} 
                        size="lg" 
                        className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                      >
                        <span>Begin Your Quest</span>
                        <MapPin className="w-5 h-5 group-hover:animate-bounce" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-primary-100 shadow-lg space-y-4">
                    <h3 className="text-xl font-semibold text-primary-700">
                      Parents & Teachers Love Math Mentor
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-full">
                          <Star className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-gray-600">Adaptive Learning</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-full">
                          <MapPin className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-gray-600">Progress Tracking</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Visual Column */}
                <div className="relative">
                  <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-primary-50/30" />
                    <img
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                      alt="Student engaging with Math Mentor"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 animate-bounce-slow">
                        <img 
                          alt="Explorer Guide" 
                          className="w-full h-full object-contain drop-shadow-xl"
                          src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating Achievement Cards */}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-lg border border-primary-100 animate-float">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-primary-700">50,000+ Badges Earned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Subtle Geometric Patterns */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-5">
          <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />
        </div>
      </main>
    </ErrorBoundary>
  );
};

const BackgroundEffects = () => (
  <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
    <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
    <div className="absolute top-20 right-10 w-64 h-64 bg-primary-100/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-64 h-64 bg-primary-300/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
    
    <MathSymbols />
  </div>
);

const MathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none">
    {['÷', '×', '+', '−', '=', '∑', 'π', '∫', '√', '∞'].map((symbol, index) => (
      <div
        key={index}
        className="absolute text-2xl text-primary-400/20 animate-float cursor-default transition-all duration-300 hover:text-primary-400/40 hover:scale-125"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${index * 0.5}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
        }}
      >
        {symbol}
      </div>
    ))}
  </div>
);

export default Hero;

