
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowUp, 
  ArrowDown, 
  MapPin, 
  Map, 
  Trophy, 
  Wrench, 
  Star, 
  LogOut, 
  ScrollText,
  Shapes 
} from 'lucide-react';

const FloatingNav = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', icon: MapPin, route: '/hero-profile' },
    { label: 'Map', icon: Map, route: '/explorer-map' },
    { label: 'Quests', icon: Star, route: '/quest-challenge' },
    { label: 'Tools', icon: Wrench, route: '/games-grotto' },
    { label: 'Toolkit', icon: Shapes, route: '/explorers-toolkit' },
    { label: 'Rewards', icon: Trophy, route: '/treasure-trail' },
    { label: 'Chronicle', icon: ScrollText, route: '/quest-chronicle' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded && (
        <Card className="mb-2 p-2 bg-white/95 backdrop-blur-sm animate-fade-in border-2 border-primary/20 shadow-lg shadow-primary/10">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="justify-start gap-2 hover:bg-primary-100 hover:text-primary transition-all duration-200 group"
                onClick={() => navigate(item.route)}
              >
                <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</span>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
              onClick={() => navigate('/login')}
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">End Adventure</span>
            </Button>
          </div>
        </Card>
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg bg-white hover:bg-primary-50 border-2 border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ArrowDown className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-110" />
        ) : (
          <ArrowUp className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-110" />
        )}
      </Button>
    </div>
  );
};

export default FloatingNav;
