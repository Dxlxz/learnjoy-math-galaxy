import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { quizProgressService } from '@/features/quest/services/quizProgressService';
import { Question } from '@/types/explorer';

interface UseQuizProgressReturn {
  score: number;
  timeSpent: number;
  showOverview: boolean;
  sessionStats: any;
  streak: number;
  updateProgress: (
    sessionId: string,
    isCorrect: boolean,
    questionPoints: number,
    currentQuestion: {
      id: string;
      difficulty_level: number;
      points: number;
    },
    currentIndex: number
  ) => Promise<void>;
  finishQuiz: (
    sessionId: string,
    currentIndex: number,
    finalScore: number,
    difficultyLevel: number
  ) => Promise<void>;
}

export const useQuizProgress = (): UseQuizProgressReturn => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [sessionStats, setSessionStats] = useState(null);
  const [streak, setStreak] = useState(0);

  const updateProgress = useCallback(
    async (
      sessionId: string,
      isCorrect: boolean,
      questionPoints: number,
      currentQuestion: {
        id: string;
        difficulty_level: number;
        points: number;
      },
      currentIndex: number
    ) => {
      try {
        const { updatedScore, analyticsData } = await quizProgressService.updateProgress(
          sessionId,
          currentIndex,
          isCorrect,
          questionPoints,
          timeSpent,
          streak,
          1, // currentDifficulty, this needs to be dynamic
          score,
          currentQuestion
        );

        setScore(updatedScore);
        setTimeSpent(prevTime => prevTime + 10);
        setSessionStats(analyticsData);
        setStreak(isCorrect ? streak + 1 : 0);
      } catch (error: any) {
        console.error('Error updating progress:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update progress. Please try again.",
        });
      }
    },
    [score, timeSpent, streak, toast]
  );

  const finishQuiz = useCallback(
    async (sessionId: string, currentIndex: number, finalScore: number, difficultyLevel: number) => {
      try {
        const analyticsData = await quizProgressService.finishQuiz(
          sessionId,
          finalScore,
          currentIndex,
          timeSpent,
          difficultyLevel
        );

        setSessionStats(analyticsData);
        setScore(finalScore);
        setShowOverview(true);

        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (error: any) {
        console.error('Error finishing quiz:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to finish quiz. Please try again.",
        });
      } finally {
        setTimeout(() => {
          navigate('/explorer-map');
        }, 3000);
      }
    },
    [navigate, timeSpent, toast]
  );

  return {
    score,
    timeSpent,
    showOverview,
    sessionStats,
    streak,
    updateProgress,
    finishQuiz
  };
};
