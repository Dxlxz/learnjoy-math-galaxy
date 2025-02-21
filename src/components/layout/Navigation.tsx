
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, GraduationCap, Star } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['hero', 'features', 'stories', 'social-proof'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' 
          : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 transition-transform hover:scale-105">
            <GraduationCap className="w-8 h-8 text-[#9b87f5]" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6]">
              Math Mentor
            </span>
          </div>

          {/* Navigation Links */}
          <ScrollArea className="max-w-[600px] hidden md:block">
            <div className="flex items-center gap-8">
              {[
                { id: 'features', label: 'Features' },
                { id: 'stories', label: 'Success Stories' },
                { id: 'social-proof', label: 'Why Us' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-all relative px-2 py-1 rounded-md ${
                    activeSection === item.id
                      ? 'text-[#9b87f5]'
                      : 'text-[#8E9196] hover:text-[#9b87f5] hover:bg-[#F1F0FB]'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9b87f5] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-[#9b87f5] hover:text-[#8B5CF6] hover:bg-[#F1F0FB]"
              onClick={() => navigate('/login')}
            >
              <Star className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white shadow-sm hover:shadow-md transition-all"
            >
              <Trophy className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Start Free Trial</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
