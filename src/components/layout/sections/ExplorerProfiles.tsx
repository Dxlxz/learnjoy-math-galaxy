
import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ExplorerProfiles = () => {
  return (
    <section 
      className="w-full max-w-4xl mb-16"
      aria-labelledby="explorer-profiles-title"
    >
      <h2 
        id="explorer-profiles-title"
        className="text-3xl font-bold text-primary-700 mb-8 text-center"
      >
        Featured Explorers
      </h2>
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        role="list"
        aria-label="Featured explorer profiles"
      >
        {[{
          name: "Alex",
          grade: "Grade 3",
          achievement: "Number Ninja Master",
          progress: "Completed 50 quests",
          ariaLabel: "Explorer Alex's profile card"
        }, {
          name: "Maria",
          grade: "Grade 4",
          achievement: "Pattern Explorer Elite",
          progress: "Earned 25 badges",
          ariaLabel: "Explorer Maria's profile card"
        }, {
          name: "Jordan",
          grade: "Grade 2",
          achievement: "Geometry Pioneer",
          progress: "Perfect score streak",
          ariaLabel: "Explorer Jordan's profile card"
        }].map((explorer, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-[#FFF] border-2 border-primary-200 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
            role="listitem"
            tabIndex={0}
            aria-label={explorer.ariaLabel}
          >
            <div 
              className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
              <Users className="w-8 h-8 text-primary-700" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 text-center mb-2">{explorer.name}</h3>
            <p className="text-gray-700 text-center mb-2">{explorer.grade}</p>
            <p className="text-primary-700 font-medium text-center mb-1">{explorer.achievement}</p>
            <p className="text-sm text-gray-600 text-center">{explorer.progress}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExplorerProfiles;

