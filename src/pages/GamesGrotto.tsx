import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LeaderboardPanel from '@/components/games/LeaderboardPanel';

const GamesGrotto = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Games Grotto</h1>
          <Button variant="outline" onClick={() => navigate('/hero-profile')}>
            Back to Profile
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Game cards will go here */}
              <div className="text-center text-gray-500 p-8">
                More games coming soon!
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <LeaderboardPanel gameType="number_recognition" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesGrotto;