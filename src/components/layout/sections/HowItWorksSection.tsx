
import React, { lazy, Suspense } from 'react';
import { BookOpen, Brain, Star, Trophy } from 'lucide-react';
import HowItWorksSkeletonLoader from './HowItWorksSkeletonLoader';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const HowItWorksSection = () => {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-white via-purple-50 to-secondary-50" 
      id="how-it-works"
      aria-label="How Math Mentor Works"
    >
      <Suspense fallback={<HowItWorksSkeletonLoader />}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-700 text-center mb-12">
            Your Learning Adventure
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "1. Choose Your Path",
                description: "Select your grade level and begin your magical journey through mathematics."
              },
              {
                icon: Brain,
                title: "2. Adaptive Learning",
                description: "Our smart system adjusts to your pace, ensuring you're always challenged just right."
              },
              {
                icon: Star,
                title: "3. Practice & Play",
                description: "Learn through interactive games and quests that make math fun and engaging."
              },
              {
                icon: Trophy,
                title: "4. Earn Rewards",
                description: "Collect badges, points, and treasures as you master new mathematical concepts."
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-primary-100 shadow-lg transition-all duration-300 ${
                  isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
                role="article"
                aria-label={`Step ${index + 1}: ${step.title}`}
              >
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg"
                  aria-hidden="true"
                >
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-semibold text-primary-700 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Suspense>
    </section>
  );
};

export default HowItWorksSection;
