
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
    <section className="py-16 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-8 h-8 text-primary-600" aria-hidden="true" />
            <h2 className="text-3xl font-bold text-primary-600">Our Explorers' Stories</h2>
          </div>
          <p className="text-xl text-gray-600">Join our growing community of math adventurers!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <img 
                    src={profile.image} 
                    alt={`${profile.name} - ${profile.role}`}
                    className="object-cover w-16 h-16"
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                  />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-primary-700">{profile.name}</h3>
                  <p className="text-gray-500">{profile.role}</p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic">"{profile.quote}"</blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorerProfiles;

