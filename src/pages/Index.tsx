
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/layout/Hero';
import Navigation from '@/components/layout/Navigation';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import HowItWorksSection from '@/components/layout/sections/HowItWorksSection';
import ExplorerProfiles from '@/components/layout/sections/ExplorerProfiles';
import FAQSection from '@/components/layout/sections/FAQSection';

const Index = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-[#F1F0FB] to-[#E5DEFF]">
      <Helmet>
        <title>Math Mentor - Transform Math Learning into an Adventure | K-5 Math Games</title>
        <meta name="description" content="Make math fun and engaging with Math Mentor's personalized learning adventures! Our game-based platform helps K-5 students master mathematics through interactive quests, rewards, and adaptive challenges." />
        <meta name="keywords" content="math games, elementary math, K-5 math learning, interactive math, math tutor, educational games" />
        <meta property="og:title" content="Math Mentor - Transform Math Learning into an Adventure" />
        <meta property="og:description" content="Join Math Mentor's magical quest where every young learner becomes a math explorer through personalized, game-based learning adventures!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://mathmentor.lovable.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="canonical" href="https://mathmentor.lovable.dev" />
      </Helmet>

      <div className="fixed top-0 left-0 right-0 z-[51]">
        <Progress value={scrollProgress} className="h-1 rounded-none bg-primary-100" />
      </div>

      <Navigation />

      <main className="pt-16">
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading your adventure..." />}>
          <Hero />
          <HowItWorksSection />
          <ExplorerProfiles />
          <FAQSection />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
