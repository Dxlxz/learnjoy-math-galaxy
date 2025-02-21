
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
      <main className="relative min-h-screen bg-gradient-to-b from-[#E5DEFF] via-[#F5E6FF] to-white">
        <BackgroundEffects />
        
        <div className="relative z-10">
          {/* Hero Section with Grid Layout */}
          <section className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <HeaderSection />
                <p className="text-lg md:text-xl text-primary-600/80 animate-fade-in">
                  The Grand Adventure
                </p>
                <div className="max-w-xl bg-white/80 backdrop-blur-sm border-2 border-primary-100 shadow-lg p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <p className="animate-fade-in text-lg md:text-xl text-gray-600">
                    Embark on an exciting journey through numbers, shapes, and mathematical wonders. Perfect for grades K1-G5.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
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
                    className="bg-white/80 hover:bg-primary-50 text-primary-600 border-primary-200 px-6 py-4 text-base rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm hover:border-primary-300"
                  >
                    Try Demo
                  </Button>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center">
                <div className="w-48 h-48 mx-auto animate-bounce-slow">
                  <img 
                    alt="Explorer Guide" 
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                    src="https://xiomglpaumuuwqdpdvip.supabase.co/storage/v1/object/public/avatars//hand-drawn-brain-cartoon-illustration.png"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-16 bg-white/50">
            <div className="container mx-auto px-4 max-w-7xl">
              <h2 className="text-3xl font-bold text-center text-primary-700 mb-12">Key Features</h2>
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
                  <div key={index} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-primary-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary-700 text-center mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-16 bg-gradient-to-b from-white/50 to-primary-50/30">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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
                  <div key={index} className="p-6">
                    <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary-700 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-16 bg-white/50">
            <div className="container mx-auto px-4 max-w-7xl">
              <h2 className="text-3xl font-bold text-center text-primary-700 mb-12">Explorer Stories</h2>
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
                  <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold text-primary-700">{testimonial.name}</span>
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="text-sm text-primary-600 font-medium">{testimonial.achievement}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Content Sections with Proper Spacing */}
          <div ref={parentRef} className="bg-gradient-to-b from-transparent to-white">
            <div className="container mx-auto px-4 max-w-7xl">
              <div 
                ref={sectionRef} 
                className="grid gap-16 py-16"
              >
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
  <div className="absolute inset-0 w-full h-full z-0">
    <div className="absolute top-10 left-10 w-48 h-48 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
    <div className="absolute top-20 right-10 w-48 h-48 bg-primary-100/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-48 h-48 bg-primary-300/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float animation-delay-4000"></div>
    
    <MathSymbols />
  </div>
);

const MathSymbols = () => (
  <div className="absolute inset-0 pointer-events-none">
    {['÷', '×', '+', '−', '=', '∑', 'π', '∫', '√', '∞'].map((symbol, index) => (
      <div
        key={index}
        className="absolute text-xl text-primary-400/20 animate-float cursor-pointer transition-all duration-300 hover:text-primary-400/40 hover:scale-125"
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
    <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
    <h1 className="animate-fade-in text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 transition-colors duration-300 hover:from-primary-500 hover:to-primary-300">
      Math Mentor
    </h1>
    <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
  </div>
);

const SectionLoader = ({ text }: { text: string }) => (
  <div className="w-full animate-pulse space-y-4 p-6 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg transition-all duration-300">
    <div className="h-6 w-3/4 bg-primary-100 rounded-lg mx-auto"></div>
    <div className="space-y-3">
      <div className="h-4 w-full bg-primary-50 rounded"></div>
      <div className="h-4 w-5/6 bg-primary-50 rounded"></div>
      <div className="h-4 w-4/6 bg-primary-50 rounded"></div>
    </div>
    <div className="flex items-center justify-center mt-4">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

export default Hero;
