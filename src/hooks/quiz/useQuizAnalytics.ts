
import { useToast } from "@/hooks/use-toast";
import { quizAnalyticsService } from '@/services/quiz/quizAnalyticsService';
import { AnalyticsData } from '@/services/quiz/types';

interface UseQuizAnalyticsReturn {
  recordProgress: (
    sessionId: string,
    userId: string,
    score: number,
    currentIndex: number,
    difficultyLevel: number,
    timeSpent: number,
    streak: number
  ) => Promise<void>;
  getUserStats: (userId: string) => Promise<any>;
  getSessionStats: (sessionId: string) => Promise<any>;
}

export const useQuizAnalytics = (): UseQuizAnalyticsReturn => {
  const { toast } = useToast();

  const recordProgress = async (
    sessionId: string,
    userId: string,
    score: number,
    currentIndex: number,
    difficultyLevel: number,
    timeSpent: number,
    streak: number
  ) => {
    try {
      await quizAnalyticsService.recordAnalytics(
        sessionId,
        userId,
        score,
        currentIndex,
        difficultyLevel,
        timeSpent,
        streak
      );
    } catch (error) {
      console.error('[useQuizAnalytics] Error recording analytics:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record progress. Please try again.",
      });
      throw error;
    }
  };

  const getUserStats = async (userId: string) => {
    try {
      return await quizAnalyticsService.getUserAnalytics(userId);
    } catch (error) {
      console.error('[useQuizAnalytics] Error fetching user stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user statistics.",
      });
      throw error;
    }
  };

  const getSessionStats = async (sessionId: string) => {
    try {
      return await quizAnalyticsService.getSessionAnalytics(sessionId);
    } catch (error) {
      console.error('[useQuizAnalytics] Error fetching session stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch session statistics.",
      });
      throw error;
    }
  };

  return {
    recordProgress,
    getUserStats,
    getSessionStats
  };
};
