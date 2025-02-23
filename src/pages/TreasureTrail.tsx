
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Star, MapPin, Lock, CheckCircle, Crown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from '@/components/ui/error-boundary';

const TreasureTrail = () => {
  const navigate = useNavigate();

  // Hardcoded learning path data
  const learningPath = [
    {
      id: '1',
      title: "Number Recognition",
      description: "Master the basics of number recognition",
      status: 'completed',
      rewards: ['Number Master Badge', 'Perfect Score Trophy'],
      score: 100,
      completedAt: '2024-03-15',
    },
    {
      id: '2',
      title: "Addition Adventures",
      description: "Learn basic addition through fun challenges",
      status: 'available',
      prerequisites: [],
      recommendedNext: true,
    },
    {
      id: '3',
      title: "Subtraction Safari",
      description: "Explore the world of subtraction",
      status: 'locked',
      prerequisites: ['Addition Adventures'],
    },
    {
      id: '4',
      title: "Multiplication Quest",
      description: "Begin your multiplication journey",
      status: 'locked',
      prerequisites: ['Addition Adventures', 'Subtraction Safari'],
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'available':
        return <MapPin className="h-6 w-6 text-blue-500" />;
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-400" />;
      default:
        return <MapPin className="h-6 w-6 text-blue-500" />;
    }
  };

  const calculateProgress = () => {
    const completed = learningPath.filter(node => node.status === 'completed').length;
    return (completed / learningPath.length) * 100;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* Header Section */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-primary-600 mb-2 flex items-center justify-center gap-2">
                <Crown className="h-8 w-8 text-yellow-500" />
                Your Treasure Trail
              </h1>
              <p className="text-gray-600">
                Follow your personalized learning journey and collect achievements
              </p>
            </div>

            {/* Progress Overview */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            {/* Learning Path */}
            <div className="space-y-4">
              {learningPath.map((node, index) => (
                <Card 
                  key={node.id}
                  className={`p-6 transition-all duration-200 ${
                    node.status === 'completed' 
                      ? 'border-green-200 bg-green-50' 
                      : node.status === 'available'
                        ? 'border-blue-200 hover:border-blue-300'
                        : 'border-gray-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      node.status === 'completed' 
                        ? 'bg-green-100' 
                        : node.status === 'available'
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                    }`}>
                      {getStatusIcon(node.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{node.title}</h3>
                        {node.recommendedNext && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Recommended Next
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{node.description}</p>

                      {node.status === 'completed' && node.rewards && (
                        <div className="flex items-center gap-2 mt-3">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <div className="flex gap-2">
                            {node.rewards.map((reward, i) => (
                              <span 
                                key={i} 
                                className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200"
                              >
                                {reward}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {node.status === 'locked' && node.prerequisites && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                          <Lock className="h-4 w-4" />
                          <span>Prerequisites: {node.prerequisites.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {node.status === 'available' && (
                      <Button onClick={() => navigate(`/quest-challenge?topic=${node.id}`)}>
                        Begin Quest
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/explorer-map')}
              >
                Back to Map
              </Button>
              <Button onClick={() => navigate('/quest-chronicle')}>
                View Chronicle
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TreasureTrail;
