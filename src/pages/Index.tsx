
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/layout/Hero';
import Navigation from '@/components/layout/Navigation';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import HowItWorksSection from '@/components/layout/sections/HowItWorksSection';
import FAQSection from '@/components/layout/sections/FAQSection';

const Index = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FEF7CD] via-[#FDE1D3] to-[#E5DEFF]">
      <Helmet>
        <title>Math Mentor - The Grand Adventure | Make Learning Math Fun</title>
        <meta name="description" content="Transform math learning into an exciting adventure! Join Math Mentor for personalized, game-based learning that makes mathematics fun and engaging for K-5 students." />
        <meta property="og:title" content="Math Mentor - The Grand Adventure" />
        <meta property="og:description" content="Make learning math fun with personalized, game-based adventures!" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="canonical" href="https://mathmentor.lovable.dev" />
      </Helmet>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[51]">
        <Progress value={scrollProgress} className="h-1 rounded-none bg-primary-100" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="pt-16">
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading your adventure..." />}>
          <Hero />
          <div className="flex flex-col items-center">
            <HowItWorksSection />
            <FAQSection />
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
