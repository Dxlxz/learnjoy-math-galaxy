
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Book, GamepadIcon, Crown } from 'lucide-react';

interface HeroBannerProps {
  heroName: string;
  grade: string;
  stats: {
    total_completed: number;
    average_score: number;
  };
}

const HeroBanner = ({ heroName, grade, stats }: HeroBannerProps) => {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          {heroName}'s Quest Command Center
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4 p-6">
        <div className="text-center space-y-2">
          <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
          <h3 className="font-semibold">Quests Completed</h3>
          <p className="text-2xl font-bold text-primary">{stats.total_completed}</p>
        </div>
        <div className="text-center space-y-2">
          <Book className="h-8 w-8 mx-auto text-blue-500" />
          <h3 className="font-semibold">Current Grade</h3>
          <p className="text-2xl font-bold text-primary">{grade}</p>
        </div>
        <div className="text-center space-y-2">
          <GamepadIcon className="h-8 w-8 mx-auto text-green-500" />
          <h3 className="font-semibold">Average Score</h3>
          <p className="text-2xl font-bold text-primary">{stats.average_score}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroBanner;
