
import React from 'react';
import { BookOpen, Target, Trophy, Users } from 'lucide-react';

const FeatureTimeline = () => {
  return (
    <div className="w-full max-w-4xl mb-16">
      <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">Your Learning Journey</h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
        
        {[{
          icon: BookOpen,
          title: "Interactive Lessons",
          description: "Engage with animated content and guided practice"
        }, {
          icon: Target,
          title: "Adaptive Quests",
          description: "Face challenges that adapt to your skill level"
        }, {
          icon: Trophy,
          title: "Achievement System",
          description: "Earn badges and unlock special rewards"
        }, {
          icon: Users,
          title: "Explorer Community",
          description: "Learn and grow alongside fellow adventurers"
        }].map((item, index) => (
          <div key={index} className={`flex items-center gap-8 mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`flex-1 p-6 bg-[#FEF7CD]/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl font-semibold text-primary-700 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full transform transition-transform hover:scale-110">
              <item.icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureTimeline;
