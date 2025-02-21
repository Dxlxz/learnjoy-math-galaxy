
import React from 'react';
import { Users } from 'lucide-react';

const ExplorerProfiles = () => {
  return (
    <div className="w-full max-w-4xl mb-16">
      <h2 className="text-3xl font-bold text-primary-600 mb-8 text-center">Featured Explorers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{
          name: "Alex",
          grade: "Grade 3",
          achievement: "Number Ninja Master",
          progress: "Completed 50 quests"
        }, {
          name: "Maria",
          grade: "Grade 4",
          achievement: "Pattern Explorer Elite",
          progress: "Earned 25 badges"
        }, {
          name: "Jordan",
          grade: "Grade 2",
          achievement: "Geometry Pioneer",
          progress: "Perfect score streak"
        }].map((explorer, index) => (
          <div key={index} className="p-6 bg-[#FEF7CD]/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary-700 text-center mb-2">{explorer.name}</h3>
            <p className="text-gray-600 text-center mb-2">{explorer.grade}</p>
            <p className="text-primary-600 font-medium text-center mb-1">{explorer.achievement}</p>
            <p className="text-sm text-gray-500 text-center">{explorer.progress}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorerProfiles;
