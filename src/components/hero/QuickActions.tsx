
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, Trophy, ScrollText, GamepadIcon } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Button
        onClick={() => navigate('/explorer-map')}
        className="h-auto py-6 text-lg font-semibold"
      >
        <Map className="mr-2 h-5 w-5" />
        View Explorer Map
      </Button>
      <Button
        onClick={() => navigate('/treasure-trail')}
        variant="secondary"
        className="h-auto py-6 text-lg font-semibold"
      >
        <Trophy className="mr-2 h-5 w-5" />
        My Treasure Trail
      </Button>
      <Button
        onClick={() => navigate('/quest-chronicle')}
        variant="secondary"
        className="h-auto py-6 text-lg font-semibold"
      >
        <ScrollText className="mr-2 h-5 w-5" />
        Quest Chronicle
      </Button>
      <Button
        onClick={() => navigate('/games-grotto')}
        variant="outline"
        className="h-auto py-6 text-lg font-semibold"
      >
        <GamepadIcon className="mr-2 h-5 w-5" />
        Games Grotto
      </Button>
    </div>
  );
};

export default QuickActions;
