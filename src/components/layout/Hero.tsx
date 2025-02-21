
import React, { lazy, Suspense, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, MapPin, Brain, Users, Trophy, Star,
  Award, GraduationCap, Calculator
} from 'lucide-react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const FeatureTimeline = lazy(() => import('./sections/FeatureTimeline'));
const ExplorerProfiles = lazy(() => import('./sections/ExplorerProfiles'));
const FAQSection = lazy(() => import('./sections/FAQSection'));

const Hero = () => {
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);
  const [sectionRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  React.useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <main className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E5DEFF] via-[#F5E6FF] to-white">
          <BackgroundEffects />
        </div>
        
        <div className="relative z-10">
          {/* Hero Section with Grid Layout */}
          <section className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <HeaderSection />
                <p className="text-lg md:text-xl text-primary-600/80 animate-fade-in">
                  The Grand Adventure
                </p>
                <div className="max-w-xl bg-white/80 backdrop-blur-sm border-2 border-primary-100 shadow-lg p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4 mb-6">
                    <img
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
                      alt="Student using Math Mentor"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <p className="animate-fade-in text-lg md:text-xl text-gray-600">
                      Embark on an exciting journey through numbers, shapes, and mathematical wonders. Perfect for grades K1-G5.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-start">
                    <Button 
                      onClick={() => navigate('/login')} 
                      size="lg" 
                      className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 relative overflow-hidden flex-grow sm:flex-grow-0"
                    >
                      <span className="relative z-10">Begin Your Quest</span>
                      <MapPin className="w-5 h-5 group-hover:animate-bounce relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                    
                    <Button 
                      onClick={() => navigate('/demo')} 
                      variant="outline" 
                      size="lg" 
                      className="bg-white/80 hover:bg-primary-50 text-primary-600 border-primary-200 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm hover:border-primary-300"
                    >
                      Try Demo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
                    alt="Interactive learning experience"
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                    alt="Student engagement"
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="relative flex items-center justify-center">
                <div className="w-48 h-48 mx-auto animate-bounce-slow relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                  <img 
                    alt="Explorer Guide" 
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110 relative z-10"
                    src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid with Enhanced Visual Design */}
          <section className="py-24 bg-gradient-to-b from-white/50 to-primary-50/30">
            <div className="container mx-auto px-4 max-w-7xl">
              <h2 className="text-3xl font-bold text-center text-primary-700 mb-16">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Brain,
                    title: "Adaptive Learning",
                    description: "Personalized learning paths that adjust to your progress"
                  },
                  {
                    icon: Trophy,
                    title: "Achievement System",
                    description: "Earn badges and rewards as you master new concepts"
                  },
                  {
                    icon: Calculator,
                    title: "Interactive Tools",
                    description: "Hands-on learning with virtual math manipulatives"
                  }
                ].map((feature, index) => (
                  <div key={index} className="group p-8 bg-white/90 backdrop-blur-sm border-2 border-primary-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-primary-700 text-center mb-4">{feature.title}</h3>
                    <p className="text-gray-600 text-center text-lg">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Statistics Section with Enhanced Visual Design */}
          <section className="py-24 bg-gradient-to-b from-primary-50/30 to-white/50">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    icon: Users,
                    value: "10,000+",
                    label: "Active Explorers"
                  },
                  {
                    icon: Star,
                    value: "1M+",
                    label: "Questions Solved"
                  },
                  {
                    icon: Award,
                    value: "50,000+",
                    label: "Badges Earned"
                  }
                ].map((stat, index) => (
                  <div key={index} className="p-8 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <stat.icon className="w-12 h-12 text-primary-600 mx-auto mb-6" />
                    <div className="text-4xl font-bold text-primary-700 mb-3 text-center">{stat.value}</div>
                    <div className="text-gray-600 text-xl text-center">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Proof Section with Enhanced Visual Design */}
          <section className="py-24 bg-gradient-to-b from-white/50 to-primary-50/30">
            <div className="container mx-auto px-4 max-w-7xl">
              <h2 className="text-3xl font-bold text-center text-primary-700 mb-16">Explorer Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Sarah, Grade 4",
                    quote: "Math used to be scary, but now it's like going on an adventure every day!",
                    achievement: "Number Master"
                  },
                  {
                    name: "Mike, Grade 3",
                    quote: "I love collecting badges while learning new things. It's super fun!",
                    achievement: "Pattern Explorer"
                  },
                  {
                    name: "Emily, Grade 5",
                    quote: "The interactive tools helped me understand fractions better than ever.",
                    achievement: "Problem Solver"
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-100">
                    <div className="flex items-center gap-3 mb-6">
                      <GraduationCap className="w-8 h-8 text-primary-600" />
                      <span className="font-semibold text-xl text-primary-700">{testimonial.name}</span>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg italic">"{testimonial.quote}"</p>
                    <div className="text-primary-600 font-medium text-lg">{testimonial.achievement}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Content Sections with Proper Spacing */}
          <div ref={parentRef} className="bg-gradient-to-b from-transparent to-white">
            <div className="container mx-auto px-4 max-w-7xl">
              <div ref={sectionRef} className="grid gap-24 py-24">
                <Suspense fallback={<SectionLoader text="Unfurling the treasure map..." />}>
                  {isVisible && <FeatureTimeline />}
                </Suspense>

                <Suspense fallback={<SectionLoader text="Gathering fellow explorers..." />}>
                  {isVisible && <ExplorerProfiles />}
                </Suspense>

                <Suspense fallback={<SectionLoader text="Decoding ancient scrolls..." />}>
                  {isVisible && <FAQSection />}
                </Suspense>
              </div>
            </div>
          </div>
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

const HeaderSection = () => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
    <h1 className="animate-fade-in text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 transition-colors duration-300 hover:from-primary-500 hover:to-primary-300">
      Math Mentor
    </h1>
    <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
  </div>
);

const SectionLoader = ({ text }: { text: string }) => (
  <div className="w-full animate-pulse space-y-4 p-8 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg transition-all duration-300">
    <div className="h-8 w-3/4 bg-primary
-100 rounded-lg mx-auto"></div>
    <div className="space-y-4">
      <div className="h-4 w-full bg-primary-50 rounded"></div>
      <div className="h-4 w-5/6 bg-primary-50 rounded"></div>
      <div className="h-4 w-4/6 bg-primary-50 rounded"></div>
    </div>
    <div className="flex items-center justify-center mt-6">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

export default Hero;

