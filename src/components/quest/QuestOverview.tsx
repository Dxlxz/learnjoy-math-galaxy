
import React from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

interface QuestOverviewProps {
  sessionId: string | null;
  sessionStats: {
    totalQuestions: number;
    correctAnswers: number;
    finalScore: number;
    timeSpent: number;
    accuracy: number;
  };
  difficultyLevel: number;
}

const QuestOverview: React.FC<QuestOverviewProps> = ({
  sessionId,
  sessionStats,
  difficultyLevel,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
            <h1 className="text-3xl font-bold text-primary-600">Quest Complete!</h1>
            <p className="text-gray-600">Session ID: {sessionId}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-primary-600">{sessionStats.finalScore}</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-2xl font-bold text-primary-600">{sessionStats.accuracy.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-2xl font-bold text-primary-600">
                {Math.floor(sessionStats.timeSpent / 60)}m {sessionStats.timeSpent % 60}s
              </p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Final Level</p>
              <p className="text-2xl font-bold text-primary-600">{difficultyLevel}</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/explorer-map')}>
              Return to Map
            </Button>
            <Button onClick={() => navigate('/quest-chronicle')} variant="outline">
              View Progress
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestOverview;
