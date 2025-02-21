
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
      // Update sticky nav appearance
      setIsScrolled(window.scrollY > 50);

      // Update active section
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-primary-700">Math Mentor</span>
          </div>

          {/* Navigation Links */}
          <ScrollArea className="max-w-[600px]">
            <div className="flex items-center gap-8">
              {[
                { id: 'features', label: 'Features' },
                { id: 'stories', label: 'Success Stories' },
                { id: 'social-proof', label: 'Why Us' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors relative ${
                    activeSection === item.id
                      ? 'text-primary-700'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-primary-600 hover:text-primary-700"
              onClick={() => navigate('/login')}
            >
              <Star className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
