
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Timer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import QuestQuestion from '@/components/quest/QuestQuestion';
import QuestFeedback from '@/components/quest/QuestFeedback';
import QuestOverview from '@/components/quest/QuestOverview';
import { useQuizSession } from '@/hooks/useQuizSession';

const MAX_QUESTIONS = 10;

const QuestChallenge: React.FC = () => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [countdownActive, setCountdownActive] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showStreakBadge, setShowStreakBadge] = useState(false);

  const {
    loading,
    currentQuestion,
    showFeedback,
    isCorrect,
    currentIndex,
    score,
    difficultyLevel,
    timeSpent,
    showOverview,
    sessionStats,
    handleAnswer,
    handleExit
  } = useQuizSession();

  useEffect(() => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error('Error attempting to enable fullscreen:', err);
    });

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
    };
  }, []);

  useEffect(() => {
    if (countdownActive && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdownActive(false);
    }
  }, [countdown, countdownActive]);

  if (countdownActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-8xl font-bold text-primary-600"
        >
          {countdown}
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Preparing your quest...</h2>
        </div>
      </div>
    );
  }

  if (showOverview) {
    return (
      <QuestOverview
        sessionId={null}
        sessionStats={sessionStats}
        difficultyLevel={difficultyLevel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExitDialog(true)}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Quest
        </Button>

        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Quest?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your progress will be lost and this session will be marked as incomplete.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Quest</AlertDialogCancel>
              <AlertDialogAction onClick={handleExit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Exit Quest
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="bg-white rounded-lg shadow-xl p-8 mt-12">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary-600">
                Quest Challenge
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Level {difficultyLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Score: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Progress value={((currentIndex) / MAX_QUESTIONS) * 100} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Question {currentIndex + 1} of {MAX_QUESTIONS}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {showStreakBadge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span>Hot Streak! 🔥</span>
              </motion.div>
            )}
          </AnimatePresence>

          <QuestQuestion
            currentQuestion={currentQuestion}
            handleAnswer={handleAnswer}
            showFeedback={showFeedback}
          />

          {showFeedback && currentQuestion && (
            <QuestFeedback
              isCorrect={isCorrect}
              explanation={currentQuestion.question.explanation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestChallenge;
