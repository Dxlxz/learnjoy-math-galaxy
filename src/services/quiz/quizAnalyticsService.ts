
import { supabase } from '@/integrations/supabase/client';
import { analyticsQueue } from './analyticsQueue';
import { AnalyticsData, QuestDetails, AchievementDetails, isQuestDetails, isAchievementDetails } from './types';
import { toast } from '@/hooks/use-toast';

class QuizAnalyticsService {
  async recordAnalytics(
    sessionId: string,
    userId: string,
    score: number,
    currentIndex: number,
    difficultyLevel: number,
    timeSpent: number,
    streak: number
  ): Promise<AnalyticsData> {
    console.log('[QuizAnalyticsService] Recording analytics:', {
      sessionId,
      score,
      currentIndex,
      difficultyLevel,
      timeSpent
    });

    try {
      // Validate input parameters
      if (!sessionId || !userId) {
        throw new Error('Session ID and User ID are required');
      }

      if (score < 0 || currentIndex < 0 || difficultyLevel < 1 || timeSpent < 0) {
        throw new Error('Invalid analytics parameters');
      }

      // Get user profile to ensure it exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('[QuizAnalyticsService] Profile fetch error:', profileError);
        toast({
          variant: "destructive",
          title: "Error recording analytics",
          description: "Could not fetch user profile. Please try again."
        });
        throw new Error('Failed to fetch user profile');
      }

      if (!profile) {
        console.error('[QuizAnalyticsService] User profile not found');
        toast({
          variant: "destructive",
          title: "Error recording analytics",
          description: "User profile not found. Please try again."
        });
        throw new Error('User profile not found');
      }

      // Get quiz session to get topic_id
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('topic_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError || !session?.topic_id) {
        console.error('[QuizAnalyticsService] Session fetch error:', sessionError);
        toast({
          variant: "destructive",
          title: "Error recording analytics",
          description: "Could not fetch quiz session data. Please try again."
        });
        throw new Error('Failed to fetch quiz session or topic_id is missing');
      }

      const questDetails: QuestDetails = {
        session_id: sessionId,
        questions_answered: currentIndex + 1,
        correct_answers: Math.floor(score / 10),
        total_questions: currentIndex + 1,
        difficulty_level: difficultyLevel,
        time_spent: timeSpent,
        start_time: new Date(Date.now() - timeSpent * 1000).toISOString(),
        end_time: new Date().toISOString(),
        topic_id: session.topic_id
      };

      // Validate quest details using type guard
      if (!isQuestDetails(questDetails)) {
        console.error('[QuizAnalyticsService] Invalid quest details:', questDetails);
        throw new Error('Invalid quest details structure');
      }

      const achievementDetails: AchievementDetails = {
        streak,
        max_streak: Math.max(streak, 0),
        points_earned: Math.max(0, score)
      };

      // Validate achievement details using type guard
      if (!isAchievementDetails(achievementDetails)) {
        console.error('[QuizAnalyticsService] Invalid achievement details:', achievementDetails);
        throw new Error('Invalid achievement details structure');
      }

      const analyticsData: AnalyticsData = {
        user_id: profile.id,
        metric_name: 'Quest Score',
        metric_value: Math.max(0, score),
        category: 'Learning Progress',
        recorded_at: new Date().toISOString(),
        quest_details: questDetails,
        achievement_details: achievementDetails
      };

      // Use the analyticsQueue to handle the insert
      await analyticsQueue.enqueue('recordQuizAnalytics', analyticsData);
      console.log('[QuizAnalyticsService] Analytics queued successfully');
      
      toast({
        title: "Analytics recorded",
        description: "Your quest progress has been saved successfully."
      });
      
      return analyticsData;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error queueing analytics:', error);
      toast({
        variant: "destructive",
        title: "Error recording analytics",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      throw error;
    }
  }

  async getUserAnalytics(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data: analytics, error } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });

      if (error) {
        console.error('[QuizAnalyticsService] Analytics fetch error:', error);
        toast({
          variant: "destructive",
          title: "Error fetching analytics",
          description: "Could not load your quest history. Please try again."
        });
        throw error;
      }

      return analytics;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error fetching user analytics:', error);
      toast({
        variant: "destructive",
        title: "Error fetching analytics",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      throw error;
    }
  }

  async getSessionAnalytics(sessionId: string) {
    try {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const { data: analytics, error } = await supabase
        .from('quest_analytics')
        .select('*')
        .eq('quest_details->>session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('[QuizAnalyticsService] Session analytics fetch error:', error);
        toast({
          variant: "destructive",
          title: "Error fetching session analytics",
          description: "Could not load session details. Please try again."
        });
        throw error;
      }

      return analytics;
    } catch (error) {
      console.error('[QuizAnalyticsService] Error fetching session analytics:', error);
      toast({
        variant: "destructive",
          title: "Error fetching session analytics",
          description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      throw error;
    }
  }
}

export const quizAnalyticsService = new QuizAnalyticsService();

