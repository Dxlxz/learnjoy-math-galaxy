
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, MapPin, Map, Trophy, Wrench, Star, LogOut } from 'lucide-react';

const FloatingNav = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', icon: MapPin, route: '/hero-profile' },
    { label: 'Map', icon: Map, route: '/explorer-map' },
    { label: 'Quests', icon: Star, route: '/quest-challenge' },
    { label: 'Tools', icon: Wrench, route: '/games-grotto' },
    { label: 'Rewards', icon: Trophy, route: '/treasure-trail' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded && (
        <Card className="mb-2 p-2 bg-white/95 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="justify-start gap-2 hover:bg-primary-50"
                onClick={() => navigate(item.route)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => navigate('/login')}
            >
              <LogOut className="h-4 w-4" />
              <span>End Adventure</span>
            </Button>
          </div>
        </Card>
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full shadow-lg bg-white hover:bg-primary-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ArrowDown className="h-4 w-4 text-primary" />
        ) : (
          <ArrowUp className="h-4 w-4 text-primary" />
        )}
      </Button>
    </div>
  );
};

export default FloatingNav;
