
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GradeSection } from '@/types/shared';
import { Star, Gamepad, Brain, Sparkles, Trophy, Medal } from 'lucide-react';
import { toast } from 'sonner';
import DiagnosticQuizModal from './DiagnosticQuizModal';
import { generateLearningPath } from '@/utils/learningPathGenerator';
import { useAuth } from '@/hooks/auth/useAuth';

interface GradeGatewayModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gradeSection: GradeSection | undefined;
  onStartAdventure: () => void;
}

const GradeGatewayModal = ({
  isOpen,
  onOpenChange,
  gradeSection,
  onStartAdventure
}: GradeGatewayModalProps) => {
  const [showDiagnosticQuiz, setShowDiagnosticQuiz] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { user } = useAuth();

  if (!gradeSection || !user) return null;

  const getMascotIcon = (grade: string) => {
    switch (grade) {
      case 'K1':
        return <Star className="w-16 h-16 text-[#FFD700] animate-pulse" />;
      case 'K2':
        return <Gamepad className="w-16 h-16 text-[#FF6B6B] animate-pulse" />;
      default:
        return <Brain className="w-16 h-16 text-[#5856D6] animate-pulse" />;
    }
  };

  const handleStartDiagnostic = () => {
    setShowDiagnosticQuiz(true);
  };

  const handleQuizComplete = async (score: number) => {
    setShowDiagnosticQuiz(false);
    
    try {
      // Generate personalized learning path
      const result = await generateLearningPath(user.id, gradeSection.grade);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to generate learning path');
      }

      // Show celebration animation
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onStartAdventure();
      }, 3000);

    } catch (error) {
      console.error('Error generating learning path:', error);
      toast.error("Couldn't create your learning path. Please try again.");
    }
  };

  const renderAchievements = () => (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="bg-white/90 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h4 className="font-semibold">Grade Champion</h4>
        </div>
        <p className="text-sm text-gray-600 mt-1">Complete all topics in this grade</p>
      </div>
      <div className="bg-white/90 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-blue-500" />
          <h4 className="font-semibold">Perfect Score</h4>
        </div>
        <p className="text-sm text-gray-600 mt-1">Ace a topic challenge</p>
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-[#FFDEE2] border-2">
          <DialogTitle className="text-2xl font-bold text-center">Begin Your Adventure</DialogTitle>
          {showCelebration ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-6">
              <Sparkles className="w-24 h-24 text-yellow-400 animate-bounce" />
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#1A1F2C] to-[#8B5CF6] bg-clip-text text-transparent">
                Your Adventure Begins!
              </h2>
              <p className="text-lg text-center text-gray-700">
                Get ready to embark on an amazing journey of discovery and learning!
              </p>
              <div className="animate-pulse">
                <Sparkles className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 p-6">
              {/* Mascot and Title */}
              <div className="flex items-center justify-center space-x-4">
                {getMascotIcon(gradeSection.grade)}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1A1F2C] to-[#8B5CF6] bg-clip-text text-transparent">
                  {gradeSection.title}
                </h2>
              </div>

              {/* Description */}
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700">
                  Embark on an amazing journey through:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {gradeSection.tools.map((tool, index) => (
                    <div 
                      key={index}
                      className="bg-white/80 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <tool.icon className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements Section */}
              {renderAchievements()}

              {/* Adventure Button */}
              <Button 
                onClick={handleStartDiagnostic}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#D6BCFA] hover:from-[#7C3AED] hover:to-[#C4B5FD] text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              >
                Start Your Adventure! ✨
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DiagnosticQuizModal
        isOpen={showDiagnosticQuiz}
        onOpenChange={setShowDiagnosticQuiz}
        grade={gradeSection.grade}
        onComplete={handleQuizComplete}
      />
    </>
  );
};

export default GradeGatewayModal;
