
import React from 'react';
import { Users } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const ExplorerProfiles = () => {
  const profiles = [
    {
      name: "Sarah M.",
      role: "Parent",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      quote: "My daughter's confidence in math has skyrocketed since using Math Mentor!"
    },
    {
      name: "Mr. Johnson",
      role: "Math Teacher",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      quote: "The interactive quests make learning math genuinely fun for students."
    },
    {
      name: "Emily K.",
      role: "Student - Grade 4",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop",
      quote: "I love earning badges while solving math problems!"
    }
  ];

  return (
    <section 
      className="py-8 sm:py-12 md:py-16 bg-white/50 backdrop-blur-sm"
      aria-labelledby="explorers-section-title"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Users 
              className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" 
              aria-hidden="true"
            />
            <h2 
              id="explorers-section-title"
              className="text-2xl sm:text-3xl font-bold text-primary-700"
            >
              Our Explorers' Stories
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-700">
            Join our growing community of math adventurers!
          </p>
        </header>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          role="list"
          aria-label="Explorer testimonials"
        >
          {profiles.map((profile, index) => (
            <article 
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              role="listitem"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Avatar className="w-14 h-14 sm:w-16 sm:h-16">
                  <img 
                    src={profile.image} 
                    alt={`${profile.name} - ${profile.role}`}
                    className="object-cover w-14 h-14 sm:w-16 sm:h-16"
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                  />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-primary-800">
                    {profile.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    {profile.role}
                  </p>
                </div>
              </div>
              <blockquote className="text-sm sm:text-base text-gray-700 italic">
                <p>"{profile.quote}"</p>
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorerProfiles;
