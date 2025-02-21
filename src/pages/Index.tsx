
import React from 'react';
import Hero from '@/components/layout/Hero';
import Navigation from '@/components/layout/Navigation';
import { Progress } from '@/components/ui/progress';
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
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[51]">
        <Progress value={scrollProgress} className="h-1 rounded-none bg-primary-100" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-16">
        <Hero />
        <div className="flex flex-col items-center">
          <HowItWorksSection />
          <FAQSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
