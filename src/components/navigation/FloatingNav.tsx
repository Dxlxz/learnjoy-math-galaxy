
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowUp, 
  ArrowDown, 
  MapPin, 
  Map, 
  Trophy, 
  Wrench, 
  Star,
  ScrollText,
  LogOut
} from 'lucide-react';

const FloatingNav = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "See you next time, brave explorer!",
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: MapPin, route: '/hero-profile' },
    { label: 'Map', icon: Map, route: '/explorer-map' },
    { label: 'Quests', icon: Star, route: '/quest-challenge' },
    { label: 'Tools', icon: Wrench, route: '/games-grotto' },
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
              className="justify-start gap-2 hover:bg-red-100 hover:text-red-600 transition-all duration-200 group"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">Log Out</span>
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
