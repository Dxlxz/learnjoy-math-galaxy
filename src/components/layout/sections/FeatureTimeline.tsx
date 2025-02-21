
import React from 'react';
import { BookOpen, Target, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureTimeline = () => {
  return (
    <section 
      className="w-full max-w-4xl mb-16"
      aria-labelledby="learning-journey-title"
    >
      <h2 
        id="learning-journey-title"
        className="text-3xl font-bold text-primary-700 mb-8 text-center"
      >
        Your Learning Journey
      </h2>
      <div 
        className="relative"
        role="list"
        aria-label="Learning journey timeline"
      >
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-300"
          aria-hidden="true"
        ></div>
        
        {[{
          icon: BookOpen,
          title: "Interactive Lessons",
          description: "Engage with animated content and guided practice",
          ariaLabel: "Interactive Lessons feature"
        }, {
          icon: Target,
          title: "Adaptive Quests",
          description: "Face challenges that adapt to your skill level",
          ariaLabel: "Adaptive Quests feature"
        }, {
          icon: Trophy,
          title: "Achievement System",
          description: "Earn badges and unlock special rewards",
          ariaLabel: "Achievement System feature"
        }, {
          icon: Users,
          title: "Explorer Community",
          description: "Learn and grow alongside fellow adventurers",
          ariaLabel: "Explorer Community feature"
        }].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-8 mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            role="listitem"
            tabIndex={0}
            aria-label={item.ariaLabel}
          >
            <div 
              className={`flex-1 p-6 bg-[#FFF] border-2 border-primary-200 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 ${
                index % 2 === 0 ? 'text-right' : 'text-left'
              }`}
            >
              <h3 className="text-xl font-semibold text-primary-800 mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
            <div 
              className="relative z-10 flex items-center justify-center w-16 h-16 bg-primary-700 rounded-full"
              aria-hidden="true"
            >
              <item.icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureTimeline;

